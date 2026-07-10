import PDFDocument from "pdfkit";
import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  const employee = await prisma.employee.findFirst({
    where: {
      id,
      deleted_at: null,
    },

    include: {
      position: true,
      department: true,
      educations: true,
    },
  });

  if (!employee) {
    throw createError({
      statusCode: 404,
      message: "Pegawai tidak ditemukan",
    });
  }

  const pdfBuffer = await new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    doc.fontSize(18).text("DATA PEGAWAI", {
      align: "center",
    });

    doc.moveDown();

    [
      ["NIP", employee.nip],
      ["Nama", employee.name],
      ["Email", employee.email ?? "-"],
      ["Nomor HP", employee.phone ?? "-"],
      ["Jabatan", employee.position?.name ?? "-"],
      ["Departemen", employee.department?.name ?? "-"],
    ].forEach(([label, value]) => {
      doc.fontSize(11).text(`${label}: ${value}`);
      doc.moveDown(0.3);
    });

    doc.moveDown();

    doc.fontSize(13).text("Pendidikan");

    employee.educations.forEach((item) => {
      doc
        .fontSize(11)
        .text(
          `${item.education_level} - ${item.school_name} (${item.graduation_year})`,
        );
    });

    doc.end();
  });

  setHeader(event, "Content-Type", "application/pdf");

  setHeader(
    event,
    "Content-Disposition",
    `inline; filename="pegawai-${employee.nip}.pdf"`,
  );

  return pdfBuffer;
});

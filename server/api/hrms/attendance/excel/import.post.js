import ExcelJS from "exceljs";
import { prisma } from "#root/server/db/prisma.js";
import { calculateAttendance } from "#root/server/utils/attendance.js";

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event);

    const file = files?.find((item) => item.name === "file");

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: "File Excel tidak ditemukan",
      });
    }

    const job = await prisma.attendanceImport.create({
      data: {
        file_name: file.filename,
        status: "processing",
      },
    });

    processImport(file.data, job.id);

    return {
      success: true,
      message: "Import sedang diproses",
      job_id: job.id,
    };
  } catch (error) {
    console.error("Import Excel Error:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Terjadi kesalahan saat import Excel",
    });
  }
});

async function processImport(buffer, jobId) {
  try {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      throw new Error("Sheet Excel tidak ditemukan");
    }

    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const nip = row.getCell(1).value;

      if (!nip) return;

      rows.push({
        nip: String(nip),

        tanggal: row.getCell(2).value,

        checkin: row.getCell(3).value,

        checkout: row.getCell(4).value,

        lokasi_checkin: row.getCell(5).value,

        lokasi_checkout: row.getCell(6).value,

        keterangan: row.getCell(7).value,
      });
    });

    for (const item of rows) {
      const employee = await prisma.employee.findUnique({
        where: {
          nip: item.nip,
        },
      });

      if (!employee) {
        continue;
      }

      const hasilAbsensi = calculateAttendance({
        checkin: item.checkin,

        checkout: item.checkout,

        lokasi_checkin: item.lokasi_checkin,

        lokasi_checkout: item.lokasi_checkout,
      });

      await prisma.attendance.create({
        data: {
          employee_id: employee.id,

          tanggal: item.tanggal,

          checkin: item.checkin,

          checkout: item.checkout,

          lokasi_checkin: item.lokasi_checkin,

          lokasi_checkout: item.lokasi_checkout,

          keterangan: item.keterangan,
          status_hadir: hasilAbsensi.status_hadir,

          hadir: hasilAbsensi.hadir,

          durasi_kerja: hasilAbsensi.durasi_kerja,
        },
      });
    }

    await prisma.attendanceImport.update({
      where: {
        id: jobId,
      },

      data: {
        status: "completed",

        finished_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Background Import Error:", error);

    await prisma.attendanceImport.update({
      where: {
        id: jobId,
      },

      data: {
        status: "failed",

        error_message: error.message,
      },
    });
  }
}

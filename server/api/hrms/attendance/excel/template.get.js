import ExcelJS from "exceljs";

export default defineEventHandler(async (event) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Presensi");

  worksheet.columns = [
    { header: "NIP", key: "nip", width: 20 },
    { header: "Tanggal", key: "tanggal", width: 15 },
    { header: "Checkin", key: "checkin", width: 12 },
    { header: "Checkout", key: "checkout", width: 12 },
    { header: "Lokasi Checkin", key: "lokasi_checkin", width: 25 },
    { header: "Lokasi Checkout", key: "lokasi_checkout", width: 25 },
    { header: "Keterangan", key: "keterangan", width: 20 },
  ];

  worksheet.addRow({
    nip: "",
    tanggal: "2026-07-01",
    checkin: "08:00",
    checkout: "17:00",
    lokasi_checkin: "Gedung Utama",
    lokasi_checkout: "Gedung Utama",
    keterangan: "",
  });

  const buffer = await workbook.xlsx.writeBuffer();

  event.node.res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  event.node.res.setHeader(
    "Content-Disposition",
    'attachment; filename="template-presensi.xlsx"',
  );

  return buffer;
});

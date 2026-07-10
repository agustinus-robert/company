import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const year = query.year ? Number(query.year) : new Date().getFullYear();

    const month = query.month ? Number(query.month) : new Date().getMonth() + 1;

    const data = await prisma.attendanceSummary.findMany({
      where: {
        period_year: year,
        period_month: month,
      },

      include: {
        employee: {
          select: {
            id: true,
            name: true,
            nip: true,

            position: {
              select: {
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        employee: {
          name: "asc",
        },
      },
    });

    const result = data.map((item) => ({
      id: item.id,

      employee_id: item.employee_id,

      name: item.employee.name,

      nip: item.employee.nip,

      position: item.employee.position,

      hadir: Number(item.hadir),

      status_hadir:
        item.status_hadir === "terpenuhi" ? "Terpenuhi" : "Tidak terpenuhi",

      cuti: Number(item.cuti),

      kuota_cuti: Number(item.kuota_cuti),

      izin: Number(item.izin),

      kuota_izin: Number(item.kuota_izin),

      unpaid_leave: Number(item.unpaid_leave),

      kuota_unpaid_leave: Number(item.kuota_unpaid_leave),
    }));

    return {
      success: true,
      period: {
        year,
        month,
      },
      data: result,
    };
  } catch (error) {
    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data summary presensi",
    });
  }
});

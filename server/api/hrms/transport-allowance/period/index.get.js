import { prisma } from "#root/server/db/prisma.js";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const search = (query.search ?? "").toString().toLowerCase();
    const year = query.year ? Number(query.year) : null;

    const skip = (page - 1) * limit;

    const where = {};

    if (year) {
      where.period_year = year;
    }

    const [rows, total] = await Promise.all([
      prisma.transportAllowancePeriod.findMany({
        where,
        orderBy: [
          {
            period_year: "desc",
          },
          {
            period_month: "desc",
          },
        ],
        skip,
        take: limit,
      }),
      prisma.transportAllowancePeriod.count({
        where,
      }),
    ]);

    let data = rows.map((item) => ({
      id: item.id,
      period_year: item.period_year,
      period_month: item.period_month,
      bulan: `${MONTHS[item.period_month - 1]} ${item.period_year}`,
      totalPenerima: item.total_recipients,
      totalTunjangan: Number(item.total_amount),
      status: item.status,
    }));

    if (search) {
      data = data.filter((item) => item.bulan.toLowerCase().includes(search));
    }

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});

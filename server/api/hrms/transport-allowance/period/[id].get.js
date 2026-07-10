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
    const id = Number(getRouterParam(event, "id"));

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID tidak valid",
      });
    }

    const query = getQuery(event);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const search = (query.search ?? "").toString();

    const skip = (page - 1) * limit;

    const period = await prisma.transportAllowancePeriod.findUnique({
      where: {
        id,
      },
    });

    if (!period) {
      throw createError({
        statusCode: 404,
        statusMessage: "Periode tidak ditemukan",
      });
    }

    const where = {
      transport_allowance_period_id: id,
    };

    if (search) {
      where.employee = {
        name: {
          contains: search,
        },
      };
    }

    const [rows, total] = await Promise.all([
      prisma.transportAllowanceDetail.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          employee: {
            name: "asc",
          },
        },
        skip,
        take: limit,
      }),

      prisma.transportAllowanceDetail.count({
        where,
      }),
    ]);

    return {
      success: true,

      period: {
        id: period.id,
        month: period.period_month,
        year: period.period_year,
        month_name: MONTHS[period.period_month - 1],
        title: `${MONTHS[period.period_month - 1]} ${period.period_year}`,
        status: period.status,
        totalRecipients: period.total_recipients,
        totalAmount: Number(period.total_amount),
      },

      data: rows.map((item) => ({
        id: item.id,
        employee_id: item.employee_id,
        nama: item.employee.name,
        km: Number(item.rounded_km),
        hari: item.attendance_days,
        nominal: Number(item.nominal),
        status: item.eligibility_status,
        note: item.calculation_note,
      })),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    });
  }
});

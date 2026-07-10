import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, "id"));

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID periode tidak valid",
      });
    }

    const userId = event.context.auth?.user?.id;

    const result = await prisma.$transaction(async (tx) => {
      const period = await tx.transportAllowancePeriod.findUnique({
        where: {
          id,
        },
      });

      if (!period) {
        throw createError({
          statusCode: 404,
          statusMessage: "Periode tunjangan tidak ditemukan",
        });
      }

      const setting = await tx.transportAllowanceSetting.findFirst({
        where: {
          is_active: true,
        },
        orderBy: {
          effective_start: "desc",
        },
      });

      if (!setting) {
        throw createError({
          statusCode: 400,
          statusMessage: "Setting tunjangan transport belum tersedia",
        });
      }

      await tx.transportAllowanceDetail.deleteMany({
        where: {
          transport_allowance_period_id: id,
        },
      });

      const employees = await tx.employee.findMany({
        where: {
          employment_type: "pkwtt",
          status: "active",
          deleted_at: null,
        },
        include: {
          attendance_summaries: {
            where: {
              period_year: period.period_year,
              period_month: period.period_month,
            },
            take: 1,
          },
        },
      });

      const details = [];

      let totalAmount = 0;
      let totalRecipients = 0;

      for (const employee of employees) {
        const summary = employee.attendance_summaries[0];

        const hadir = summary?.hadir ?? 0;

        const originalKm = Number(employee.distance_km ?? 0);

        let roundedKm = Math.round(originalKm);

        let nominal = 0;

        let eligibilityStatus = "not_eligible";

        let note = null;

        if (hadir < 19) {
          note = "Jumlah hari kerja kurang dari 19 hari";
        } else if (originalKm <= Number(setting.min_km)) {
          note = "Jarak tidak memenuhi minimal kilometer";
        } else {
          if (roundedKm > Number(setting.max_km)) {
            roundedKm = Number(setting.max_km);
          }

          nominal = Number(setting.base_fare) * roundedKm * hadir;

          eligibilityStatus = "eligible";

          totalAmount += nominal;

          totalRecipients++;
        }

        details.push({
          transport_allowance_period_id: id,

          employee_id: employee.id,

          base_fare: setting.base_fare,

          original_km: originalKm,

          rounded_km: roundedKm,

          attendance_days: hadir,

          nominal,

          eligibility_status: eligibilityStatus,

          calculation_note: note,
        });
      }

      if (details.length) {
        await tx.transportAllowanceDetail.createMany({
          data: details,
        });
      }

      await tx.transportAllowancePeriod.update({
        where: {
          id,
        },
        data: {
          total_recipients: totalRecipients,

          total_amount: totalAmount,

          status: "calculated",

          calculated_by: userId ?? null,

          calculated_at: new Date(),
        },
      });

      return {
        totalRecipients,
        totalAmount,
      };
    });

    return {
      success: true,
      message: "Perhitungan tunjangan transport berhasil",
      data: result,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Terjadi kesalahan",
    });
  }
});

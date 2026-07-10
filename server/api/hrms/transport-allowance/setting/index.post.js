import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const data = await prisma.$transaction(async (tx) => {
      await tx.transportAllowanceSetting.updateMany({
        where: {
          is_active: true,
        },

        data: {
          is_active: false,
        },
      });

      const setting = await tx.transportAllowanceSetting.create({
        data: {
          base_fare: body.base_fare,
          effective_start: new Date(body.effective_start),
          min_km: body.min_km,
          max_km: body.max_km,
          is_active: true,
          created_by: body.created_by ?? null,
        },
      });

      return setting;
    });

    return {
      success: true,
      message: "Setting transport berhasil disimpan",
      data,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message ?? "Gagal menyimpan setting transport",
    };
  }
});

import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: {
        created_at: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return {
      success: true,

      data: logs.map((item) => ({
        id: item.id,

        user: item.user?.name ?? "-",

        user_id: item.user_id,

        modul: item.module_code,

        aksi: item.action,

        description: item.description,

        timestamp: item.created_at,

        ip_address: item.ip_address,

        method: item.method,

        url: item.url,

        old_values: item.old_values,

        new_values: item.new_values,
      })),
    };
  } catch (error) {
    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil log aktifitas",
    });
  }
});

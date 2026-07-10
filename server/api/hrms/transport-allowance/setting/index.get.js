import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  try {
    const data = await prisma.transportAllowanceSetting.findFirst({
      where: {
        is_active: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message ?? "Gagal mengambil setting transport",
      data: null,
    };
  }
});

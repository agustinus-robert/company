import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,

        statusMessage: "User tidak ditemukan",
      });
    }

    await prisma.user.update({
      where: {
        id,
      },

      data: {
        deleted_at: new Date(),

        status: "inactive",
      },
    });

    return {
      success: true,

      message: "User berhasil dihapus",
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,

      statusMessage: error.statusMessage || error.message,
    });
  }
});

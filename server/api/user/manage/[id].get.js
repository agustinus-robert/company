import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params.id);

    const user = await prisma.user.findFirst({
      where: {
        id,
        deleted_at: null,
      },

      include: {
        role: true,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,

        statusMessage: "User tidak ditemukan",
      });
    }

    return {
      success: true,

      data: user,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,

      statusMessage: error.statusMessage || error.message,
    });
  }
});

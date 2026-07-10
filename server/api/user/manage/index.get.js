import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deleted_at: null,
      },

      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});

import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return {
      success: true,
      data: roles,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});

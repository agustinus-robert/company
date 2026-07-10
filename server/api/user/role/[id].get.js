import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params.id);

    const role = await prisma.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!role) {
      throw createError({
        statusCode: 404,
        statusMessage: "Role tidak ditemukan",
      });
    }

    return {
      success: true,
      data: role,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    });
  }
});

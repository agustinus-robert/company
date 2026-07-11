import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params.id);

    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        educations: {
          orderBy: {
            sort_order: "asc",
          },
        },
      },
    });

    if (!employee) {
      throw createError({
        statusCode: 404,
        statusMessage: "Data pegawai tidak ditemukan",
      });
    }

    return {
      success: true,
      data: employee,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message || "Gagal mengambil data",
    };
  }
});

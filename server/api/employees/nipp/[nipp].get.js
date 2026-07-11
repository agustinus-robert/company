import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  console.log("QUERY EMPLOYEE INCLUDE DISTRICT");
  try {
    const nipp = event.context.params.nipp;

    const employee = await prisma.employee.findFirst({
      where: {
        nip: nipp,
        deleted_at: null,
      },

      include: {
        position: true,

        department: true,

        district: {
          include: {
            regency: {
              include: {
                province: true,
              },
            },
          },
        },

        educations: {
          orderBy: {
            sort_order: "asc",
          },
        },

        user: {
          select: {
            id: true,
            username: true,
            status: true,
          },
        },
      },
    });

    if (!employee) {
      return {
        success: false,
        message: "Employee tidak ditemukan",
      };
    }

    return {
      success: true,
      data: employee,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message ?? "Gagal mengambil data employee",
    };
  }
});

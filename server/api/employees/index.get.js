import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  const employees = await prisma.employee.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      position: true,
      department: true,
      district: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      educations: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return {
    success: true,
    data: employees,
  };
});

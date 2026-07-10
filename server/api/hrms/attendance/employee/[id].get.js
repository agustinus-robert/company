import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      name: true,

      position: {
        select: {
          name: true,
        },
      },
    },
  });

  const attendances = await prisma.attendance.findMany({
    where: {
      employee_id: id,
    },

    orderBy: {
      attendance_date: "desc",
    },
  });

  return {
    success: true,
    employee,
    data: attendances,
  };
});

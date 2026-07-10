import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id);

  await prisma.employee.update({
    where: {
      id,
    },

    data: {
      deleted_at: new Date(),
    },
  });

  return {
    success: true,
    message: "Employee berhasil dihapus",
  };
});

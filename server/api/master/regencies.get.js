import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  return await prisma.regency.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      province: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });
});

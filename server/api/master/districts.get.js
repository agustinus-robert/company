import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  return await prisma.district.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      regency: {
        select: {
          id: true,
          code: true,
          name: true,
          province: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });
});

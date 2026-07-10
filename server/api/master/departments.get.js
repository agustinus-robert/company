import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  return await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
});

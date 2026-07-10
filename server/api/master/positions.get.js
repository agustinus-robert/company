import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  return await prisma.position.findMany({
    orderBy: {
      name: "asc",
    },
  });
});

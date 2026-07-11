import jwt from "jsonwebtoken";
import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const auth = getHeader(event, "authorization");

  if (!auth) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const token = auth.replace("Bearer ", "");

  const decoded = jwt.verify(token, config.jwtSecret);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    include: {
      role: true,
      employee: true,
    },
  });

  return {
    success: true,
    data: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      employee: user.employee,
    },
  };
});

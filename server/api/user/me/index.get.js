import jwt from "jsonwebtoken";
import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    const token = getCookie(event, "token");

    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },

      select: {
        id: true,

        name: true,

        username: true,

        email: true,

        cellphone: true,

        status: true,

        last_login_at: true,

        password_changed_at: true,

        role: {
          select: {
            id: true,
            name: true,
          },
        },

        employee: {
          select: {
            id: true,
            nip: true,
          },
        },
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,

        message: "User tidak ditemukan",
      });
    }

    return {
      success: true,

      data: {
        id: user.id,

        name: user.name,

        username: user.username,

        email: user.email,

        cellphone: user.cellphone,

        status: user.status,

        role: user.role,

        employee: user.employee,

        last_login_at: user.last_login_at,

        password_changed_at: user.password_changed_at,
      },
    };
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    throw createError({
      statusCode: error.statusCode ?? 500,

      message: error.message ?? "Gagal mengambil profile",
    });
  }
});

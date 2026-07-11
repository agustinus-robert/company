import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    });

    if (!user) {
      throw createError({
        statusCode: 404,

        message: "User tidak ditemukan",
      });
    }

    const body = await readBody(event);

    const data = {
      name: body.name,

      username: body.username,

      email: body.email || null,

      cellphone: body.cellphone || null,
    };

    let passwordChanged = false;

    if (body.password) {
      if (body.password !== body.password_confirmation) {
        throw createError({
          statusCode: 400,

          message: "Konfirmasi password tidak sama",
        });
      }

      if (body.password.length < 8) {
        throw createError({
          statusCode: 400,

          message: "Password minimal 8 karakter",
        });
      }

      data.password = await bcrypt.hash(body.password, 10);

      data.password_changed_at = new Date();

      passwordChanged = true;
    }

    const updated = await prisma.user.update({
      where: {
        id: user.id,
      },

      data,

      select: {
        id: true,

        name: true,

        username: true,

        email: true,

        cellphone: true,

        status: true,
      },
    });

    return {
      success: true,

      message: passwordChanged
        ? "Profile dan password berhasil diperbarui"
        : "Profile berhasil diperbarui",

      data: updated,
    };
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    if (error.code === "P2002") {
      throw createError({
        statusCode: 400,

        message: "Username, email, atau nomor HP sudah digunakan",
      });
    }

    throw createError({
      statusCode: error.statusCode ?? 500,

      message: error.message ?? "Gagal memperbarui profile",
    });
  }
});

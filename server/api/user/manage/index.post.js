import { prisma } from "#root/server/db/prisma.js";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.name || !body.username || !body.password || !body.role_id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nama, username, password dan role wajib diisi",
      });
    }

    const usernameExist = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (usernameExist) {
      throw createError({
        statusCode: 409,
        statusMessage: "Username sudah digunakan",
      });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        employee_id: body.employee_id ?? null,

        role_id: Number(body.role_id),

        name: body.name,

        username: body.username,

        email: body.email ?? null,

        cellphone: body.cellphone ?? null,

        password: passwordHash,

        status: body.status ?? "active",
      },
    });

    return {
      success: true,

      data: user,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,

      statusMessage: error.statusMessage || error.message,
    });
  }
});

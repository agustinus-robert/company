import { prisma } from "#root/server/db/prisma.js";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params.id);

    const body = await readBody(event);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,

        statusMessage: "User tidak ditemukan",
      });
    }

    let password = user.password;

    if (body.password) {
      password = await bcrypt.hash(body.password, 10);
    }

    const updated = await prisma.user.update({
      where: {
        id,
      },

      data: {
        employee_id: body.employee_id ?? null,

        role_id: Number(body.role_id),

        name: body.name,

        username: body.username,

        email: body.email ?? null,

        cellphone: body.cellphone ?? null,

        password,

        status: body.status,

        password_changed_at: body.password
          ? new Date()
          : user.password_changed_at,
      },
    });

    return {
      success: true,

      data: updated,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,

      statusMessage: error.statusMessage || error.message,
    });
  }
});

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Username dan password wajib diisi",
    });
  }


  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      role: true,
      employee: true,
    },
  });


  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Username atau password salah",
    });
  }


  if (user.status !== "active") {
    throw createError({
      statusCode: 403,
      message: "User tidak aktif",
    });
  }


  const validPassword = await bcrypt.compare(
    password,
    user.password
  );


  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: "Username atau password salah",
    });
  }

  const sessionToken = crypto.randomUUID();
  const session = await prisma.userSession.create({
    data: {
      user_id: user.id,
      session_token: sessionToken,
      last_activity_at: new Date(),
      expires_at: new Date(
        Date.now() + 3 * 60 * 1000
      ),
      ip_address: getRequestIP(event),
      user_agent: getHeader(event, "user-agent"),
    },
  });


  const config = useRuntimeConfig();

  const token = jwt.sign(
    {
      id: user.id,
      session_token: session.session_token,
      username: user.username,
      role_id: user.role_id,
      role: user.role.code,
    },
    config.jwtSecret,
    {
      expiresIn: "30d",
    }
  );


  return {
    success: true,
    message: "Login berhasil",
    token,

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
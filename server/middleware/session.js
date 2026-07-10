import jwt from "jsonwebtoken";
import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {

  const token = getCookie(event, "token");

  if (!token) {
    return;
  }


  let payload;

  try {

    payload = jwt.verify(
      token,
      useRuntimeConfig().jwtSecret
    );

  } catch {

    deleteCookie(event, "token");

    throw createError({
      statusCode: 401,
      message: "Session expired"
    });

  }


  const session = await prisma.userSession.findUnique({
    where: {
      session_token: payload.session_token
    }
  });


  if (!session) {

    deleteCookie(event, "token");

    throw createError({
      statusCode: 401,
      message: "Session tidak ditemukan"
    });

  }

  if (session.expires_at < new Date()) {

    await prisma.userSession.delete({
      where: {
        session_token: payload.session_token
      }
    });


    deleteCookie(event, "token");


    throw createError({
      statusCode: 401,
      message: "Session expired"
    });

  }

  await prisma.userSession.update({
    where: {
      session_token: payload.session_token
    },
    data: {
      last_activity_at: new Date(),
      expires_at: new Date(
        Date.now() + 3 * 60 * 1000
      )
    }
  });

});
import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const role_id = Number(event.context.params.id);

    const modules = await prisma.module.findMany({
      orderBy: {
        id: "asc",
      },

      include: {
        role_permissions: {
          where: {
            role_id,
          },
        },
      },
    });

    const data = modules.map((module) => {
      const permission = module.role_permissions[0];

      return {
        id: module.id,
        name: module.name,

        can_access: permission?.can_access ?? false,
        can_create: permission?.can_create ?? false,

        read_scope: permission?.read_scope ?? "no",
        update_scope: permission?.update_scope ?? "no",
        delete_scope: permission?.delete_scope ?? "no",
      };
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});

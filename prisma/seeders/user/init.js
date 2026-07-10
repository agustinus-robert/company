import bcrypt from "bcrypt";
import roleData from "./roles.json" with { type: "json" };
import users from "./users.json" with { type: "json" };
import otps from "./otps.json" with { type: "json" };
import activityLogs from "./activity.json" with { type: "json" };

const modules = roleData.modules;
const roles = roleData.roles;

async function seedModules(prisma) {
  console.log("Seeding modules...");

  for (const module of modules) {
    await prisma.module.create({
      data: {
        code: module.code,
        name: module.name,
        description: module.description,
        sort_order: module.sort_order,
      },
    });
  }

  console.log("Modules seeded");
}

async function seedRoles(prisma) {
  console.log("Seeding roles...");

  for (const roleData of roles) {
    const { permissions = [], ...role } = roleData;

    const createdRole = await prisma.role.create({
      data: {
        code: role.code,
        name: role.name,
        description: role.description,
      },
    });

    for (const permission of permissions) {
      const module = await prisma.module.findUnique({
        where: {
          code: permission.module,
        },
      });

      if (!module) {
        console.warn(
          `Module ${permission.module} tidak ditemukan, skip permission`,
        );
        continue;
      }

      await prisma.rolePermission.create({
        data: {
          role_id: createdRole.id,
          module_id: module.id,
          can_access: permission.can_access,
          can_create: permission.can_create,
          read_scope: permission.read_scope,
          update_scope: permission.update_scope,
          delete_scope: permission.delete_scope,
        },
      });
    }
  }

  console.log("Roles & permissions seeded");
}

async function seedUsers(prisma) {
  console.log("Seeding users...");

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        role_id: user.role_id,
        name: user.name,
        username: user.username,
        email: user.email,
        cellphone: user.cellphone,
        password: hashedPassword,
        status: user.status,
      },
    });
  }

  console.log("Users seeded");
}

async function seedOtps(prisma) {
  console.log("Seeding OTP...");

  for (const otp of otps) {
    await prisma.loginOtp.create({
      data: {
        user_id: otp.user_id,
        otp_hash: otp.otp_hash,
        channel: otp.channel,
        sent_to: otp.sent_to,

        expires_at: new Date(otp.expires_at),

        verified_at: otp.verified_at ? new Date(otp.verified_at) : null,

        used_at: otp.used_at ? new Date(otp.used_at) : null,

        ip_address: otp.ip_address,
        user_agent: otp.user_agent,
      },
    });
  }

  console.log("OTP seeded");
}

/**
 * Seed Activity Logs
 */
async function seedActivityLogs(prisma) {
  console.log("Seeding activity logs...");

  for (const log of activityLogs) {
    await prisma.activityLog.create({
      data: {
        user_id: log.user_id,

        module_code: log.module_code,

        action: log.action,

        description: log.description,

        subject_type: log.subject_type,

        subject_id: log.subject_id,

        ip_address: log.ip_address,

        user_agent: log.user_agent,

        old_values: log.old_values,

        new_values: log.new_values,

        url: log.url,

        method: log.method,
      },
    });
  }

  console.log("Activity logs seeded");
}

export default async function userInit(prisma) {
  await seedModules(prisma);

  await seedRoles(prisma);

  await seedUsers(prisma);

  await seedOtps(prisma);

  await seedActivityLogs(prisma);

  console.log("All user seed completed");
}

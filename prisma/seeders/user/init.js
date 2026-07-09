import roles from "./roles.json" with { type: "json" };
import users from "./users.json" with { type: "json" };
import otps from "./otps.json" with { type: "json" };

async function seedRoles(prisma) {
  console.log("Seeding roles...");

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        code: role.code,
      },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
      },
    });
  }

  console.log("Roles seeded");
}


async function seedUsers(prisma) {
  console.log("Seeding users...");

  for (const user of users) {
    const role = await prisma.role.findUnique({
      where: {
        id: user.role_id,
      },
    });

    if (!role) {
      throw new Error(`Role ${user.role_id} not found`);
    }

    await prisma.user.upsert({
      where: {
        username: user.username,
      },
      update: {
        name: user.name,
        email: user.email,
        cellphone: user.cellphone,
        password: user.password,
        status: user.status,
        role_id: role.id,
      },
      create: {
        role_id: role.id,
        name: user.name,
        username: user.username,
        email: user.email,
        cellphone: user.cellphone,
        password: user.password,
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
        verified_at: otp.verified_at
          ? new Date(otp.verified_at)
          : null,
        used_at: otp.used_at
          ? new Date(otp.used_at)
          : null,
        ip_address: otp.ip_address,
        user_agent: otp.user_agent,
      },
    });
  }

  console.log("OTP seeded");
}


export default async function userInit(prisma) {
  await seedRoles(prisma);
  await seedUsers(prisma);
  await seedOtps(prisma);

  console.log("All user seed completed");
}
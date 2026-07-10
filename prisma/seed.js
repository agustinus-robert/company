import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "#root/generated/client/client.js"
import userInit from "./seeders/user/init.js";
import masterInit from "./seeders/master/init.js"
import inventoryInit from "./seeders/inventory/init.js"
import employeeInit from "./seeders/employee/init.js"
import hrmsInit from "./seeders/hrms/init.js"

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "jmc",
  connectionLimit: 5,
});

const prisma = new PrismaClient({adapter});

async function main() {
  await userInit(prisma);
  await masterInit(prisma);
  await employeeInit(prisma);
  await inventoryInit(prisma);
  await hrmsInit(prisma);

  console.log("seed selesai");
}

main()
  .catch((err) => {
    console.log("gagal seed: ", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
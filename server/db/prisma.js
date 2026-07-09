import "dotenv/config";
import { PrismaClient } from '#root/generated/client/client.js'
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "jmc",
  connectionLimit: 5,
});

export const prisma = new PrismaClient({
    adapter,
})
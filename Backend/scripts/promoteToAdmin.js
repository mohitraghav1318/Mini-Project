import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/promoteToAdmin.js <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  const existingAdminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  if (existingAdminCount > 0) {
    console.error("An ADMIN account already exists. Only one admin is allowed.");
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`Success: ${updated.email} (id: ${updated.id}) is now ADMIN.`);
}

main()
  .catch((err) => {
    console.error("Error promoting user:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
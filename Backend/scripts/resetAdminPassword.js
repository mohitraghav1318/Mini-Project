import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const ADMIN_EMAIL = "mohitraghav911@gmail.com";
const SALT_ROUNDS = 12;
const newPassword = process.env.NEW_ADMIN_PASSWORD;

if (!newPassword) {
  throw new Error("NEW_ADMIN_PASSWORD environment variable is required.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new Error(`No user found with email: ${ADMIN_EMAIL}`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      tokenVersion: { increment: 1 },
    },
    select: { id: true, email: true, tokenVersion: true },
  });

  console.log(
    `Password reset successfully for ${updated.email} (id: ${updated.id}); tokenVersion is now ${updated.tokenVersion}.`
  );
}

main()
  .catch((error) => {
    console.error("Error resetting admin password:", error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

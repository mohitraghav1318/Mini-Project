import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const INTERESTS = [
  "Digital Marketing",
  "Stitching",
  "Tailoring",
  "Handicrafts",
  "Online Selling",
  "Social Media Management",
  "Photography",
  "Graphic Design",
  "Bookkeeping",
  "Packaging & Branding",
];

async function main() {
  for (const name of INTERESTS) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${INTERESTS.length} interests.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "./../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@flare.app" },
    update: {},
    create: {
      name: "Flare Admin",
      email: "admin@flare.app",
      password,
      role: "ADMIN",
      subscriptionTier: "PREMIUM",
    },
  });

  await prisma.user.upsert({
    where: { email: "seller@flare.app" },
    update: {},
    create: {
      name: "Demo Entrepreneur",
      email: "seller@flare.app",
      password,
      role: "ENTREPRENEUR",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@flare.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@flare.app",
      password,
      role: "USER",
    },
  });

  console.log("Seeded demo accounts (password for all: password123):");
  console.log("  admin@flare.app   (ADMIN)");
  console.log("  seller@flare.app  (ENTREPRENEUR)");
  console.log("  user@flare.app    (USER)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

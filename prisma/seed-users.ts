
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../generated/prisma/client";
import { hashPassword } from "../lib/auth/password";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const accounts = [
    {
      name: "Admin FindSeat",
      email: "admin@findseat.test",
      password: "AdminDemo2026!",
      role: Role.ADMIN,
    },
    {
      name: "User FindSeat",
      email: "user@findseat.test",
      password: "UserDemo2026!",
      role: Role.USER,
    },
  ];

  for (const account of accounts) {
    const passwordHash = await hashPassword(account.password);

    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        passwordHash,
        role: account.role,
      },
      create: {
        name: account.name,
        email: account.email,
        passwordHash,
        role: account.role,
      },
    });

    console.log(`Akun berhasil dibuat: ${account.email}`);
  }
}

main()
  .catch((error) => {
    console.error("Seed akun gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

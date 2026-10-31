
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.$connect();

  console.log("Koneksi PostgreSQL berhasil!");

  const venueCount = await prisma.venue.count();
  const seatCount = await prisma.seat.count();

  console.log("Jumlah Venue:", venueCount);
  console.log("Jumlah Seat:", seatCount);
}

main()
  .catch((error) => {
    console.error("Koneksi database gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

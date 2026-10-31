
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Cari kursi yang tersedia untuk pengujian
  const seat = await prisma.seat.findFirst({
    where: {
      status: "tersedia",
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!seat) {
    throw new Error("Tidak ada kursi tersedia untuk pengujian rollback.");
  }

  // Catat kondisi database sebelum transaksi
  const countBefore = await prisma.checkIn.count({
    where: {
      seatId: seat.id,
    },
  });

  const statusBefore = seat.status;

  console.log("Kondisi sebelum transaksi:");
  console.log("ID Seat:", seat.id);
  console.log("Status:", statusBefore);
  console.log("Jumlah CheckIn:", countBefore);

  // Jalankan transaksi yang sengaja dibuat gagal
  try {
    await prisma.$transaction(async (tx) => {
      await tx.checkIn.create({
        data: {
          seatId: seat.id,
          name: "Pengujian Rollback",
          email: "rollback-test@example.com",
        },
      });

      await tx.seat.update({
        where: {
          id: seat.id,
        },
        data: {
          status: "digunakan",
        },
      });

      // Memicu kegagalan agar seluruh transaksi dibatalkan
      throw new Error("ROLLBACK_TEST_INTENTIONAL");
    });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== "ROLLBACK_TEST_INTENTIONAL"
    ) {
      throw error;
    }

    console.log("\nError pengujian berhasil dipicu.");
  }

  // Periksa kondisi database setelah rollback
  const countAfter = await prisma.checkIn.count({
    where: {
      seatId: seat.id,
    },
  });

  const seatAfter = await prisma.seat.findUnique({
    where: {
      id: seat.id,
    },
  });

  console.log("\nKondisi setelah rollback:");
  console.log("Status:", seatAfter?.status);
  console.log("Jumlah CheckIn:", countAfter);

  // Pastikan seluruh perubahan dibatalkan
  if (
    countAfter === countBefore &&
    seatAfter?.status === statusBefore
  ) {
    console.log("\nBERHASIL: Rollback transaksi terbukti.");
    console.log("Data CheckIn yang dibuat sementara dibatalkan.");
    console.log("Perubahan status kursi juga dibatalkan.");
  } else {
    throw new Error(
      "GAGAL: Kondisi database berubah setelah rollback."
    );
  }
}

main()
  .catch((error) => {
    console.error("\nPengujian gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

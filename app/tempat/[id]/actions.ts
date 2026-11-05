
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authorization";
import { revalidatePath } from "next/cache";

type CheckInInput = {
  seatId: number;
  name?: string;
  email?: string;
};

export async function createCheckIn(data: CheckInInput) {
  // Pastikan pengguna sudah login
  const sessionUser = await requireAuth();

  // Validasi seatId
  if (!Number.isSafeInteger(data.seatId) || data.seatId <= 0) {
    return {
      success: false,
      message: "ID kursi tidak valid.",
    };
  }

  try {
    // Ambil data pengguna langsung dari database
    const user = await prisma.user.findUnique({
      where: {
        id: Number(sessionUser.id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Akun pengguna tidak ditemukan.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Ubah status hanya jika kursi masih tersedia
      const updatedSeat = await tx.seat.updateMany({
        where: {
          id: data.seatId,
          status: "tersedia",
        },
        data: {
          status: "digunakan",
        },
      });

      // Jika tidak ada kursi yang berhasil diperbarui,
      // berarti kursi tidak tersedia atau tidak ditemukan
      if (updatedSeat.count !== 1) {
        throw new Error("Kursi sudah tidak tersedia.");
      }

      // Simpan check-in berdasarkan akun yang sedang login
      await tx.checkIn.create({
        data: {
          seatId: data.seatId,
          userId: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });

    revalidatePath("/tempat");
    revalidatePath("/tempat/[id]", "page");

    return {
      success: true,
      message: "Check-in berhasil dan data tersimpan ke database.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat check-in.",
    };
  }
}

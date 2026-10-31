
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkInSchema } from "@/schema/check-in";

type CheckInInput = {
  seatId: number;
  name: string;
  email: string;
};

export async function createCheckIn(data: CheckInInput) {
  const validation = checkInSchema.safeParse({
    name: data.name,
    email: data.email,
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Nama atau email tidak valid.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const seat = await tx.seat.findUnique({
        where: { id: data.seatId },
      });

      if (!seat || seat.status !== "tersedia") {
        throw new Error("Kursi sudah tidak tersedia.");
      }

      await tx.checkIn.create({
        data: {
          seatId: data.seatId,
          name: validation.data.name,
          email: validation.data.email,
        },
      });

      await tx.seat.update({
        where: { id: data.seatId },
        data: {
          status: "digunakan",
        },
      });
    });

    revalidatePath("/tempat");
    revalidatePath(`/tempat/[id]`);

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

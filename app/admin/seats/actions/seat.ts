"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  seatSchema,
  seatIdSchema,
} from "@/lib/validations/seat";

type ActionResult = {
  success: boolean;
  message: string;
};

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    return String(error.code);
  }

  return undefined;
}

function refreshPages() {
  revalidatePath("/tempat");
  revalidatePath("/tempat/[id]", "page");
  revalidatePath("/admin/seats");
}

// CREATE SEAT
export async function createSeat(
  formData: FormData
): Promise<ActionResult> {
  const validation = seatSchema.safeParse({
    venueId: formData.get("venueId"),
    number: formData.get("number"),
    status: formData.get("status"),
  });

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ??
        "Data kursi tidak valid.",
    };
  }

  try {
    await prisma.seat.create({
      data: validation.data,
    });

    refreshPages();

    return {
      success: true,
      message: "Kursi berhasil ditambahkan.",
    };
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "P2002") {
      return {
        success: false,
        message:
          "Nomor kursi tersebut sudah digunakan pada Venue ini.",
      };
    }

    if (code === "P2003") {
      return {
        success: false,
        message: "Venue yang dipilih tidak ditemukan.",
      };
    }

    console.error("Create Seat Error:", error);

    return {
      success: false,
      message: "Terjadi kesalahan saat menambahkan kursi.",
    };
  }
}

// UPDATE SEAT
export async function updateSeat(
  formData: FormData
): Promise<ActionResult> {
  const idValidation = seatIdSchema.safeParse(
    formData.get("id")
  );

  const dataValidation = seatSchema.safeParse({
    venueId: formData.get("venueId"),
    number: formData.get("number"),
    status: formData.get("status"),
  });

  if (!idValidation.success || !dataValidation.success) {
    return {
      success: false,
      message:
        idValidation.error?.issues[0]?.message ??
        dataValidation.error?.issues[0]?.message ??
        "Data kursi tidak valid.",
    };
  }

  try {
    await prisma.seat.update({
      where: {
        id: idValidation.data,
      },
      data: dataValidation.data,
    });

    refreshPages();

    return {
      success: true,
      message: "Data kursi berhasil diperbarui.",
    };
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "P2002") {
      return {
        success: false,
        message:
          "Nomor kursi tersebut sudah digunakan pada Venue ini.",
      };
    }

    if (code === "P2025") {
      return {
        success: false,
        message: "Kursi tidak ditemukan.",
      };
    }

    console.error("Update Seat Error:", error);

    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui kursi.",
    };
  }
}

// DELETE SEAT
export async function deleteSeat(
  formData: FormData
): Promise<ActionResult> {
  const idValidation = seatIdSchema.safeParse(
    formData.get("id")
  );

  if (!idValidation.success) {
    return {
      success: false,
      message:
        idValidation.error.issues[0]?.message ??
        "ID kursi tidak valid.",
    };
  }

  try {
    await prisma.seat.delete({
      where: {
        id: idValidation.data,
      },
    });

    refreshPages();

    return {
      success: true,
      message: "Kursi berhasil dihapus.",
    };
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "P2003") {
      return {
        success: false,
        message:
          "Kursi tidak dapat dihapus karena masih memiliki riwayat CheckIn.",
      };
    }

    if (code === "P2025") {
      return {
        success: false,
        message: "Kursi tidak ditemukan.",
      };
    }

    console.error("Delete Seat Error:", error);

    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus kursi.",
    };
  }
}
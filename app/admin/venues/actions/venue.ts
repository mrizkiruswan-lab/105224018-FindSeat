
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  venueSchema,
  venueIdSchema,
} from "@/lib/validations/venue";

type ActionResult = {
  success: boolean;
  message: string;
};

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

// CREATE VENUE
export async function createVenue(
  formData: FormData,
): Promise<ActionResult> {
  const result = venueSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    category: formData.get("category"),
    location: formData.get("location"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Data Venue tidak valid",
    };
  }

  try {
    await prisma.venue.create({
      data: result.data,
    });

    revalidatePath("/tempat");
    revalidatePath("/admin/venues");

    return {
      success: true,
      message: "Venue berhasil ditambahkan.",
    };
  } catch (error) {
    if (getErrorCode(error) === "P2002") {
      return {
        success: false,
        message: "Slug Venue sudah digunakan.",
      };
    }

    console.error("Create Venue Error:", error);

    return {
      success: false,
      message: "Gagal menambahkan Venue.",
    };
  }
}

// UPDATE VENUE
export async function updateVenue(
  formData: FormData,
): Promise<ActionResult> {
  const idResult = venueIdSchema.safeParse(formData.get("id"));

  const dataResult = venueSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    category: formData.get("category"),
    location: formData.get("location"),
    description: formData.get("description"),
  });

  if (!idResult.success || !dataResult.success) {
    return {
      success: false,
      message:
        idResult.error?.issues[0]?.message ??
        dataResult.error?.issues[0]?.message ??
        "Data Venue tidak valid.",
    };
  }

  try {
    await prisma.venue.update({
      where: { id: idResult.data },
      data: dataResult.data,
    });

    revalidatePath("/tempat");
    revalidatePath("/admin/venues");

    return {
      success: true,
      message: "Venue berhasil diperbarui.",
    };
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "P2002") {
      return {
        success: false,
        message: "Slug Venue sudah digunakan.",
      };
    }

    if (code === "P2025") {
      return {
        success: false,
        message: "Venue tidak ditemukan.",
      };
    }

    console.error("Update Venue Error:", error);

    return {
      success: false,
      message: "Gagal memperbarui Venue.",
    };
  }
}

// DELETE VENUE
export async function deleteVenue(
  formData: FormData,
): Promise<ActionResult> {
  const idResult = venueIdSchema.safeParse(formData.get("id"));

  if (!idResult.success) {
    return {
      success: false,
      message: "ID Venue tidak valid.",
    };
  }

  try {
    await prisma.venue.delete({
      where: { id: idResult.data },
    });

    revalidatePath("/tempat");
    revalidatePath("/admin/venues");

    return {
      success: true,
      message: "Venue berhasil dihapus.",
    };
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "P2003") {
      return {
        success: false,
        message:
          "Venue tidak dapat dihapus karena masih memiliki kursi. Hapus kursinya terlebih dahulu.",
      };
    }

    if (code === "P2025") {
      return {
        success: false,
        message: "Venue tidak ditemukan.",
      };
    }

    console.error("Delete Venue Error:", error);

    return {
      success: false,
      message: "Gagal menghapus Venue.",
    };
  }
}

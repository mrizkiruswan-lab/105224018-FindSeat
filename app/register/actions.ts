
"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password.server";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().email("Format email tidak valid."),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter."),
});

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const validation = registerSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  try {
    const name = validation.data.name;
    const email = validation.data.email.toLowerCase();
    const passwordHash = await hashPassword(validation.data.password);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
      },
    });

    return {
      success: true,
      message: "Registrasi berhasil. Silakan login.",
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Email sudah terdaftar.",
      };
    }

    return {
      success: false,
      message: "Registrasi gagal. Silakan coba kembali.",
    };
  }
}

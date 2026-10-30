
import { z } from "zod";

export const checkInSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter.")
    .max(80, "Nama lengkap maksimal 80 karakter."),

  email: z
    .string()
    .trim()
    .min(1, "Alamat email wajib diisi.")
    .max(254, "Alamat email maksimal 254 karakter.")
    .email("Masukkan alamat email yang valid."),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;

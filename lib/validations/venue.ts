
import { z } from "zod";

export const venueSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung",
    ),
  name: z.string().trim().min(3, "Nama Venue minimal 3 karakter").max(100),
  category: z.string().trim().min(2, "Kategori wajib diisi").max(50),
  location: z.string().trim().min(3, "Lokasi wajib diisi").max(150),
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000),
});

export const venueIdSchema = z.coerce
  .number()
  .int()
  .positive("ID Venue tidak valid");

export type VenueInput = z.infer<typeof venueSchema>;

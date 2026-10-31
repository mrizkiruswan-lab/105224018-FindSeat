import { z } from "zod";

export const seatSchema = z.object({
  venueId: z.coerce.number().int().positive(
    "Venue harus dipilih"
  ),

  number: z.coerce.number().int().positive(
    "Nomor kursi harus berupa angka positif"
  ),

  status: z.enum([
    "tersedia",
    "digunakan",
    "ditinggalkan",
  ]),
});

export const seatIdSchema = z.coerce
  .number()
  .int()
  .positive("ID kursi tidak valid");

export type SeatInput = z.infer<typeof seatSchema>;
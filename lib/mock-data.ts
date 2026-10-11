import type { Venue, Seat } from "./types";

function createSeats(
  total: number,
  unavailable: number[],
  temporary: number[] = []
): Seat[] {
  return Array.from({ length: total }, (_, index) => {
    const number = index + 1;

    let status: Seat["status"] = "tersedia";

    if (unavailable.includes(number)) {
      status = "digunakan";
    } else if (temporary.includes(number)) {
      status = "ditinggalkan";
    }

    return {
      id: `K${String(number).padStart(2, "0")}`,
      number,
      status,
    };
  });
}

export const venues: Venue[] = [
  {
    id: "perpustakaan-kampus",
    name: "Perpustakaan Kampus",
    category: "Perpustakaan",
    location: "Area belajar mahasiswa",
    description:
      "Tempat membaca dan belajar dengan pilihan kursi untuk belajar mandiri.",
    totalSeats: 30,
    seats: createSeats(30, [2, 5, 8, 11, 16, 19], [6, 10]),
  },
  {
    id: "ruang-belajar",
    name: "Ruang Belajar Bersama",
    category: "Ruang belajar",
    location: "Gedung fasilitas mahasiswa",
    description:
      "Ruang belajar bersama yang cocok untuk mengerjakan tugas dan berdiskusi.",
    totalSeats: 20,
    seats: createSeats(20, [3, 7, 12, 15], [5, 9]),
  },
  {
    id: "coworking-space",
    name: "Coworking Space",
    category: "Coworking",
    location: "Area kerja bersama",
    description:
      "Area kerja bersama dengan tempat duduk untuk belajar dan menyelesaikan pekerjaan.",
    totalSeats: 24,
    seats: createSeats(24, [1, 4, 8, 13, 18], [6, 11]),
  },
];

export function getAvailableSeats(venue: Venue): number {
  return venue.seats.filter(
    (seat) => seat.status === "tersedia"
  ).length;
}
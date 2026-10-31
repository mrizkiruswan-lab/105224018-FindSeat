
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SeatStatus } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const venues = [
  {
    slug: "perpustakaan-kampus",
    name: "Perpustakaan Kampus",
    category: "Perpustakaan",
    location: "Area belajar mahasiswa",
    description:
      "Tempat membaca dan belajar dengan pilihan kursi untuk belajar mandiri.",
    totalSeats: 30,
    unavailable: [2, 5, 8, 11, 16, 19],
    temporary: [6, 10],
  },
  {
    slug: "ruang-belajar",
    name: "Ruang Belajar Bersama",
    category: "Ruang belajar",
    location: "Gedung fasilitas mahasiswa",
    description:
      "Ruang belajar bersama yang cocok untuk mengerjakan tugas dan berdiskusi.",
    totalSeats: 20,
    unavailable: [3, 7, 12, 15],
    temporary: [5, 9],
  },
  {
    slug: "coworking-space",
    name: "Coworking Space",
    category: "Coworking",
    location: "Area kerja bersama",
    description:
      "Area kerja bersama dengan tempat duduk untuk belajar dan menyelesaikan pekerjaan.",
    totalSeats: 24,
    unavailable: [1, 4, 8, 13, 18],
    temporary: [6, 11],
  },
];

async function main() {
  for (const data of venues) {
    const venue = await prisma.venue.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        category: data.category,
        location: data.location,
        description: data.description,
      },
      create: {
        slug: data.slug,
        name: data.name,
        category: data.category,
        location: data.location,
        description: data.description,
      },
    });

    for (let number = 1; number <= data.totalSeats; number++) {
      let status: SeatStatus = "tersedia";

      if (data.unavailable.includes(number)) {
        status = "digunakan";
      } else if (data.temporary.includes(number)) {
        status = "ditinggalkan";
      }

      await prisma.seat.upsert({
        where: {
          venueId_number: {
            venueId: venue.id,
            number,
          },
        },
        update: { status },
        create: {
          number,
          status,
          venueId: venue.id,
        },
      });
    }

    console.log(`Seed berhasil: ${data.name}`);
  }

  console.log("Semua data Venue dan Seat berhasil dimasukkan.");
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

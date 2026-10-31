import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DetailTempatClient from "./DetailTempatClient";

export const instant = false;

export default async function DetailTempatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: {
      slug: id,
    },
    include: {
      seats: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if (!venue) {
    notFound();
  }

  const venueData = {
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    category: venue.category,
    location: venue.location,
    description: venue.description,
    totalSeats: venue.seats.length,
    seats: venue.seats.map((seat) => ({
      id: String(seat.id),
      number: seat.number,
      status: seat.status,
    })),
  };

  return <DetailTempatClient venue={venueData} />;
}
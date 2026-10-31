import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import VenueListClient from "./VenueListClient";

export const instant = false;

export default async function TempatPage() {
  await connection();

  const venues = await prisma.venue.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      seats: {
        select: {
          status: true,
        },
      },
    },
  });

  const venueList = venues.map((venue) => ({
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    category: venue.category,
    location: venue.location,
    description: venue.description,
    totalSeats: venue.seats.length,
    availableSeats: venue.seats.filter(
      (seat) => seat.status === "tersedia"
    ).length,
  }));

  return <VenueListClient venues={venueList} />;
}
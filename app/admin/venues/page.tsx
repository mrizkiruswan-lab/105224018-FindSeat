
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import VenueAdminClient from "./VenueAdminClient";

export const instant = false;

export default async function AdminVenuesPage() {
  await connection();

  const venues = await prisma.venue.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          seats: true,
        },
      },
    },
  });

  const venueData = venues.map((venue) => ({
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    category: venue.category,
    location: venue.location,
    description: venue.description,
    totalSeats: venue._count.seats,
  }));

  return <VenueAdminClient venues={venueData} />;
}

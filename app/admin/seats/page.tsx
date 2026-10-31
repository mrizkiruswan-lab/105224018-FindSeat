import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import SeatAdminClient from "./SeatAdminClient";

export const instant = false;

export default async function AdminSeatsPage() {
  await connection();

  const [venues, seats] = await Promise.all([
    prisma.venue.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.seat.findMany({
      orderBy: [
        {
          venue: {
            name: "asc",
          },
        },
        {
          number: "asc",
        },
      ],
      include: {
        venue: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            checkIns: true,
          },
        },
      },
    }),
  ]);

  const venueData = venues.map((venue) => ({
    id: venue.id,
    name: venue.name,
  }));

  const seatData = seats.map((seat) => ({
    id: seat.id,
    number: seat.number,
    status: seat.status,
    venueId: seat.venueId,
    venueName: seat.venue.name,
    totalCheckIns: seat._count.checkIns,
  }));

  return (
    <SeatAdminClient
      venues={venueData}
      seats={seatData}
    />
  );
}
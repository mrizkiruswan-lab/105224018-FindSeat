
import { notFound } from "next/navigation";
import { venues } from "@/lib/mock-data";
import DetailTempatClient from "./DetailTempatClient";

export const instant = false;

export function generateStaticParams() {
  return venues.map((venue) => ({ id: venue.id }));
}

export default async function DetailTempatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const venueExists = venues.some((venue) => venue.id === id);

  if (!venueExists) {
    notFound();
  }

  return <DetailTempatClient id={id} />;
}

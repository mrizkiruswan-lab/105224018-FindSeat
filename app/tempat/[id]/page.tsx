export const instant = false;
import { venues } from "@/lib/mock-data";
import DetailTempatClient from "./DetailTempatClient";

export function generateStaticParams() {
  return venues.map((venue) => ({
    id: venue.id,
  }));
}

export default async function DetailTempatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DetailTempatClient id={id} />;
}
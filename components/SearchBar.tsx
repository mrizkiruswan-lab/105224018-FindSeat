import Link from "next/link";
import type { Venue } from "@/lib/types";
import { getAvailableSeats } from "@/lib/mock-data";

type VenueCardProps = {
  venue: Venue;
};

export default function VenueCard({ venue }: VenueCardProps) {
  const available = getAvailableSeats(venue);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#dce8e2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-[#e5f4ed] px-3 py-1 text-xs font-semibold text-[#0b5b49]">
          {venue.category}
        </span>

        <span className="text-xs text-[#61736d]">
          {venue.totalSeats} kursi
        </span>
      </div>

      <h2 className="mt-5 text-xl font-bold text-[#163b32]">
        {venue.name}
      </h2>

      <p className="mt-2 text-sm text-[#61736d]">
        {venue.location}
      </p>

      <p className="mt-4 flex-1 text-sm leading-6 text-[#61736d]">
        {venue.description}
      </p>

      <div className="mt-5 rounded-xl bg-[#f1f7f3] p-4">
        <p className="text-sm text-[#61736d]">Kursi tersedia</p>
        <p className="mt-1 text-2xl font-bold text-[#147d64]">
          {available}{" "}
          <span className="text-sm font-medium text-[#61736d]">
            dari {venue.totalSeats} kursi
          </span>
        </p>
      </div>

      <Link
        href={`/tempat/${venue.id}`}
        className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#147d64] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5b49]"
      >
        Lihat Denah Kursi
      </Link>
    </article>
  );
}
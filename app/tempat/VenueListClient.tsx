
"use client";

import { useMemo, useState } from "react";
import VenueCard from "@/components/VenueCard";

export type VenueListItem = {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
};

export default function VenueListClient({
  venues,
}: {
  venues: VenueListItem[];
}) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Semua");

  const categories = [
    "Semua",
    ...Array.from(new Set(venues.map((venue) => venue.category))),
  ];

  const filteredVenues = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    return venues.filter((venue) => {
      const matchesKeyword =
        venue.name.toLowerCase().includes(query) ||
        venue.location.toLowerCase().includes(query) ||
        venue.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "Semua" || venue.category === category;

      return matchesKeyword && matchesCategory;
    });
  }, [keyword, category, venues]);

  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-[#147d64]">
          Jelajahi fasilitas
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#163b32] sm:text-4xl">
          Cari tempat duduk
        </h1>

        <p className="mt-4 leading-7 text-[#61736d]">
          Temukan perpustakaan, ruang belajar, atau coworking space dan
          periksa ketersediaan kursinya.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[#dce8e2] bg-[#f1f7f3] p-5 sm:p-6">
        <label htmlFor="venue-search" className="sr-only">
          Cari tempat
        </label>

        <input
          id="venue-search"
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Cari nama tempat, lokasi, atau deskripsi..."
          className="min-h-12 w-full rounded-xl border border-[#dce8e2] bg-white px-4 py-3 text-[#163b32] placeholder:text-[#82918b] focus:border-[#147d64] focus:outline-none focus:ring-2 focus:ring-[#147d64]/20"
        />

        <fieldset className="mt-5">
          <legend className="mb-3 text-sm font-semibold text-[#163b32]">
            Filter kategori
          </legend>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === item
                    ? "border-[#147d64] bg-[#147d64] text-white"
                    : "border-[#dce8e2] bg-white text-[#61736d] hover:border-[#147d64]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[#163b32]">
          Daftar tempat
        </h2>

        <p className="text-sm text-[#61736d]" aria-live="polite">
          {filteredVenues.length} tempat ditemukan
        </p>
      </div>

      {filteredVenues.length > 0 ? (
        <div className="mt-5 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-[#cbdcd2] bg-white px-5 py-12 text-center">
          <h3 className="text-lg font-bold text-[#163b32]">
            Tempat tidak ditemukan
          </h3>

          <p className="mt-2 text-sm text-[#61736d]">
            Coba kata kunci lain atau pilih kategori Semua.
          </p>

          <button
            type="button"
            onClick={() => {
              setKeyword("");
              setCategory("Semua");
            }}
            className="mt-5 min-h-11 rounded-xl bg-[#147d64] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b5b49]"
          >
            Reset pencarian
          </button>
        </div>
      )}
    </section>
  );
}

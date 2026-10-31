
"use client";

import { useMemo, useState } from "react";
import SeatMap from "@/components/SeatMap";
import CheckInForm from "@/components/CheckInForm";
import StatusBadge from "@/components/StatusBadge";
import type { SeatStatus } from "@/lib/types";

type VenueDetail = {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  totalSeats: number;
  seats: {
    id: string;
    number: number;
    status: SeatStatus;
  }[];
};

type DetailTempatClientProps = {
  venue: VenueDetail;
};

export default function DetailTempatClient({
  venue,
}: DetailTempatClientProps) {
  const [selectedSeatId, setSelectedSeatId] = useState<string>("");

  const selectedSeat = useMemo(
    () =>
      venue.seats.find((seat) => seat.id === selectedSeatId) ?? null,
    [venue.seats, selectedSeatId]
  );

  const availableCount = venue.seats.filter(
    (seat) => seat.status === "tersedia"
  ).length;

  function handleSeatSelect(seatId: string) {
    const seat = venue.seats.find((item) => item.id === seatId);

    if (!seat || seat.status !== "tersedia") {
      return;
    }

    setSelectedSeatId(seatId);
  }

  return (
    <main className="min-h-screen bg-[#f5faf7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#147d64]">
            {venue.category}
          </p>

          <h1 className="text-3xl font-bold text-[#163b32] sm:text-4xl">
            {venue.name}
          </h1>

          <p className="mt-3 text-lg text-[#61736d]">
            {venue.location}
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-[#61736d]">
            {venue.description}
          </p>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#dce8e2] bg-white p-6">
            <p className="text-sm text-[#61736d]">Total kursi</p>
            <p className="mt-2 text-3xl font-bold text-[#163b32]">
              {venue.totalSeats}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce8e2] bg-white p-6">
            <p className="text-sm text-[#61736d]">Kursi tersedia</p>
            <p className="mt-2 text-3xl font-bold text-[#147d64]">
              {availableCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce8e2] bg-white p-6">
            <p className="text-sm text-[#61736d]">Contoh status</p>
            <div className="mt-3">
              <StatusBadge status="tersedia" />
            </div>
            <p className="mt-2 text-sm text-[#61736d]">
              Status kursi dibaca dari database.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-[#dce8e2] bg-white p-5 sm:p-6 lg:col-span-7">
            <h2 className="text-xl font-bold text-[#163b32]">
              Denah tempat duduk
            </h2>

            <p className="mt-2 text-[#61736d]">
              Pilih kursi hijau yang ingin digunakan.
            </p>

            <div className="mt-6">
              <SeatMap
                seats={venue.seats}
                selectedSeatId={selectedSeatId}
                onSelect={handleSeatSelect}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-green-300 bg-green-100" />
                <span className="text-[#61736d]">Tersedia</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-red-300 bg-red-100" />
                <span className="text-[#61736d]">Digunakan</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-amber-300 bg-amber-100" />
                <span className="text-[#61736d]">Ditinggalkan</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            {selectedSeat ? (
              <CheckInForm
                seatId={Number(selectedSeat.id)}
                seatNumber={selectedSeat.number}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-[#cbded4] bg-white/50 p-6">
                <h2 className="font-bold text-[#163b32]">
                  Belum ada kursi dipilih
                </h2>
                <p className="mt-2 leading-6 text-[#61736d]">
                  Pilih kursi yang tersedia pada denah untuk melanjutkan
                  proses check-in.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-[#dce8e2] bg-[#edf7f2] p-5">
              <h3 className="font-bold text-[#163b32]">
                Informasi penggunaan kursi
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#61736d]">
                Setelah check-in berhasil, status kursi akan berubah
                menjadi digunakan dan data check-in tersimpan di database.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

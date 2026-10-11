"use client";

import Link from "next/link";
import { useState } from "react";
import SeatMap from "@/components/SeatMap";
import CheckInForm from "@/components/CheckInForm";
import StatusBadge from "@/components/StatusBadge";
import { venues } from "@/lib/mock-data";

export default function DetailTempatClient({ id }: { id: string }) {
const venue = venues.find((item) => item.id === id);

const [selectedSeatId, setSelectedSeatId] = useState("");
const [message, setMessage] = useState("");

if (!venue) {
return (
<section className="mx-auto max-w-3xl px-4 py-20 text-center">
<h1 className="text-2xl font-bold text-[#163b32]">
Tempat tidak ditemukan
</h1>
<p className="mt-3 text-[#61736d]">
Tempat yang kamu cari tidak tersedia dalam data simulasi.
</p>
<Link
       href="/tempat"
       className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#147d64] px-5 py-3 font-semibold text-white"
     >
Kembali ke daftar tempat
</Link>
</section>
);
}

const selectedSeat = venue.seats.find(
(seat) => seat.id === selectedSeatId
);

const availableCount = venue.seats.filter(
(seat) => seat.status === "tersedia"
).length;

function handleCheckIn(name: string, email: string) {
if (!selectedSeat || selectedSeat.status !== "tersedia") {
setMessage("Silakan pilih kursi yang masih tersedia.");
return;
}

setMessage(
  `Check-in simulasi berhasil untuk ${name} (${email}) di kursi ${String(
    selectedSeat.number
  ).padStart(2, "0")}.`
);

}

return (
<section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
<Link
     href="/tempat"
     className="inline-flex min-h-10 items-center rounded text-sm font-semibold text-[#147d64] hover:text-[#0b5b49]"
   >
← Kembali ke daftar tempat
</Link>

  <div className="mt-6">
    <span className="rounded-full bg-[#e5f4ed] px-3 py-1 text-xs font-semibold text-[#0b5b49]">
      {venue.category}
    </span>
    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#163b32] sm:text-4xl">
      {venue.name}
    </h1>
    <p className="mt-2 text-[#61736d]">{venue.location}</p>
    <p className="mt-4 max-w-3xl leading-7 text-[#61736d]">
      {venue.description}
    </p>
  </div>

  <div className="mt-8 grid gap-4 sm:grid-cols-3">
    <div className="rounded-2xl border border-[#dce8e2] bg-white p-5">
      <p className="text-sm text-[#61736d]">Total kursi</p>
      <p className="mt-2 text-3xl font-bold text-[#163b32]">
        {venue.totalSeats}
      </p>
    </div>

    <div className="rounded-2xl border border-[#dce8e2] bg-white p-5">
      <p className="text-sm text-[#61736d]">Kursi tersedia</p>
      <p className="mt-2 text-3xl font-bold text-[#147d64]">
        {availableCount}
      </p>
    </div>

    <div className="rounded-2xl border border-[#dce8e2] bg-white p-5">
      <p className="text-sm text-[#61736d]">Contoh status</p>
      <p className="mt-3">
        <StatusBadge status="tersedia" />
      </p>
      <p className="mt-2 text-xs text-[#61736d]">
        Status kursi masih berupa data simulasi.
      </p>
    </div>
  </div>

  <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <section className="rounded-2xl border border-[#dce8e2] bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-[#163b32]">
        Denah tempat duduk
      </h2>
      <p className="mt-2 text-sm text-[#61736d]">
        Pilih kursi hijau yang ingin digunakan.
      </p>

      <div className="mt-6">
        <SeatMap
          seats={venue.seats}
          selectedSeatId={selectedSeatId}
          onSelect={(seatId) => {
            setSelectedSeatId(seatId);
            setMessage("");
          }}
        />
      </div>
    </section>

    <div className="space-y-6">
      {selectedSeat && selectedSeat.status === "tersedia" ? (
        <CheckInForm
          key={selectedSeat.id}
          seatNumber={selectedSeat.number}
          onSubmit={handleCheckIn}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cbdcd2] bg-[#f7faf8] p-5">
          <h2 className="font-bold text-[#163b32]">
            Belum ada kursi dipilih
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#61736d]">
            Pilih kursi yang tersedia pada denah untuk melanjutkan
            simulasi check-in.
          </p>
        </div>
      )}

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-[#a9d8c2] bg-[#e5f4ed] p-4 text-sm leading-6 text-[#0b5b49]"
        >
          {message}
        </div>
      )}
    </div>
  </div>

  <div className="mt-8 rounded-2xl border border-[#f0d38a] bg-[#fff7df] p-5">
    <h2 className="font-bold text-[#76560b]">
      Tentang temporary leave
    </h2>
    <p className="mt-2 text-sm leading-6 text-[#76560b]">
      Fitur temporary leave dan auto release akan dikembangkan pada
      tahap berikutnya. Saat ini status kursi masih menggunakan
      data simulasi.
    </p>
  </div>
</section>

);
}
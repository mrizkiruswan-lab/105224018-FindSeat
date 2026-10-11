"use client";

import type { Seat } from "@/lib/types";

type SeatMapProps = {
  seats: Seat[];
  selectedSeatId: string;
  onSelect: (seatId: string) => void;
};

const seatStyles = {
  tersedia:
    "border-[#a9d8c2] bg-[#e5f4ed] text-[#0b5b49] hover:bg-[#d2ecdf]",
  digunakan:
    "cursor-not-allowed border-[#efb8b8] bg-[#fff0f0] text-[#a52f2f]",
  ditinggalkan:
    "cursor-not-allowed border-[#f0d38a] bg-[#fff7df] text-[#8a650b]",
};

export default function SeatMap({
  seats,
  selectedSeatId,
  onSelect,
}: SeatMapProps) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {seats.map((seat) => {
          const selected = selectedSeatId === seat.id;
          const available = seat.status === "tersedia";

          return (
            <button
              key={seat.id}
              type="button"
              disabled={!available}
              aria-pressed={selected}
              aria-label={`Kursi ${seat.number}, ${
                selected ? "dipilih" : seat.status
              }`}
              onClick={() => onSelect(seat.id)}
              className={`flex aspect-square min-h-14 items-center justify-center rounded-xl border-2 text-sm font-bold transition focus-visible:outline-offset-2 ${
                selected
                  ? "border-[#147d64] bg-[#147d64] text-white ring-2 ring-[#147d64] ring-offset-2"
                  : seatStyles[seat.status]
              }`}
            >
              {String(seat.number).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3 text-xs text-[#61736d]">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#a9d8c2]" />
          Tersedia
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#efb8b8]" />
          Digunakan
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#f0d38a]" />
          Ditinggalkan sementara
        </span>
      </div>

      <p className="mt-4 text-sm text-[#61736d]">
        Pilih kursi berwarna hijau untuk menentukan tempat dudukmu.
      </p>
    </div>
  );
}
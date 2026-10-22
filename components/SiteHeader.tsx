import Link from "next/link";
import { Suspense } from "react";
import TautanNav from "@/components/TautanNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dce8e2] bg-white">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg"
          aria-label="FindSeat, halaman beranda"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#147d64] text-2xl text-white">
            F
          </span>

          <span>
            <span className="block text-xl font-bold text-[#163b32]">
              FindSeat
            </span>
            <span className="block text-sm text-[#61736d]">
              Temukan tempat dudukmu
            </span>
          </span>
        </Link>

        <Suspense
          fallback={
            <nav aria-label="Navigasi utama" className="flex gap-2 sm:gap-4">
              <Link href="/" className="rounded-xl px-3 py-3 text-sm">
                Beranda
              </Link>
              <Link href="/tempat" className="rounded-xl px-3 py-3 text-sm">
                Cari Tempat
              </Link>
              <Link href="/tentang" className="rounded-xl px-3 py-3 text-sm">
                Tentang
              </Link>
            </nav>
          }
        >
          <TautanNav />
        </Suspense>
      </div>
    </header>
  );
}

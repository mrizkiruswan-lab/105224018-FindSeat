import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#dce8e2] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-lg font-bold text-[#163b32]">FindSeat</p>
          <p className="mt-1 max-w-md text-sm leading-6 text-[#61736d]">
            Membantu kamu menemukan tempat duduk yang tersedia dengan lebih
            mudah dan teratur.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#61736d]">
            <li>
              <Link href="/" className="rounded hover:text-[#147d64]">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/tempat" className="rounded hover:text-[#147d64]">
                Cari Tempat
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-[#dce8e2] px-4 py-4 text-center text-xs text-[#61736d]">
        © 2026 FindSeat. Proyek pengembangan aplikasi web.
      </div>
    </footer>
  );
}
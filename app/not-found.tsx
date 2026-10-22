
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="font-bold text-[#147d64]">404</p>

      <h1 className="mt-3 text-3xl font-bold text-[#163b32]">
        Tempat tidak ditemukan
      </h1>

      <p className="mt-3 text-[#61736d]">
        Maaf, tempat yang kamu cari tidak tersedia atau ID tempatnya salah.
      </p>

      <Link
        href="/tempat"
        className="mt-6 rounded-xl bg-[#147d64] px-5 py-3 font-semibold text-white hover:bg-[#0b5b49]"
      >
        Kembali ke daftar tempat
      </Link>
    </main>
  );
}

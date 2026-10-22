
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang FindSeat",
  description:
    "Informasi mengenai FindSeat, platform pencarian dan pemilihan kursi di tempat umum.",
};

export default function TentangPage() {
  return (
    <main
      id="konten"
      className="mx-auto max-w-3xl px-4 py-10"
    >
      <h1 className="text-3xl font-bold text-slate-900">
        Tentang FindSeat
      </h1>

      <p className="mt-4 leading-7 text-slate-700">
        FindSeat merupakan platform berbasis web yang membantu
        pengguna menemukan tempat dan mengetahui ketersediaan
        kursi di perpustakaan, ruang belajar, coworking space,
        dan tempat umum lainnya.
      </p>

      <p className="mt-3 leading-7 text-slate-700">
        Pengguna dapat melihat informasi tempat, memilih kursi
        yang tersedia, serta melakukan simulasi check-in.
        FindSeat bertujuan membuat proses mencari tempat duduk
        menjadi lebih mudah dan terorganisasi.
      </p>
    </main>
  );
}

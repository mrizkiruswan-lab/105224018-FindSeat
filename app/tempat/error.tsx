
"use client";

import { useEffect } from "react";

export default function ErrorTempat({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Terjadi kesalahan pada halaman tempat:", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
      <p className="font-bold uppercase tracking-widest text-[#147d64]">
        Terjadi kesalahan
      </p>

      <h1 className="mt-3 text-3xl font-bold text-[#163b32]">
        Halaman tempat mengalami masalah
      </h1>

      <p className="mt-4 leading-7 text-[#61736d]">
        Maaf, informasi tempat belum dapat ditampilkan. Silakan coba lagi.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 min-h-11 rounded-xl bg-[#147d64] px-5 py-3 font-semibold text-white hover:bg-[#0b5b49]"
      >
        Coba lagi
      </button>
    </section>
  );
}

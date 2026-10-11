import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Lihat ketersediaan",
    description:
      "Ketahui kursi yang tersedia sebelum memilih tempat untuk belajar atau bekerja.",
  },
  {
    number: "02",
    title: "Pilih tempat duduk",
    description:
      "Lihat denah kursi dan pilih posisi yang sesuai dengan kebutuhanmu.",
  },
  {
    number: "03",
    title: "Pergi sementara",
    description:
      "Gunakan fitur temporary leave dengan batas waktu agar penggunaan kursi lebih tertib.",
  },
];

const venues = [
  {
    name: "Perpustakaan Kampus",
    category: "Perpustakaan",
    location: "Area belajar mahasiswa",
    available: 12,
    total: 30,
  },
  {
    name: "Ruang Belajar Bersama",
    category: "Ruang belajar",
    location: "Gedung fasilitas mahasiswa",
    available: 8,
    total: 20,
  },
  {
    name: "Coworking Space",
    category: "Coworking",
    location: "Area kerja bersama",
    available: 15,
    total: 24,
  },
];

export default function Home() {
  return (
    <>
      <section className="overflow-hidden bg-[#edf6f0]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div>
            <span className="inline-flex rounded-full border border-[#c9e5d7] bg-white px-4 py-2 text-sm font-semibold text-[#147d64]">
              Tempat duduk, lebih mudah ditemukan
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#163b32] sm:text-5xl">
              Temukan tempat duduk yang tepat untukmu.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#61736d] sm:text-lg">
              Cari tempat belajar, bekerja, atau menunggu. Lihat informasi
              ketersediaan kursi dan pilih tempat yang sesuai melalui FindSeat.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tempat"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#147d64] px-6 py-3 font-semibold text-white transition hover:bg-[#0b5b49]"
              >
                Cari Tempat Duduk
              </Link>

              <a
                href="#cara-kerja"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#c9dcd1] bg-white px-6 py-3 font-semibold text-[#163b32] transition hover:bg-[#f7faf8]"
              >
                Cara Kerja
              </a>
            </div>

            <p className="mt-5 text-sm text-[#61736d]">
              Untuk perpustakaan, ruang belajar, coworking space, dan fasilitas
              publik.
            </p>
          </div>

          <div
            className="rounded-3xl border border-[#dce8e2] bg-white p-5 shadow-sm sm:p-7"
            aria-label="Ilustrasi denah kursi"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#61736d]">Contoh denah</p>
                <h2 className="mt-1 text-xl font-bold text-[#163b32]">
                  Ruang Belajar A
                </h2>
              </div>
              <span className="rounded-full bg-[#e5f4ed] px-3 py-2 text-xs font-bold text-[#0b5b49]">
                Simulasi
              </span>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {Array.from({ length: 12 }, (_, index) => {
                const occupied = [1, 4, 7, 10].includes(index);
                const temporary = [5, 9].includes(index);

                return (
                  <div
                    key={index}
                    className={`flex aspect-square items-center justify-center rounded-xl border-2 text-sm font-bold ${
                      occupied
                        ? "border-[#efb8b8] bg-[#fff0f0] text-[#a52f2f]"
                        : temporary
                          ? "border-[#f0d38a] bg-[#fff7df] text-[#8a650b]"
                          : "border-[#a9d8c2] bg-[#e5f4ed] text-[#0b5b49]"
                    }`}
                    aria-label={`Kursi ${index + 1}: ${
                      occupied
                        ? "digunakan"
                        : temporary
                          ? "sementara ditinggalkan"
                          : "tersedia"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#61736d]">
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm bg-[#a9d8c2]"
                  aria-hidden="true"
                />
                Tersedia
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm bg-[#efb8b8]"
                  aria-hidden="true"
                />
                Digunakan
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm bg-[#f0d38a]"
                  aria-hidden="true"
                />
                Ditinggalkan sementara
              </span>
            </div>

            <p className="mt-4 rounded-xl bg-[#f7faf8] p-3 text-xs leading-5 text-[#61736d]">
              Status kursi di atas merupakan data simulasi untuk demonstrasi
              antarmuka, bukan ketersediaan kursi secara langsung.
            </p>
          </div>
        </div>
      </section>

      <section
        id="cara-kerja"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#147d64]">
            Cara kerja
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#163b32]">
            Tempat duduk dalam tiga langkah.
          </h2>
          <p className="mt-4 leading-7 text-[#61736d]">
            FindSeat dirancang agar pengguna dapat menemukan dan menggunakan
            kursi dengan alur yang sederhana.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="rounded-2xl border border-[#dce8e2] bg-white p-6"
            >
              <span className="text-sm font-bold text-[#147d64]">
                LANGKAH {feature.number}
              </span>
              <h3 className="mt-4 text-xl font-bold text-[#163b32]">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-[#61736d]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#147d64]">
                Pilihan tempat
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#163b32]">
                Temukan ruang yang kamu butuhkan.
              </h2>
            </div>

            <Link
              href="/tempat"
              className="inline-flex min-h-11 items-center font-semibold text-[#147d64] hover:text-[#0b5b49]"
            >
              Lihat semua tempat →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {venues.map((venue) => (
              <article
                key={venue.name}
                className="rounded-2xl border border-[#dce8e2] bg-[#f7faf8] p-6"
              >
                <span className="inline-flex rounded-full bg-[#e5f4ed] px-3 py-1 text-xs font-semibold text-[#0b5b49]">
                  {venue.category}
                </span>

                <h3 className="mt-4 text-xl font-bold text-[#163b32]">
                  {venue.name}
                </h3>

                <p className="mt-2 text-sm text-[#61736d]">
                  {venue.location}
                </p>

                <div className="mt-5 border-t border-[#dce8e2] pt-4">
                  <p className="text-2xl font-bold text-[#147d64]">
                    {venue.available}{" "}
                    <span className="text-sm font-medium text-[#61736d]">
                      dari {venue.total} kursi tersedia
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-[#61736d]">
                    Contoh data untuk tampilan awal
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#163b32] px-6 py-10 text-white sm:px-10 sm:py-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Tidak perlu bingung mencari kursi kosong.
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#d3e6dc]">
            Mulai dengan memilih tempat dan melihat simulasi ketersediaan kursi
            melalui FindSeat.
          </p>
          <Link
            href="/tempat"
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-white px-6 py-3 font-semibold text-[#163b32] hover:bg-[#e5f4ed]"
          >
            Jelajahi Tempat
          </Link>
        </div>
      </section>
    </>
  );
}
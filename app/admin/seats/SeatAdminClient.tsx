"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createSeat,
  updateSeat,
  deleteSeat,
} from "./actions/seat";

type Venue = {
  id: number;
  name: string;
};

type Seat = {
  id: number;
  number: number;
  status: "tersedia" | "digunakan" | "ditinggalkan";
  venueId: number;
  venueName: string;
  totalCheckIns: number;
};

type Props = {
  venues: Venue[];
  seats: Seat[];
};

const initialForm = {
  venueId: "",
  number: "",
  status: "tersedia",
};

export default function SeatAdminClient({
  venues,
  seats,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEdit(seat: Seat) {
    setEditingId(seat.id);

    setForm({
      venueId: String(seat.venueId),
      number: String(seat.number),
      status: seat.status,
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.set("venueId", form.venueId);
      formData.set("number", form.number);
      formData.set("status", form.status);

      let result;

      if (editingId !== null) {
        formData.set("id", String(editingId));
        result = await updateSeat(formData);
      } else {
        result = await createSeat(formData);
      }

      setMessage(result.message);

      if (result.success) {
        resetForm();
        router.refresh();
      }
    } catch {
      setMessage("Terjadi kesalahan saat menyimpan data kursi.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(seat: Seat) {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kursi ${seat.number} di ${seat.venueName}?`
    );

    if (!confirmed) return;

    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.set("id", String(seat.id));

      const result = await deleteSeat(formData);

      setMessage(result.message);

      if (result.success) {
        if (editingId === seat.id) {
          resetForm();
        }

        router.refresh();
      }
    } catch {
      setMessage("Terjadi kesalahan saat menghapus kursi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin - Kelola Seat
        </h1>

        <p className="mt-2 text-lg text-slate-600">
          Tambahkan, ubah, dan kelola kursi pada setiap Venue FindSeat.
        </p>
      </div>

      {/* Form Tambah dan Edit Seat */}
      <section className="mb-10 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {editingId !== null ? "Edit Seat" : "Tambah Seat"}
        </h2>

        {venues.length === 0 ? (
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800">
            Belum ada Venue. Tambahkan Venue terlebih dahulu.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="venueId"
                className="mb-2 block font-semibold text-slate-800"
              >
                Pilih Venue
              </label>

              <select
                id="venueId"
                name="venueId"
                value={form.venueId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-400 bg-white px-4 py-4 text-lg outline-none focus:border-emerald-700"
              >
                <option value="">Pilih Venue</option>

                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="number"
                className="mb-2 block font-semibold text-slate-800"
              >
                Nomor Kursi
              </label>

              <input
                id="number"
                type="number"
                name="number"
                min="1"
                value={form.number}
                onChange={handleChange}
                placeholder="Contoh: 31"
                required
                className="w-full rounded-xl border border-slate-400 px-4 py-4 text-lg outline-none focus:border-emerald-700"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block font-semibold text-slate-800"
              >
                Status Kursi
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-400 bg-white px-4 py-4 text-lg outline-none focus:border-emerald-700"
              >
                <option value="tersedia">Tersedia</option>
                <option value="digunakan">Digunakan</option>
                <option value="ditinggalkan">Ditinggalkan</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-emerald-700 px-7 py-4 text-lg font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isLoading
                  ? "Memproses..."
                  : editingId !== null
                    ? "Simpan Perubahan"
                    : "Tambah Seat"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="rounded-xl border border-slate-300 px-7 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        )}

        {message && (
          <p
            role="status"
            className="mt-5 rounded-lg bg-slate-100 p-4 text-slate-800"
          >
            {message}
          </p>
        )}
      </section>

      {/* Daftar Seat */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Daftar Seat ({seats.length})
        </h2>

        {seats.length === 0 ? (
          <p className="text-slate-500">
            Belum ada kursi yang terdaftar.
          </p>
        ) : (
          <div className="space-y-5">
            {seats.map((seat) => (
              <article
                key={seat.id}
                className="flex flex-col justify-between gap-5 rounded-xl border border-emerald-100 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Kursi {seat.number}
                  </h3>

                  <p className="mt-2 text-lg text-slate-600">
                    {seat.venueName}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Status: {seat.status} · Riwayat CheckIn:{" "}
                    {seat.totalCheckIns}
                  </p>
                </div>

                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(seat)}
                    disabled={isLoading}
                    className="rounded-xl bg-amber-100 px-5 py-3 text-lg text-amber-800 hover:bg-amber-200 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(seat)}
                    disabled={isLoading}
                    className="rounded-xl bg-red-100 px-5 py-3 text-lg text-red-700 hover:bg-red-200 disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
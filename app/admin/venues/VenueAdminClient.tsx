"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createVenue,
  updateVenue,
  deleteVenue,
} from "./actions/venue";

type Venue = {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  totalSeats: number;
};

type VenueAdminClientProps = {
  venues: Venue[];
};

const initialForm = {
  name: "",
  slug: "",
  category: "",
  location: "",
  description: "",
};

export default function VenueAdminClient({
  venues,
}: VenueAdminClientProps) {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEdit(venue: Venue) {
    setEditingId(venue.id);

    setForm({
      name: venue.name,
      slug: venue.slug,
      category: venue.category,
      location: venue.location,
      description: venue.description,
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

      formData.set("name", form.name);
      formData.set("slug", form.slug);
      formData.set("category", form.category);
      formData.set("location", form.location);
      formData.set("description", form.description);

      let result;

      if (editingId !== null) {
        // Memasukkan ID Venue ke dalam FormData untuk proses update.
        formData.set("id", String(editingId));

        result = await updateVenue(formData);
      } else {
        result = await createVenue(formData);
      }

      setMessage(result.message);

      if (result.success) {
        resetForm();
        router.refresh();
      }
    } catch {
      setMessage("Terjadi kesalahan saat menyimpan Venue.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus Venue "${name}"?`
    );

    if (!confirmed) return;

    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.set("id", String(id));

      const result = await deleteVenue(formData);

      setMessage(result.message);

      if (result.success) {
        if (editingId === id) {
          resetForm();
        }

        router.refresh();
      }
    } catch {
      setMessage("Terjadi kesalahan saat menghapus Venue.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin - Kelola Venue
        </h1>

        <p className="mt-2 text-lg text-slate-600">
          Tambahkan, ubah, dan kelola tempat pada FindSeat.
        </p>
      </div>

      {/* Form Tambah dan Edit Venue */}
      <section className="mb-10 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {editingId !== null ? "Edit Venue" : "Tambah Venue"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama tempat"
            required
            className="w-full rounded-xl border border-slate-400 px-4 py-4 text-lg outline-none focus:border-emerald-700"
          />

          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug, contoh: ruang-belajar"
            required
            className="w-full rounded-xl border border-slate-400 px-4 py-4 text-lg outline-none focus:border-emerald-700"
          />

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Kategori"
            required
            className="w-full rounded-xl border border-slate-400 px-4 py-4 text-lg outline-none focus:border-emerald-700"
          />

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Lokasi"
            required
            className="w-full rounded-xl border border-slate-400 px-4 py-4 text-lg outline-none focus:border-emerald-700"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi tempat"
            required
            rows={4}
            className="w-full rounded-xl border border-slate-400 px-4 py-4 text-lg outline-none focus:border-emerald-700"
          />

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
                  : "Tambah Venue"}
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

        {message && (
          <p
            role="status"
            className="mt-5 rounded-lg bg-slate-100 p-4 text-slate-800"
          >
            {message}
          </p>
        )}
      </section>

      {/* Daftar Venue */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Daftar Venue ({venues.length})
        </h2>

        {venues.length === 0 ? (
          <p className="text-slate-500">
            Belum ada Venue yang terdaftar.
          </p>
        ) : (
          <div className="space-y-5">
            {venues.map((venue) => (
              <article
                key={venue.id}
                className="flex flex-col justify-between gap-5 rounded-xl border border-emerald-100 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {venue.name}
                  </h3>

                  <p className="mt-2 text-lg text-slate-600">
                    {venue.category} · {venue.location}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Slug: {venue.slug} · {venue.totalSeats} kursi
                  </p>
                </div>

                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(venue)}
                    disabled={isLoading}
                    className="rounded-xl bg-amber-100 px-5 py-3 text-lg text-amber-800 hover:bg-amber-200 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(venue.id, venue.name)
                    }
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkInSchema,
  type CheckInFormData,
} from "@/schema/check-in";
import { createCheckIn } from "@/app/tempat/[id]/actions";

type CheckInFormProps = {
  seatId: number;
  seatNumber: number;
};

export default function CheckInForm({
  seatId,
  seatNumber,
}: CheckInFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckInFormData, string>>
  >({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validation = checkInSchema.safeParse({
      name,
      email,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      });

      return;
    }

    setErrors({});
    setMessage("");
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const result = await createCheckIn({
        seatId,
        name: validation.data.name,
        email: validation.data.email,
      });

      setMessage(result.message);
      setIsSuccess(result.success);

      if (result.success) {
        setName("");
        setEmail("");
        router.refresh();
      }
    } catch {
      setMessage("Terjadi kesalahan saat mengirim check-in.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[#dce8e2] bg-white p-5 sm:p-6"
    >
      <h2 className="text-xl font-bold text-[#163b32]">
        Konfirmasi check-in
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#61736d]">
        Kamu memilih kursi nomor{" "}
        <span className="font-bold text-[#147d64]">
          {String(seatNumber).padStart(2, "0")}
        </span>
        . Isi data berikut untuk melakukan check-in.
      </p>

      <div className="mt-5">
        <label
          htmlFor="checkin-name"
          className="mb-2 block text-sm font-semibold text-[#163b32]"
        >
          Nama lengkap
        </label>

        <input
          id="checkin-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={80}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setErrors((current) => ({
              ...current,
              name: undefined,
            }));
          }}
          aria-invalid={Boolean(errors.name)}
          placeholder="Masukkan nama lengkap"
          className="min-h-12 w-full rounded-xl border border-[#dce8e2] px-4 text-[#163b32] focus:border-[#147d64] focus:outline-none focus:ring-2 focus:ring-[#147d64]/20"
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label
          htmlFor="checkin-email"
          className="mb-2 block text-sm font-semibold text-[#163b32]"
        >
          Alamat email
        </label>

        <input
          id="checkin-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((current) => ({
              ...current,
              email: undefined,
            }));
          }}
          aria-invalid={Boolean(errors.email)}
          placeholder="nama@email.com"
          className="min-h-12 w-full rounded-xl border border-[#dce8e2] px-4 text-[#163b32] focus:border-[#147d64] focus:outline-none focus:ring-2 focus:ring-[#147d64]/20"
        />

        {errors.email && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 min-h-12 w-full rounded-xl bg-[#147d64] px-5 py-3 font-semibold text-white transition hover:bg-[#0b5b49] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Menyimpan..." : "Konfirmasi Check-in"}
      </button>

      {message && (
        <p
          role="status"
          className={`mt-4 rounded-xl p-3 text-sm ${
            isSuccess
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-3 text-xs leading-5 text-[#61736d]">
        Data check-in akan disimpan ke database PostgreSQL.
      </p>
    </form>
  );
}


"use client";

import { useState } from "react";
import {
  checkInSchema,
  type CheckInFormData,
} from "@/schema/check-in";

type CheckInFormProps = {
  seatNumber: number;
  onSubmit: (name: string, email: string) => void;
};

export default function CheckInForm({
  seatNumber,
  onSubmit,
}: CheckInFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckInFormData, string>>
  >({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = checkInSchema.safeParse({ name, email });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      });

      return;
    }

    setErrors({});
    onSubmit(result.data.name, result.data.email);
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
        . Isi data berikut untuk menyimulasikan proses check-in.
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
            setErrors((current) => ({ ...current, name: undefined }));
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "checkin-name-error" : undefined}
          placeholder="Masukkan nama lengkap"
          className="min-h-12 w-full rounded-xl border border-[#dce8e2] px-4 text-[#163b32] focus:border-[#147d64] focus:outline-none focus:ring-2 focus:ring-[#147d64]/20"
        />

        {errors.name && (
          <p
            id="checkin-name-error"
            role="alert"
            className="mt-2 text-sm text-red-600"
          >
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
            setErrors((current) => ({ ...current, email: undefined }));
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "checkin-email-error" : undefined}
          placeholder="nama@email.com"
          className="min-h-12 w-full rounded-xl border border-[#dce8e2] px-4 text-[#163b32] focus:border-[#147d64] focus:outline-none focus:ring-2 focus:ring-[#147d64]/20"
        />

        {errors.email && (
          <p
            id="checkin-email-error"
            role="alert"
            className="mt-2 text-sm text-red-600"
          >
            {errors.email}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 min-h-12 w-full rounded-xl bg-[#147d64] px-5 py-3 font-semibold text-white transition hover:bg-[#0b5b49]"
      >
        Konfirmasi Check-in
      </button>

      <p className="mt-3 text-xs leading-5 text-[#61736d]">
        Formulir ini hanya demonstrasi antarmuka. Data belum dikirim ke
        server atau disimpan ke database.
      </p>
    </form>
  );
}

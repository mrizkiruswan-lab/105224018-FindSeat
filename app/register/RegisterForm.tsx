
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        name,
        email,
        password,
      });

      setMessage(result.message);

      if (result.success) {
        router.push("/login?registered=true");
      }
    } catch {
      setMessage("Terjadi kesalahan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block font-semibold">
          Nama Lengkap
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          autoComplete="name"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#147d64]"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#147d64]"
          placeholder="nama@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#147d64]"
          placeholder="Minimal 8 karakter"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block font-semibold">
          Konfirmasi Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#147d64]"
          placeholder="Ulangi password"
        />
      </div>

      {message && (
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#147d64] px-4 py-3 font-semibold text-white transition hover:bg-[#106b55] disabled:opacity-60"
      >
        {loading ? "Mendaftarkan..." : "Daftar Akun"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Sudah punya akun?{" "}
        <a href="/login" className="font-semibold text-[#147d64] hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}

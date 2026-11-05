
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error || !result.ok) {
        setError("Email atau password salah.");
        return;
      }

      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      if (!response.ok) {
        setError("Gagal mengambil informasi session.");
        return;
      }

      const session = await response.json();

      if (session?.user?.role === "ADMIN") {
        router.replace("/admin/seats");
      } else if (session?.user?.role === "USER") {
        router.replace("/tempat");
      } else {
        setError("Role akun tidak valid.");
        return;
      }

      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Masukkan email"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Masukkan password"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Login"}
      </button>
    </form>
  );
}

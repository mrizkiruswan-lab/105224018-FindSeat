
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./LoginForm";

export const instant = false;

export default async function LoginPage() {
  await connection();

  const session = await auth();

  if (session?.user) {
    redirect(
      session.user.role === "ADMIN" ? "/admin/seats" : "/tempat",
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Login FindSeat
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Masuk menggunakan akun FindSeat Anda.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}

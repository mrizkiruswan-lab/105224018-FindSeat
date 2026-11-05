
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import RegisterForm from "./RegisterForm";

export const instant = false;

export default async function RegisterPage() {
  await connection();

  const session = await auth();

  if (session?.user) {
    redirect(
      session.user.role === "ADMIN" ? "/admin/seats" : "/tempat"
    );
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f5f9f7] px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-[#dce8e2] bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#147d64] text-2xl font-bold text-white">
            F
          </div>

          <h1 className="text-3xl font-bold text-[#163b32]">
            Buat Akun FindSeat
          </h1>

          <p className="mt-2 text-gray-600">
            Daftar sekarang dan temukan tempat dudukmu.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-xs text-gray-500">
          Dengan mendaftar, akun kamu akan mendapatkan akses sebagai USER.
        </p>
      </section>
    </main>
  );
}

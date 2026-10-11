import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "FindSeat — Temukan Tempat Dudukmu",
  description:
    "Cari dan pilih tempat duduk yang tersedia di perpustakaan, ruang belajar, dan coworking space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3"
        >
          Lewati ke konten utama
        </a>

        <SiteHeader />

        <main id="konten-utama" className="min-h-[70vh]">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
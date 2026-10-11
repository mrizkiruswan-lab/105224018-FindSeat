"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

function HeaderNavigation() {
const pathname = usePathname();

const navLinks = [
{ href: "/", label: "Beranda" },
{ href: "/tempat", label: "Cari Tempat" },
];

return (
<nav
   aria-label="Navigasi utama"
   className="flex items-center gap-2 sm:gap-4"
 >
{navLinks.map((link) => {
const active =
link.href === "/"
? pathname === "/"
: pathname.startsWith("/tempat");

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
          active
            ? "bg-[#e5f4ed] text-[#163b32]"
            : "text-[#163b32] hover:bg-[#f1f7f3]"
        }`}
      >
        {link.label}
      </Link>
    );
  })}
</nav>

);
}

export default function SiteHeader() {
return (
<header className="sticky top-0 z-50 border-b border-[#dce8e2] bg-white">
<div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
<Link
       href="/"
       className="flex items-center gap-3 rounded-lg"
       aria-label="FindSeat, halaman beranda"
     >
<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#147d64] text-2xl text-white">
F
</span>

      <span>
        <span className="block text-xl font-bold text-[#163b32]">
          FindSeat
        </span>
        <span className="block text-sm text-[#61736d]">
          Temukan tempat dudukmu
        </span>
      </span>
    </Link>

    <Suspense
      fallback={
        <nav aria-label="Navigasi utama" className="flex gap-2">
          <Link href="/" className="rounded-xl px-4 py-3 text-sm">
            Beranda
          </Link>
          <Link href="/tempat" className="rounded-xl px-4 py-3 text-sm">
            Cari Tempat
          </Link>
        </nav>
      }
    >
      <HeaderNavigation />
    </Suspense>
  </div>
</header>

);
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tempat", label: "Cari Tempat" },
  { href: "/tentang", label: "Tentang" },
];

export default function TautanNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="flex items-center gap-2 sm:gap-4"
    >
      {navLinks.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : link.href === "/tempat"
              ? pathname.startsWith("/tempat")
              : pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-4 ${
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/track", label: "Track" },
  { href: "/support", label: "Support" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  function onTrack(e: FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setMobileOpen(false);
    router.push(`/track?id=${encodeURIComponent(trackingId.trim())}`);
  }

  function isActive(href: string) {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-secondary/95 text-white backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/delivery-truck-logo.png"
              alt="CargoWatch Logo"
              width={36}
              height={36}
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              priority
            />
            <span className="font-display truncate text-xl font-bold tracking-tight sm:text-2xl">
              CargoWatch
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "text-sm font-semibold text-white"
                      : "text-sm font-medium text-white/70 transition hover:text-white"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <form onSubmit={onTrack} className="relative">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Tracking ID"
                className="w-44 rounded-md border border-white/15 bg-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-accent lg:w-52"
              />
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
            <Link
              href="/track"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Track now
            </Link>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 pb-4 lg:hidden">
            <nav className="flex flex-col gap-1 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <form onSubmit={onTrack} className="mt-2 space-y-2 px-3">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking ID..."
                  className="w-full rounded-md border border-white/15 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/45 outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-accent py-2.5 font-semibold text-white"
                >
                  Track
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

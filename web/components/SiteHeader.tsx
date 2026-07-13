"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/track", label: "Track Shipment" },
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white shadow-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <Link href="/" className="flex min-w-0 items-center space-x-2">
            <Image
              src="/delivery-truck-logo.png"
              alt="CargoWatch Logo"
              width={32}
              height={32}
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
              priority
            />
            <span className="truncate text-lg font-bold text-primary sm:text-xl">CargoWatch</span>
          </Link>

          <nav className="hidden items-center space-x-6 md:flex lg:space-x-8">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "font-semibold text-primary"
                      : "text-text-secondary transition-colors hover:text-primary"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={onTrack} className="relative hidden md:block">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID..."
              className="input-field w-44 py-2 pl-10 pr-3 text-sm lg:w-64"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted lg:h-5 lg:w-5"
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

          <button
            type="button"
            className="rounded-md p-2 text-text-secondary hover:text-primary md:hidden"
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
          <div className="border-t border-border bg-white md:hidden">
            <nav className="flex flex-col space-y-1 px-1 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-text-secondary hover:bg-surface hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <form onSubmit={onTrack} className="mt-2 px-3 pb-2">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking ID..."
                  className="input-field px-3 py-2.5"
                />
                <button type="submit" className="btn-primary mt-2 w-full py-2.5">
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const links = useMemo(
    () => [
      { href: "/services", label: t("nav.services") },
      { href: "/coverage", label: t("nav.coverage") },
      { href: "/track", label: t("nav.track") },
      { href: "/support", label: t("nav.support") },
    ],
    [t]
  );

  function onTrack(e: FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) {
      router.push("/track");
      return;
    }
    setMobileOpen(false);
    router.push(`/track?id=${encodeURIComponent(trackingId.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-secondary/97 text-white backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/delivery-truck-logo.png"
              alt="Aurex Logistics Logo"
              width={36}
              height={36}
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              priority
            />
            <span className="font-display truncate text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
              Aurex Logistics
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "text-sm font-semibold text-white"
                      : "text-sm font-medium text-white/65 transition hover:text-white"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <form onSubmit={onTrack} className="relative">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder={t("nav.trackingPlaceholder")}
                className="w-32 rounded-md border border-white/15 bg-white/10 py-2 pl-8 pr-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent lg:w-40"
              />
              <svg
                className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/45"
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
              {t("nav.trackBtn")}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
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
              <Link
                href="/estimate"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {t("nav.estimate")}
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {t("nav.about")}
              </Link>
              <form onSubmit={onTrack} className="mt-2 space-y-2 px-3">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder={t("nav.trackingPlaceholder")}
                  className="w-full rounded-md border border-white/15 bg-white/10 px-3 py-2.5 text-base text-white placeholder:text-white/45 outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-accent py-2.5 font-semibold text-white"
                >
                  {t("nav.trackBtn")}
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

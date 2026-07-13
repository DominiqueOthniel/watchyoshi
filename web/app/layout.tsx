import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CargoWatch",
  description: "Professional shipment tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        <header className="border-b border-emerald-900/10 bg-white/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-emerald-950">
              Cargo<span className="text-emerald-600">Watch</span>
            </Link>
            <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-emerald-950/80">
              <Link href="/track" className="hover:text-emerald-700">
                Tracking
              </Link>
              <Link href="/create" className="hover:text-emerald-700">
                Créer un envoi
              </Link>
              <Link href="/support" className="hover:text-emerald-700">
                Support
              </Link>
              <Link
                href="/admin"
                className="rounded-full bg-emerald-900 px-3 py-1.5 text-white hover:bg-emerald-800"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-emerald-900/10 py-8 text-center text-sm text-emerald-950/60">
          CargoWatch — suivi d&apos;envois professionnel
        </footer>
      </body>
    </html>
  );
}

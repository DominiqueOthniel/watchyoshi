import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CargoWatch - Your cargo. Our watch. Every mile.",
  description: "Real-time shipment tracking and logistics visibility",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/delivery-truck-logo.png"
                alt="CargoWatch"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
              <span className="text-xl font-bold text-primary">CargoWatch</span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm md:flex">
              <Link href="/" className="font-semibold text-primary">
                Home
              </Link>
              <Link href="/track" className="text-text-secondary transition-colors hover:text-primary">
                Track Shipment
              </Link>
              <Link href="/create" className="text-text-secondary transition-colors hover:text-primary">
                Create Shipment
              </Link>
              <Link href="/support" className="text-text-secondary transition-colors hover:text-primary">
                Support
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/admin/login" className="btn-secondary px-4 py-2 text-sm">
                Admin
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-20 border-t border-border bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Image
                src="/delivery-truck-logo.png"
                alt="CargoWatch"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="font-semibold text-primary">CargoWatch</span>
            </div>
            <p className="text-sm text-text-secondary">Your cargo. Our watch. Every mile.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

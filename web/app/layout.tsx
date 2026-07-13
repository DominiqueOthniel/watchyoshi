import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "CargoWatch - Your cargo. Our watch. Every mile.",
  description:
    "Transform your logistics with real-time tracking, complete visibility, and enterprise-grade security.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background antialiased">
        <SiteHeader />
        <main>{children}</main>
        <footer className="mt-0 border-t border-border bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/delivery-truck-logo.png"
                alt="CargoWatch"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="font-bold text-primary">CargoWatch</span>
            </Link>
            <p className="text-sm text-text-secondary">Your cargo. Our watch. Every mile.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

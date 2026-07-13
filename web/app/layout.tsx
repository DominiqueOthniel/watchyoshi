import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ChatBubbleWidget from "@/components/ChatBubbleWidget";
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
        <main className="min-w-0 overflow-x-hidden">{children}</main>
        <footer className="mt-0 border-t border-border bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
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
            <p className="text-center text-sm text-text-secondary sm:text-left">
              Your cargo. Our watch. Every mile.
            </p>
          </div>
        </footer>
        <ChatBubbleWidget />
      </body>
    </html>
  );
}

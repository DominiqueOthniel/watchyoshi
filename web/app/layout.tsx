import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatBubbleWidget from "@/components/ChatBubbleWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "CargoWatch | Live freight tracking & logistics",
  description:
    "Track road, air, sea, and vehicle shipments in real time. Clear timelines, live maps, and support built for modern logistics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background antialiased">
        <SiteHeader />
        <main className="min-w-0 overflow-x-hidden">{children}</main>
        <SiteFooter />
        <ChatBubbleWidget />
      </body>
    </html>
  );
}

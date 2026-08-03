import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatBubbleWidget from "@/components/ChatBubbleWidget";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "CargoWatch | Live freight tracking & logistics",
  description:
    "Track road, air, sea, and vehicle shipments in real time. Clear timelines, live maps, and support built for modern logistics.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background antialiased">
        <I18nProvider>
          <SiteHeader />
          <main className="min-w-0 overflow-x-hidden">{children}</main>
          <SiteFooter />
          <ChatBubbleWidget />
        </I18nProvider>
      </body>
    </html>
  );
}

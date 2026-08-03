"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const EVENTS = [
  { id: "CW8F2A", route: "Los Angeles → Dallas", status: "In transit" },
  { id: "CW3K91", route: "Miami → New York", status: "Picked up" },
  { id: "CW7B44", route: "Chicago → Denver", status: "Out for delivery" },
  { id: "CW1Q28", route: "Seattle → Phoenix", status: "In transit" },
  { id: "CW9M55", route: "Houston → Atlanta", status: "Delivered" },
  { id: "CW2T70", route: "Boston → Charlotte", status: "In transit" },
];

export default function LiveActivityTicker() {
  const [index, setIndex] = useState(0);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % EVENTS.length);
        setPulse(true);
      }, 160);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const item = EVENTS[index];

  return (
    <div className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <p
            className="truncate text-sm text-text-secondary transition-opacity duration-200"
            style={{ opacity: pulse ? 1 : 0.35 }}
          >
            <span className="font-semibold text-text-primary">{item.id}</span>
            <span className="mx-2 text-text-muted">·</span>
            {item.route}
            <span className="mx-2 text-text-muted">·</span>
            <span className="font-medium text-primary">{item.status}</span>
          </p>
        </div>
        <Link href="/track" className="shrink-0 text-sm font-semibold text-accent hover:underline">
          Watch live map →
        </Link>
      </div>
    </div>
  );
}

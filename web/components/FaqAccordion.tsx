"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What services does CargoWatch offer?",
    a: "CargoWatch covers road, air, and sea freight with live GPS tracking, vehicle transport, insured shipping, PDF receipts, and 24/7 support chat.",
  },
  {
    q: "How do I track my shipment?",
    a: "Enter your tracking ID on the Track page. You get live map movement, status timeline, and automatic progress updates from pickup to delivery.",
  },
  {
    q: "Do you ship vehicles between US states?",
    a: "Yes. Open carrier and enclosed options are available for cars and light trucks, with route-level tracking across interstate corridors.",
  },
  {
    q: "What if my delivery is delayed?",
    a: "Check the live timeline first. If the status shows an exception or stall, contact support from the chat widget with your tracking ID.",
  },
  {
    q: "Is my cargo insured?",
    a: "Optional insurance can be added per shipment. Declared value and coverage details appear on the receipt once the shipment is created.",
  },
  {
    q: "Can businesses manage multiple shipments?",
    a: "Admins can create shipments, advance lifecycle steps, pause auto-progress, generate receipts, and handle live support from one dashboard.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const active = open === i;
        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-xl border transition ${
              active ? "border-primary/30 bg-panel shadow-soft" : "border-border bg-panel/80"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(active ? null : i)}
              aria-expanded={active}
            >
              <span className="font-display text-base font-semibold text-text-primary sm:text-lg">
                {item.q}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition ${
                  active ? "bg-primary text-white" : "bg-surface text-text-secondary"
                }`}
              >
                {active ? "−" : "+"}
              </span>
            </button>
            {active && (
              <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function FaqAccordion() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

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

"use client";

import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import EstimateCalculator from "@/components/EstimateCalculator";
import { useI18n } from "@/lib/i18n/context";

export default function HomePage() {
  const { t } = useI18n();

  const services = [
    {
      title: t("home.road"),
      text: t("home.roadText"),
      img: "/images/brand-highway-night.png",
      href: "/services#road",
    },
    {
      title: t("home.air"),
      text: t("home.airText"),
      img: "/images/brand-air-cargo.png",
      href: "/services#air",
    },
    {
      title: t("home.sea"),
      text: t("home.seaText"),
      img: "/images/brand-port.png",
      href: "/services#sea",
    },
    {
      title: t("home.vehicle"),
      text: t("home.vehicleText"),
      img: "/images/brand-vehicle-carrier.png",
      href: "/services#vehicle",
    },
  ];

  const process = [
    { step: "01", title: t("home.step1"), text: t("home.step1Text") },
    { step: "02", title: t("home.step2"), text: t("home.step2Text") },
    { step: "03", title: t("home.step3"), text: t("home.step3Text") },
    { step: "04", title: t("home.step4"), text: t("home.step4Text") },
  ];

  const facts = [
    { title: t("home.fact1Title"), text: t("home.fact1Text") },
    { title: t("home.fact2Title"), text: t("home.fact2Text") },
    { title: t("home.fact3Title"), text: t("home.fact3Text") },
  ];

  return (
    <div>
      <section className="relative min-h-[82vh] overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/brand-highway-night.png"
            alt="Freight truck on night highway"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/88 to-secondary/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/92 via-transparent to-secondary/35" />
        </div>

        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <p className="reveal-up font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            CargoWatch
          </p>
          <h1 className="reveal-up-delay mt-5 max-w-2xl font-display text-2xl font-semibold leading-snug text-white/95 sm:text-3xl lg:text-[2.15rem]">
            {t("home.heroTitle")}
          </h1>
          <p className="reveal-up-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {t("home.heroSub")}
          </p>
          <div className="reveal-up-delay-2 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary">
              {t("home.ctaTrack")}
            </Link>
            <Link href="/estimate" className="btn-on-dark">
              {t("home.ctaEstimate")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-panel">
        <div className="mx-auto grid max-w-7xl divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { href: "/estimate", label: t("home.cardEstimate"), hint: t("home.cardEstimateHint") },
            { href: "/coverage", label: t("home.cardCoverage"), hint: t("home.cardCoverageHint") },
            { href: "/services", label: t("home.cardServices"), hint: t("home.cardServicesHint") },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group px-4 py-6 transition hover:bg-surface/50 sm:px-6 lg:px-8"
            >
              <p className="font-display text-lg font-bold text-text-primary group-hover:text-primary">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{item.hint}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="services" className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.servicesTitle")}
              </h2>
              <p className="mt-3 text-base text-text-secondary sm:text-lg">{t("home.servicesSub")}</p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.href} delayMs={i * 60}>
                <Link href={s.href} className="group grid gap-4 sm:grid-cols-[1fr_1.15fr] sm:items-center">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="sm:py-2">
                    <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-primary">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.text}</p>
                    <p className="mt-3 text-sm font-semibold text-primary">{t("home.explore")}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="estimate" className="bg-panel py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.ratesTitle")}
              </h2>
              <p className="mt-3 text-text-secondary">{t("home.ratesSub")}</p>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <EstimateCalculator />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-secondary py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.title} className="border-l-2 border-accent pl-4">
                <p className="font-display text-lg font-bold">{fact.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="bg-panel py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.processTitle")}
              </h2>
              <p className="mt-3 text-base text-text-secondary sm:text-lg">{t("home.processSub")}</p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delayMs={i * 70}>
                <div className="border-t border-primary pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.step}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-text-primary">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[400px]">
              <Image
                src="/images/brand-vehicle-carrier.png"
                alt="Vehicle carrier transporting cars"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <div>
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.whyTitle")}
              </h2>
              <ul className="mt-7 space-y-4">
                {[t("home.why1"), t("home.why2"), t("home.why3"), t("home.why4")].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/track" className="btn-primary inline-flex">
                  {t("home.tryLive")}
                </Link>
                <Link href="/estimate" className="btn-ghost inline-flex">
                  {t("home.estimateMove")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="bg-panel py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.faqTitle")}
              </h2>
              <p className="mt-3 text-text-secondary">{t("home.faqSub")}</p>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <FaqAccordion />
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("home.finalTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">{t("home.finalSub")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary">
              {t("home.ctaTrack")}
            </Link>
            <Link href="/estimate" className="btn-on-dark">
              {t("home.ctaEstimate")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

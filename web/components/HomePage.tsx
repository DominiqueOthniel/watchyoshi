"use client";

import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import LiveActivityTicker from "@/components/LiveActivityTicker";
import StickyTrackCue from "@/components/StickyTrackCue";
import Reveal from "@/components/Reveal";
import EstimateCalculator from "@/components/EstimateCalculator";
import AgencyLogos from "@/components/AgencyLogos";
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

  const stats = [
    { value: "24k+", label: t("home.statActive") },
    { value: "47", label: t("home.statCountries") },
    { value: "99.2%", label: t("home.statOntime") },
    { value: "24/7", label: t("home.statSupport") },
  ];

  const testimonials = [
    {
      name: t("home.rev1Name"),
      city: t("home.rev1City"),
      quote: t("home.rev1Quote"),
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: t("home.rev2Name"),
      city: t("home.rev2City"),
      quote: t("home.rev2Quote"),
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: t("home.rev3Name"),
      city: t("home.rev3City"),
      quote: t("home.rev3Quote"),
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/brand-highway-night.png"
            alt="Freight truck on night highway"
            fill
            priority
            className="hero-kenburns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-secondary/30" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <p className="reveal-up font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
            CargoWatch
          </p>
          <h1 className="reveal-up-delay mt-4 max-w-2xl font-display text-2xl font-bold leading-tight text-white/95 sm:text-3xl lg:text-4xl">
            {t("home.heroTitle")}
          </h1>
          <p className="reveal-up-delay-2 mt-4 max-w-xl text-base text-white/75 sm:text-lg">
            {t("home.heroSub")}
          </p>
          <div className="reveal-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary">
              {t("home.ctaTrack")}
            </Link>
            <Link href="/estimate" className="btn-on-dark">
              {t("home.ctaEstimate")}
            </Link>
          </div>
        </div>
      </section>

      <LiveActivityTicker />
      <AgencyLogos />

      <section className="border-b border-border bg-panel">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { href: "/estimate", label: t("home.cardEstimate"), hint: t("home.cardEstimateHint") },
            { href: "/coverage", label: t("home.cardCoverage"), hint: t("home.cardCoverageHint") },
            { href: "/services", label: t("home.cardServices"), hint: t("home.cardServicesHint") },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-border bg-surface/60 px-5 py-4 transition hover:border-primary/30 hover:bg-panel hover:shadow-soft"
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("home.servicesEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.servicesTitle")}
              </h2>
              <p className="mt-3 text-base text-text-secondary sm:text-lg">{t("home.servicesSub")}</p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.href} delayMs={i * 70}>
                <Link href={s.href} className="group block overflow-hidden rounded-2xl bg-panel shadow-soft">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-primary">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.text}</p>
                    <p className="mt-3 text-xs font-semibold text-accent">{t("home.explore")}</p>
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("home.ratesEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
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

      <section className="relative overflow-hidden bg-secondary py-20 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/brand-warehouse.png"
            alt="Large scale warehouse logistics facility"
            fill
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/55" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("home.networkEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{t("home.networkTitle")}</h2>
              <p className="mt-4 text-base text-white/75 sm:text-lg">{t("home.networkSub")}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/coverage" className="btn-primary inline-flex">
                  {t("home.seeCoverage")}
                </Link>
                <Link href="/about" className="btn-on-dark inline-flex">
                  {t("home.ourApproach")}
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-5 backdrop-blur-sm"
              >
                <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/60 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="bg-panel py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("home.processEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.processTitle")}
              </h2>
              <p className="mt-3 text-base text-text-secondary sm:text-lg">{t("home.processSub")}</p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delayMs={i * 80}>
                <div className="relative border-t-2 border-primary pt-5">
                  <p className="font-display text-sm font-bold text-primary">{p.step}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-text-primary">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("home.opsEyebrow")}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                  {t("home.opsTitle")}
                </h2>
              </div>
            </Reveal>
            <p className="max-w-md text-sm text-text-secondary sm:text-base">{t("home.opsSub")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: "/images/brand-port.png", alt: t("home.port"), label: t("home.port"), tall: true },
              { src: "/images/brand-warehouse.png", alt: t("home.warehouse"), label: t("home.warehouse") },
              { src: "/images/brand-highway-night.png", alt: t("home.highway"), label: t("home.highway") },
              { src: "/images/brand-air-cargo.png", alt: t("home.airHubs"), label: t("home.airHubs") },
            ].map((g, i) => (
              <Reveal key={g.label} delayMs={i * 60} className={g.tall ? "sm:col-span-2 sm:row-span-2" : ""}>
                <figure
                  className={`relative overflow-hidden rounded-2xl ${
                    g.tall ? "min-h-[280px] sm:min-h-[420px]" : "min-h-[200px]"
                  }`}
                >
                  <Image src={g.src} alt={g.alt} fill className="object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 text-sm font-semibold text-white">
                    {g.label}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-panel py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative min-h-[320px] overflow-hidden rounded-3xl sm:min-h-[420px]">
              <Image
                src="/images/brand-vehicle-carrier.png"
                alt="Vehicle carrier transporting cars"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("home.whyEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.whyTitle")}
              </h2>
              <ul className="mt-6 space-y-4">
                {[t("home.why1"), t("home.why2"), t("home.why3"), t("home.why4")].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-text-secondary">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                      ✓
                    </span>
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

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("home.clientsEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.clientsTitle")}
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={item.name} delayMs={i * 80}>
                <blockquote className="rounded-2xl bg-panel p-6 shadow-soft">
                  <p className="text-sm leading-relaxed text-text-secondary">“{item.quote}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-text-primary">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.city}</p>
                    </div>
                  </div>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-panel py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("home.faqEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t("home.faqTitle")}
              </h2>
              <p className="mt-3 text-text-secondary">{t("home.faqSub")}</p>
              <div className="relative mt-8 hidden min-h-[240px] overflow-hidden rounded-2xl lg:block">
                <Image
                  src="/images/brand-air-cargo.png"
                  alt="Support and operations"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <FaqAccordion />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 text-white">
        <div className="absolute inset-0">
          <Image src="/images/brand-port.png" alt="Cargo port at golden hour" fill className="object-cover" />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">CargoWatch</p>
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{t("home.finalTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">{t("home.finalSub")}</p>
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

      <StickyTrackCue />
    </div>
  );
}

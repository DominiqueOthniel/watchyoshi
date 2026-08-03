import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import LiveActivityTicker from "@/components/LiveActivityTicker";
import StickyTrackCue from "@/components/StickyTrackCue";
import Reveal from "@/components/Reveal";

const services = [
  {
    title: "Road freight",
    text: "Interstate trucking with live corridor updates and ETA recalculation as the load moves.",
    img: "/images/brand-highway-night.png",
    href: "/services#road",
  },
  {
    title: "Air cargo",
    text: "Priority air lanes for time-critical parcels, parts, and documents across hubs.",
    img: "/images/brand-air-cargo.png",
    href: "/services#air",
  },
  {
    title: "Ocean freight",
    text: "Container moves with milestone events from port departure through final mile.",
    img: "/images/brand-port.png",
    href: "/services#sea",
  },
  {
    title: "Vehicle transport",
    text: "Car and light truck moves between US states with open or enclosed carrier options.",
    img: "/images/brand-vehicle-carrier.png",
    href: "/services#vehicle",
  },
];

const process = [
  {
    step: "01",
    title: "Book & label",
    text: "Create the shipment, confirm pickup details, and generate a tracking ID for everyone involved.",
  },
  {
    step: "02",
    title: "Pickup",
    text: "Courier collects the load. Status flips to picked up and the live map clock starts.",
  },
  {
    step: "03",
    title: "Track live",
    text: "Watch the route progress on the map with automatic lifecycle updates along the way.",
  },
  {
    step: "04",
    title: "Deliver",
    text: "Out for delivery then signed off. Receipt PDF and timeline stay available anytime.",
  },
];

const stats = [
  { value: "24k+", label: "Active shipments" },
  { value: "47", label: "Countries covered" },
  { value: "99.2%", label: "On-time handoffs" },
  { value: "24/7", label: "Live support" },
];

const testimonials = [
  {
    name: "Marcus R.",
    city: "Dallas",
    quote:
      "Tracked my car from California the whole way. Clear map, no guessing, and support answered in minutes.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Elena V.",
    city: "Miami",
    quote:
      "We moved parts weekly between Florida and New York. CargoWatch made status updates effortless for our clients.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Jordan K.",
    city: "Chicago",
    quote:
      "The admin lifecycle and PDF receipts saved our ops team hours every week. Clean and professional.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
];

export default function HomePage() {
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
            Freight that stays visible from pickup to doorstep.
          </h1>
          <p className="reveal-up-delay-2 mt-4 max-w-xl text-base text-white/75 sm:text-lg">
            Live maps, clear timelines, and support for road, air, sea, and vehicle moves.
          </p>
          <div className="reveal-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary">
              Track a shipment
            </Link>
            <Link href="/estimate" className="btn-on-dark">
              Get an estimate
            </Link>
          </div>
        </div>
      </section>

      <LiveActivityTicker />

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { href: "/estimate", label: "Estimate", hint: "Ballpark in seconds" },
            { href: "/coverage", label: "Coverage", hint: "Corridors & hubs" },
            { href: "/services", label: "Services", hint: "Road to vehicles" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-border bg-surface/60 px-5 py-4 transition hover:border-primary/30 hover:bg-white hover:shadow-soft"
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Services</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                Logistics built for every mode
              </h2>
              <p className="mt-3 text-base text-text-secondary sm:text-lg">
                From interstate trucking to vehicle hauls, CargoWatch keeps every mile accountable.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delayMs={i * 70}>
                <Link href={s.href} className="group block overflow-hidden rounded-2xl bg-white shadow-soft">
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
                    <p className="mt-3 text-xs font-semibold text-accent">Explore →</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Network</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Large-scale storage and distribution coverage
              </h2>
              <p className="mt-4 text-base text-white/75 sm:text-lg">
                Hub capacity, last-mile partners, and live visibility that connects origins and
                destinations without black holes in the journey.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/coverage" className="btn-primary inline-flex">
                  See coverage map
                </Link>
                <Link href="/about" className="btn-on-dark inline-flex">
                  Our approach
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

      <section id="process" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Process</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                How a CargoWatch move works
              </h2>
              <p className="mt-3 text-base text-text-secondary sm:text-lg">
                Four clear stages. Progress you can feel without guessing.
              </p>
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Operations</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                  Inside the move
                </h2>
              </div>
            </Reveal>
            <p className="max-w-md text-sm text-text-secondary sm:text-base">
              Ports, warehouses, highways, and air hubs. Real infrastructure behind every tracking ID.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                src: "/images/brand-port.png",
                alt: "Freight containers at a logistics port",
                label: "Port operations",
                tall: true,
              },
              {
                src: "/images/brand-warehouse.png",
                alt: "Warehouse aisle with stacked pallets",
                label: "Warehouse network",
              },
              {
                src: "/images/brand-highway-night.png",
                alt: "Delivery truck on highway at night",
                label: "Highway corridors",
              },
              {
                src: "/images/brand-air-cargo.png",
                alt: "Cargo plane loading at airport",
                label: "Air freight hubs",
              },
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

      <section className="bg-white py-16 sm:py-20 lg:py-24">
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Why CargoWatch</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                Visibility your customers can trust
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Live map animation along real road routes",
                  "Professional lifecycle from pending to delivered",
                  "PDF receipts and insured shipping options",
                  "Support chat tied to your tracking ID",
                ].map((item) => (
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
                  Try live tracking
                </Link>
                <Link href="/estimate" className="btn-ghost inline-flex">
                  Estimate a move
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Clients</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                What shippers say
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delayMs={i * 80}>
                <blockquote className="rounded-2xl bg-white p-6 shadow-soft">
                  <p className="text-sm leading-relaxed text-text-secondary">“{t.quote}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Image
                      src={t.img}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-text-primary">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.city}</p>
                    </div>
                  </div>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">FAQ</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                Questions, answered
              </h2>
              <p className="mt-3 text-text-secondary">
                Need something else? Open support chat or send a message from the Support page.
              </p>
              <div className="relative mt-8 hidden min-h-[240px] overflow-hidden rounded-2xl lg:block">
                <Image
                  src="/images/brand-air-cargo.png"
                  alt="Support and operations team context"
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
          <Image
            src="/images/brand-port.png"
            alt="Cargo port at golden hour"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">CargoWatch</p>
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
            Ship with confidence. Track without friction.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Start with a tracking ID or an estimate. Stay for the clarity.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary">
              Track shipment
            </Link>
            <Link href="/estimate" className="btn-on-dark">
              Get estimate
            </Link>
          </div>
        </div>
      </section>

      <StickyTrackCue />
    </div>
  );
}

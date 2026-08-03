import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";

const services = [
  {
    title: "Road freight",
    text: "Interstate trucking with live corridor updates and ETA recalculation as the load moves.",
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Air cargo",
    text: "Priority air lanes for time-critical parcels, parts, and documents across hubs.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Ocean freight",
    text: "Container moves with milestone events from port departure through final mile.",
    img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Vehicle transport",
    text: "Car and light truck moves between US states with open or enclosed carrier options.",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
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

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
    alt: "Freight containers at a logistics port",
    label: "Port operations",
  },
  {
    src: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1000&q=80",
    alt: "Warehouse aisle with stacked pallets",
    label: "Warehouse network",
  },
  {
    src: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80",
    alt: "Delivery truck on highway at dusk",
    label: "Highway corridors",
  },
  {
    src: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1000&q=80",
    alt: "Cargo plane loading at airport",
    label: "Air freight hubs",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero: brand first, full-bleed image, one CTA group */}
      <section className="relative min-h-[88vh] overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80"
            alt="Modern logistics warehouse with cargo operations"
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
            <Link href="/#services" className="btn-on-dark">
              Explore services
            </Link>
          </div>
        </div>
      </section>

      {/* Quick track strip */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="font-display text-lg font-bold text-text-primary">Already have a tracking ID?</p>
            <p className="text-sm text-text-secondary">Open live status, map, and delivery timeline in seconds.</p>
          </div>
          <Link href="/track" className="btn-ghost">
            Open tracker
          </Link>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Services</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
              Logistics built for every mode
            </h2>
            <p className="mt-3 text-base text-text-secondary sm:text-lg">
              From interstate trucking to vehicle hauls, CargoWatch keeps every mile accountable.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <article key={s.title} className="group overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Scale / warehouse band */}
      <section className="relative overflow-hidden bg-secondary py-20 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2000&q=80"
            alt="Large scale warehouse logistics facility"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/55" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Network</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Large-scale storage and distribution coverage
            </h2>
            <p className="mt-4 text-base text-white/75 sm:text-lg">
              Hub capacity, last-mile partners, and live visibility that connects origins and
              destinations without black holes in the journey.
            </p>
            <Link href="/support" className="btn-primary mt-8 inline-flex">
              Talk to operations
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/15 bg-white/5 px-4 py-5 backdrop-blur-sm">
                <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/60 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Process</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
              How a CargoWatch move works
            </h2>
            <p className="mt-3 text-base text-text-secondary sm:text-lg">
              Four clear stages. No mystery status codes. No silent gaps.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="relative border-t-2 border-primary pt-5">
                <p className="font-display text-sm font-bold text-primary">{p.step}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-text-primary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual gallery */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Operations</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                Inside the move
              </h2>
            </div>
            <p className="max-w-md text-sm text-text-secondary sm:text-base">
              Ports, warehouses, highways, and air hubs. Real infrastructure behind every tracking ID.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((g, i) => (
              <figure
                key={g.label}
                className={`relative overflow-hidden rounded-2xl ${i === 0 ? "sm:col-span-2 sm:row-span-2 min-h-[280px] sm:min-h-[420px]" : "min-h-[200px]"}`}
              >
                <Image src={g.src} alt={g.alt} fill className="object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 text-sm font-semibold text-white">
                  {g.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Why / features with imagery */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl sm:min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1200&q=80"
              alt="Driver reviewing shipment documents near a truck"
              fill
              className="object-cover"
            />
          </div>
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
            <Link href="/track" className="btn-primary mt-8 inline-flex">
              Try live tracking
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Clients</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
              What shippers say
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="rounded-2xl bg-white p-6 shadow-soft">
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
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
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
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80"
                alt="Support team assisting customers"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1605745341112-859df0ddc948?auto=format&fit=crop&w=2000&q=80"
            alt="Cargo ship at sunset"
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
            Start with a tracking ID, or talk to support if you need help moving freight today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary">
              Track shipment
            </Link>
            <Link href="/support" className="btn-on-dark">
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

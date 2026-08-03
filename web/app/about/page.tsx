import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "About | CargoWatch",
  description: "CargoWatch builds calm, visible logistics for shippers who need clarity every mile.",
};

const timeline = [
  {
    year: "01",
    title: "See the gap",
    text: "Shippers were stuck between opaque carriers and noisy dashboards. We designed for clarity.",
  },
  {
    year: "02",
    title: "Build the loop",
    text: "Pending to delivered, with live map progress and status that updates itself.",
  },
  {
    year: "03",
    title: "Support the human",
    text: "Chat stays tied to tracking IDs so help arrives with context, not ticket ping-pong.",
  },
  {
    year: "04",
    title: "Keep refining",
    text: "Road routes, receipts, vehicle moves, and mobile map polish. Quiet improvements, constant.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About"
        title="Logistics should feel calm, not chaotic."
        subtitle="CargoWatch exists so every shipment has a readable story: where it is, what happens next, who can help."
        image="/images/brand-air-cargo.png"
        imageAlt="Air cargo operations at dusk"
        actions={
          <>
            <Link href="/services" className="btn-primary">
              Explore services
            </Link>
            <Link href="/support" className="btn-on-dark">
              Meet support
            </Link>
          </>
        }
      />

      <section className="bg-panel py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Promise</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-4xl">
                Visibility first. Noise never.
              </h2>
              <p className="mt-4 text-text-secondary">
                We apply simple HCI habits: show system status, give immediate feedback, reduce
                memory load, and reward attention with progress you can feel, not fireworks.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-text-secondary">
                {[
                  "Recognition over cryptic carrier codes",
                  "Consistent lifecycle language across admin and public track",
                  "Gentle motion that confirms the load is alive",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary">●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="relative min-h-[300px] overflow-hidden rounded-3xl sm:min-h-[380px]">
              <Image
                src="/images/brand-warehouse.png"
                alt="CargoWatch warehouse operations"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-text-primary">How we got here</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delayMs={i * 80}>
                <div className="border-t-2 border-primary bg-panel p-5 shadow-soft">
                  <p className="font-display text-sm font-bold text-primary">{t.year}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-text-primary">{t.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 text-white">
        <Image src="/images/brand-highway-night.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-display text-4xl font-extrabold">CargoWatch</p>
          <h2 className="mt-3 font-display text-2xl font-bold">Want to see it in motion?</h2>
          <p className="mt-3 text-white/75">Open the tracker or get an estimate. Stay for the clarity.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/track" className="btn-primary">
              Track live
            </Link>
            <Link href="/estimate" className="btn-on-dark">
              Get estimate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

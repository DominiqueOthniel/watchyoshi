import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import EstimateCalculator from "@/components/EstimateCalculator";

export const metadata = {
  title: "Estimate | CargoWatch",
  description: "Get a quick shipping estimate for road, air, sea, or vehicle transport.",
};

export default function EstimatePage() {
  return (
    <div>
      <PageHero
        eyebrow="Pricing preview"
        title="A calm estimate before you commit."
        subtitle="Slide, compare, and see a ballpark total. No spam forms. Just clear feedback."
        image="/images/brand-highway-night.png"
        imageAlt="Night highway freight truck"
        actions={
          <>
            <Link href="/support" className="btn-primary">
              Request firm quote
            </Link>
            <Link href="/services" className="btn-on-dark">
              Browse services
            </Link>
          </>
        }
      />

      <section className="bg-background py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <EstimateCalculator />
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Transparent ranges",
                text: "You see how mode, distance, and speed shift the total before booking.",
              },
              {
                title: "No dark patterns",
                text: "No fake urgency timers. Just useful numbers and a path to support.",
              },
              {
                title: "Then track live",
                text: "Once booked, the same clarity continues on the live map and timeline.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delayMs={i * 80}>
                <div className="rounded-2xl border border-border bg-panel p-6 shadow-soft">
                  <h3 className="font-display text-lg font-bold text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 text-white">
        <Image
          src="/images/brand-warehouse.png"
          alt="Warehouse operations"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-secondary/80" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold">Ready to move from estimate to tracking?</h2>
          <p className="mt-3 text-white/75">Support can lock a quote, then you follow every mile.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/support" className="btn-primary">
              Chat with support
            </Link>
            <Link href="/track" className="btn-on-dark">
              Open tracker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

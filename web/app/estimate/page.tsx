import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import EstimateCalculator from "@/components/EstimateCalculator";

export const metadata = {
  title: "Estimate | Aurex Logistics",
  description: "Get an indicative shipping estimate for road, air, sea, or vehicle transport.",
};

export default function EstimatePage() {
  return (
    <div>
      <PageHero
        eyebrow="Estimates"
        title="Indicative pricing before you book."
        subtitle="Set mode, weight, and distance to review a ballpark total. Support confirms firm quotes."
        image="/images/brand-highway-night.webp"
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

          <div className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-3">
            {[
              {
                title: "Transparent ranges",
                text: "See how mode, distance, and speed change the indicative total before booking.",
              },
              {
                title: "Clear next steps",
                text: "Use the estimate to plan, then request a firm quote from support when ready.",
              },
              {
                title: "Same clarity after booking",
                text: "Once shipped, follow progress on the live map and structured timeline.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delayMs={i * 60}>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold">From estimate to live tracking</h2>
          <p className="mt-3 text-white/70">
            Support can confirm pricing, then you follow the shipment with the same operational clarity.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/support" className="btn-primary">
              Contact support
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

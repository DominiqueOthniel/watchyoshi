import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Coverage | CargoWatch",
  description: "CargoWatch corridors across US regions and international freight partners.",
};

const corridors = [
  {
    region: "West Coast",
    hubs: ["Los Angeles", "Seattle", "San Francisco", "Phoenix"],
    focus: "Vehicle & road freight",
    img: "/images/brand-highway-night.png",
  },
  {
    region: "Central",
    hubs: ["Dallas", "Chicago", "Denver", "Houston"],
    focus: "Cross-country trucking",
    img: "/images/brand-warehouse.png",
  },
  {
    region: "East Coast",
    hubs: ["New York", "Miami", "Atlanta", "Boston"],
    focus: "Air + last mile",
    img: "/images/brand-air-cargo.png",
  },
  {
    region: "Ports & ocean",
    hubs: ["Long Beach", "Houston Port", "Savannah", "Newark"],
    focus: "Container milestones",
    img: "/images/brand-port.png",
  },
];

export default function CoveragePage() {
  return (
    <div>
      <PageHero
        eyebrow="Network"
        title="Corridors that stay visible."
        subtitle="Major US hubs, interstate lanes, and partner ports. Coverage you can follow on the map."
        image="/images/brand-warehouse.png"
        imageAlt="Distribution warehouse network"
        actions={
          <>
            <Link href="/track" className="btn-primary">
              Track across the network
            </Link>
            <Link href="/estimate" className="btn-on-dark">
              Estimate a corridor
            </Link>
          </>
        }
      />

      <section className="bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold text-text-primary">Where CargoWatch runs strong</h2>
              <p className="mt-3 text-text-secondary">
                Each region card is a recognition cue: hubs you know, focus you can scan in seconds.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {corridors.map((c, i) => (
              <Reveal key={c.region} delayMs={i * 70}>
                <article className="group overflow-hidden rounded-3xl bg-panel shadow-soft">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={c.img}
                      alt={c.region}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <p className="absolute bottom-4 left-4 font-display text-2xl font-bold text-white">
                      {c.region}
                    </p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-sm font-semibold text-accent">{c.focus}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.hubs.map((h) => (
                        <span
                          key={h}
                          className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">Status you can trust while it moves</h2>
              <p className="mt-3 text-white/70">
                Pending → picked up → in transit → out for delivery → delivered. Same language
                everywhere, so you never relearn codes.
              </p>
              <Link href="/track" className="btn-primary mt-7 inline-flex">
                Open live tracking
              </Link>
            </div>
            <div className="relative min-h-[260px] overflow-hidden rounded-3xl">
              <Image
                src="/images/brand-vehicle-carrier.png"
                alt="Vehicle carrier on interstate"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

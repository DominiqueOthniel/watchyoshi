import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Coverage | CargoWatch",
  description: "CargoWatch corridors across Americas, Europe, Asia-Pacific, Middle East, Africa, and global ocean lanes.",
};

const corridors = [
  {
    region: "Americas",
    hubs: ["Los Angeles", "New York", "São Paulo", "Mexico City"],
    focus: "Road, air, and vehicle freight",
    img: "/images/brand-highway-night.png",
  },
  {
    region: "Europe",
    hubs: ["Rotterdam", "Frankfurt", "Lyon", "Madrid"],
    focus: "Cross-border trucking and air",
    img: "/images/brand-warehouse.png",
  },
  {
    region: "Asia-Pacific",
    hubs: ["Singapore", "Shanghai", "Tokyo", "Sydney"],
    focus: "Air hubs and regional road",
    img: "/images/brand-air-cargo.png",
  },
  {
    region: "Ocean & MEA",
    hubs: ["Dubai", "Lagos", "Cape Town", "Long Beach"],
    focus: "Ports and container milestones",
    img: "/images/brand-port.png",
  },
];

export default function CoveragePage() {
  return (
    <div>
      <PageHero
        eyebrow="Network"
        title="Worldwide corridors that stay visible."
        subtitle="Global hubs, cross-border lanes, and partner ports. Coverage you can follow on the map, wherever the load travels."
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
              <h2 className="font-display text-3xl font-bold text-text-primary">
                Where CargoWatch operates
              </h2>
              <p className="mt-3 text-text-secondary">
                Domestic and international lanes across major regions, with the same tracking
                language from origin to destination.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {corridors.map((c, i) => (
              <Reveal key={c.region} delayMs={i * 70}>
                <article className="group overflow-hidden border border-border bg-panel">
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
                          className="border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
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
              <h2 className="font-display text-3xl font-bold">One status language worldwide</h2>
              <p className="mt-3 text-white/70">
                Pending to picked up to in transit to out for delivery to delivered. Same lifecycle
                everywhere, so teams never relearn codes by region.
              </p>
              <Link href="/track" className="btn-primary mt-7 inline-flex">
                Open live tracking
              </Link>
            </div>
            <div className="relative min-h-[260px] overflow-hidden">
              <Image
                src="/images/brand-vehicle-carrier.png"
                alt="Vehicle carrier on freight corridor"
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

import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Services | CargoWatch",
  description: "Road, air, sea, and vehicle transport with live tracking and clear timelines.",
};

const services = [
  {
    slug: "road",
    title: "Road freight",
    lead: "Interstate trucking with corridor-level visibility.",
    points: ["Live map progress", "ETA updates", "Open or dedicated lanes"],
    img: "/images/brand-highway-night.png",
  },
  {
    slug: "air",
    title: "Air cargo",
    lead: "Priority lanes when hours matter more than dollars.",
    points: ["Hub-to-hub milestones", "Document & parts friendly", "Express windows"],
    img: "/images/brand-air-cargo.png",
  },
  {
    slug: "sea",
    title: "Ocean freight",
    lead: "Container moves with port events you can actually follow.",
    points: ["Departure & arrival marks", "Final-mile handoff", "Cost-efficient bulk"],
    img: "/images/brand-port.png",
  },
  {
    slug: "vehicle",
    title: "Vehicle transport",
    lead: "Car and light truck moves between US states.",
    points: ["Open or enclosed options", "VIN on the record", "Door-to-door tracking"],
    img: "/images/brand-vehicle-carrier.png",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Every mode. One tracking experience."
        subtitle="Pick the lane that fits the load. CargoWatch keeps the journey readable from start to finish."
        image="/images/brand-port.png"
        imageAlt="Port containers and cargo ship"
        actions={
          <>
            <Link href="/estimate" className="btn-primary">
              Get an estimate
            </Link>
            <Link href="/track" className="btn-on-dark">
              Track a shipment
            </Link>
          </>
        }
      />

      <section className="bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {services.map((s, i) => (
            <Reveal key={s.slug} delayMs={i * 60}>
              <article
                id={s.slug}
                className={`grid items-center gap-6 overflow-hidden rounded-3xl bg-panel shadow-soft lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative min-h-[240px] sm:min-h-[320px]">
                  <Image src={s.img} alt={s.title} fill className="object-cover" />
                </div>
                <div className="p-6 sm:p-8 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-text-primary">{s.title}</h2>
                  <p className="mt-3 text-text-secondary">{s.lead}</p>
                  <ul className="mt-5 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary">
                          ✓
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/estimate" className="btn-primary">
                      Estimate this mode
                    </Link>
                    <Link href="/support" className="btn-ghost">
                      Ask ops
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-panel py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-text-primary">Not sure which mode fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-text-secondary">
            Start with an estimate, or talk to support. Either path leads to a trackable shipment.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/estimate" className="btn-primary">
              Open estimator
            </Link>
            <Link href="/coverage" className="btn-ghost">
              See coverage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

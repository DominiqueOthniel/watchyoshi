import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Navigate",
    links: [
      { href: "/", label: "Home" },
      { href: "/track", label: "Track shipment" },
      { href: "/support", label: "Support" },
      { href: "/admin/login", label: "Admin" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/track", label: "Live GPS tracking" },
      { href: "/create", label: "Create shipment" },
      { href: "/support", label: "Live chat" },
      { href: "/track", label: "Vehicle transport" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/support", label: "Contact" },
      { href: "/support", label: "FAQ" },
      { href: "/", label: "Coverage" },
      { href: "/", label: "Partners" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-secondary text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=70"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/90 to-secondary/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <Image
                src="/delivery-truck-logo.png"
                alt="CargoWatch"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="font-display text-2xl font-bold tracking-tight">CargoWatch</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Professional shipment tracking for freight, parcels, and vehicle moves. Live maps,
              clear timelines, and support when you need it.
            </p>
            <a
              href="mailto:support@cargowatch.com"
              className="mt-5 inline-flex text-sm font-semibold text-accent hover:underline"
            >
              support@cargowatch.com
            </a>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} CargoWatch. Your cargo. Our watch. Every mile.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/50">
            <span>Road · Air · Sea · Vehicles</span>
            <span>Live tracking</span>
            <span>Insured options</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-100">
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
              Your cargo.
              <br />
              <span className="text-gradient-primary">Our watch.</span>
              <br />
              Every mile.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary lg:mx-0">
              Real-time tracking, complete visibility, and professional shipment monitoring for
              businesses of all sizes.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/track" className="btn-primary px-8 py-4 text-lg">
                Track Shipment
              </Link>
              <Link href="/support" className="btn-secondary px-8 py-4 text-lg">
                Contact Support
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="card overflow-hidden p-2">
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100">
                <Image
                  src="/delivery-truck-logo.png"
                  alt="CargoWatch logistics"
                  width={180}
                  height={180}
                  className="object-contain opacity-90"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-text-primary">Everything you need to track</h2>
          <p className="mt-3 text-text-secondary">Built for operators, trusted by customers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Live tracking",
              text: "Follow every shipment with map updates and a clear event timeline.",
            },
            {
              title: "Admin control",
              text: "Update statuses, pause auto-progress, and manage support chats.",
            },
            {
              title: "Realtime support",
              text: "Chat with customers instantly through Supabase Realtime.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <span className="text-lg font-bold">●</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Ready to track a shipment?</h2>
            <p className="mt-1 text-text-secondary">Enter your tracking ID and get live status.</p>
          </div>
          <Link href="/track" className="btn-primary px-6 py-3">
            Open tracking
          </Link>
        </div>
      </section>
    </div>
  );
}

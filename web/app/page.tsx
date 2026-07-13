import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero — same structure as pages/homepage.html */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="absolute inset-0 bg-white/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="mb-4 text-3xl font-bold text-text-primary sm:mb-6 sm:text-4xl lg:text-6xl">
                Your cargo.
                <br />
                <span className="text-gradient-primary">Our watch.</span>
                <br />
                Every mile.
              </h1>
              <p className="mx-auto mb-6 max-w-2xl text-base text-text-secondary sm:mb-8 sm:text-xl lg:mx-0">
                Transform your logistics with real-time tracking, complete visibility, and
                enterprise-grade security. CargoWatch makes professional shipment monitoring
                accessible to businesses of all sizes.
              </p>

              <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/track" className="btn-secondary px-8 py-4 text-lg">
                  Track Package
                </Link>
                <Link href="/create" className="btn-primary px-8 py-4 text-lg">
                  Create Shipment
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">24,847</div>
                  <div className="text-sm text-text-muted">Active Shipments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success">1,293</div>
                  <div className="text-sm text-text-muted">Delivered Today</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">47</div>
                  <div className="text-sm text-text-muted">Countries Served</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-white p-8 shadow-large">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">Live Tracking Demo</h3>
                  <span className="status-success">In Transit</span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      done: true,
                      title: "Package Picked Up",
                      meta: "New York, NY — Nov 1, 2025 8:30 AM",
                    },
                    {
                      done: true,
                      title: "In Transit",
                      meta: "Philadelphia, PA — Nov 1, 2025 2:15 PM",
                    },
                    {
                      current: true,
                      title: "Out for Delivery",
                      meta: "Washington, DC — Expected 4:30 PM",
                    },
                    { done: false, title: "Delivered", meta: "Pending" },
                  ].map((step) => (
                    <div key={step.title} className="flex items-center space-x-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          step.current
                            ? "animate-pulse-soft bg-accent"
                            : step.done
                              ? "bg-success"
                              : "bg-border"
                        }`}
                      />
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium ${
                            step.done || step.current ? "text-text-primary" : "text-text-muted"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-text-muted">{step.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-surface">
                  <Image
                    src="https://images.unsplash.com/photo-1610979602142-3906166288fb?auto=format&fit=crop&w=800&q=80"
                    alt="Map preview for live shipment tracking"
                    width={640}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-text-primary lg:text-4xl">
              Complete visibility, every step
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-text-secondary">
              From pickup to delivery, CargoWatch provides the transparency and control your
              business needs to exceed customer expectations.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Real-Time Tracking",
                text: "Live GPS tracking with minute-by-minute updates. Know exactly where your shipment is at every moment of its journey.",
                iconBg: "bg-primary-100",
                iconColor: "text-primary",
                img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
                path: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
              },
              {
                title: "Smart Notifications",
                text: "Automated alerts via SMS, email, and push notifications. Keep customers informed without lifting a finger.",
                iconBg: "bg-accent-100",
                iconColor: "text-accent",
                img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
                path: "M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h8V9H4v2z",
              },
              {
                title: "Enterprise Security",
                text: "Bank-level encryption and compliance certifications. Your data and shipments are protected at every level.",
                iconBg: "bg-success-100",
                iconColor: "text-success",
                img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
                path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
            ].map((f) => (
              <div key={f.title} className="card card-hover p-6 text-center">
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${f.iconBg}`}
                >
                  <svg className={`h-8 w-8 ${f.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.path} />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">{f.title}</h3>
                <p className="mb-6 text-text-secondary">{f.text}</p>
                <Image
                  src={f.img}
                  alt={f.title}
                  width={400}
                  height={192}
                  className="h-48 w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-text-primary">
              Trusted by businesses worldwide
            </h2>
            <p className="text-lg text-text-secondary">
              Join thousands of companies who rely on CargoWatch for their logistics needs
            </p>
          </div>
          <div className="mb-8 grid grid-cols-2 items-center gap-8 opacity-60 md:grid-cols-4">
            {["TechCorp", "GlobalShip", "FastDelivery", "LogiPro"].map((name) => (
              <div key={name} className="text-center text-2xl font-bold text-text-primary">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-primary">Ready to track a shipment?</h2>
          <p className="mb-8 text-lg text-text-secondary">
            Enter your tracking ID and get live status in seconds.
          </p>
          <Link href="/track" className="btn-primary px-8 py-4 text-lg">
            Track Package
          </Link>
        </div>
      </section>
    </div>
  );
}

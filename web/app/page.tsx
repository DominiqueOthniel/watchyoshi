import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            CargoWatch
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-emerald-950 sm:text-5xl">
            Suivez chaque envoi, en temps réel.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-emerald-950/70">
            Tracking public, création d&apos;expéditions et support live — propulsé par Supabase et
            Next.js.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/track"
              className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-600"
            >
              Suivre un colis
            </Link>
            <Link
              href="/create"
              className="rounded-full border border-emerald-900/20 bg-white/80 px-6 py-3 text-sm font-semibold text-emerald-950 hover:bg-white"
            >
              Créer un envoi
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3">
        {[
          {
            title: "Tracking public",
            text: "Entrez un ID de suivi et visualisez la position estimée sur la carte.",
          },
          {
            title: "Dashboard admin",
            text: "Gérez les statuts, mettez en pause la progression auto, suivez les stats.",
          },
          {
            title: "Support live",
            text: "Chat en temps réel via Supabase Realtime — sans Socket.io.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-emerald-900/10 bg-white/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-950">{item.title}</h2>
            <p className="mt-2 text-sm text-emerald-950/65">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

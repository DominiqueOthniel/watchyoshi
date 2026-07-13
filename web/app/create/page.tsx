"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

async function geocode(city: string, country: string) {
  const q = encodeURIComponent(`${city}, ${country}`);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`,
    { headers: { Accept: "application/json" } }
  );
  const data = await res.json();
  if (!data?.[0]) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

export default function CreateShipmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessId(null);

    const fd = new FormData(e.currentTarget);
    const senderCity = String(fd.get("senderCity") || "");
    const senderCountry = String(fd.get("senderCountry") || "");
    const recipientCity = String(fd.get("recipientCity") || "");
    const recipientCountry = String(fd.get("recipientCountry") || "");

    try {
      const [senderCoords, recipientCoords] = await Promise.all([
        geocode(senderCity, senderCountry),
        geocode(recipientCity, recipientCountry),
      ]);

      const payload = {
        sender: {
          name: String(fd.get("senderName") || ""),
          email: String(fd.get("senderEmail") || ""),
          phone: String(fd.get("senderPhone") || ""),
          address: {
            street: String(fd.get("senderStreet") || ""),
            city: senderCity,
            country: senderCountry,
            ...(senderCoords || {}),
          },
        },
        recipient: {
          name: String(fd.get("recipientName") || ""),
          email: String(fd.get("recipientEmail") || ""),
          phone: String(fd.get("recipientPhone") || ""),
          address: {
            street: String(fd.get("recipientStreet") || ""),
            city: recipientCity,
            country: recipientCountry,
            ...(recipientCoords || {}),
          },
        },
        package: {
          type: String(fd.get("packageType") || "parcel"),
          weight: Number(fd.get("packageWeight") || 1),
          description: String(fd.get("packageDescription") || ""),
          value: Number(fd.get("packageValue") || 0),
          currency: String(fd.get("currency") || "USD"),
        },
        service: {
          type: String(fd.get("serviceType") || "standard"),
          priority: String(fd.get("servicePriority") || "normal"),
          insurance: fd.get("insurance") === "on",
        },
        status: String(fd.get("status") || "in_transit"),
        estimatedDelivery: String(fd.get("estimatedDelivery") || "") || null,
      };

      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Création échouée");
      setSuccessId(data.shipment.trackingId);
      setTimeout(() => router.push(`/track?id=${data.shipment.trackingId}`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-emerald-900/15 bg-white px-3 py-2.5 outline-none ring-emerald-600 focus:ring-2";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-emerald-950">Créer un envoi</h1>
      <p className="mt-2 text-emerald-950/65">Les coordonnées sont géocodées automatiquement via Nominatim.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        <section className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6">
          <h2 className="mb-4 font-semibold">Expéditeur</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="senderName" placeholder="Nom" className={field} required />
            <input name="senderEmail" type="email" placeholder="Email" className={field} required />
            <input name="senderPhone" placeholder="Téléphone" className={field} />
            <input name="senderStreet" placeholder="Adresse" className={field} />
            <input name="senderCity" placeholder="Ville" className={field} required />
            <input name="senderCountry" placeholder="Pays" className={field} required />
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6">
          <h2 className="mb-4 font-semibold">Destinataire</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="recipientName" placeholder="Nom" className={field} required />
            <input name="recipientEmail" type="email" placeholder="Email" className={field} required />
            <input name="recipientPhone" placeholder="Téléphone" className={field} />
            <input name="recipientStreet" placeholder="Adresse" className={field} />
            <input name="recipientCity" placeholder="Ville" className={field} required />
            <input name="recipientCountry" placeholder="Pays" className={field} required />
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6">
          <h2 className="mb-4 font-semibold">Colis & service</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="packageType" className={field} defaultValue="parcel">
              <option value="parcel">Colis</option>
              <option value="document">Document</option>
              <option value="freight">Fret</option>
              <option value="vehicle">Véhicule</option>
            </select>
            <input name="packageWeight" type="number" step="0.1" placeholder="Poids (kg)" className={field} />
            <input name="packageValue" type="number" step="0.01" placeholder="Valeur" className={field} />
            <select name="currency" className={field} defaultValue="USD">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="XAF">XAF</option>
            </select>
            <input name="packageDescription" placeholder="Description" className={`${field} sm:col-span-2`} />
            <select name="serviceType" className={field} defaultValue="standard">
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="economy">Economy</option>
            </select>
            <select name="status" className={field} defaultValue="in_transit">
              <option value="pending">Pending</option>
              <option value="picked_up">Picked up</option>
              <option value="in_transit">In transit</option>
            </select>
            <input name="estimatedDelivery" type="datetime-local" className={field} />
            <label className="flex items-center gap-2 text-sm">
              <input name="insurance" type="checkbox" /> Assurance
            </label>
          </div>
        </section>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {successId && (
          <p className="text-sm text-emerald-700">
            Envoi créé : <strong>{successId}</strong> — redirection…
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Création…" : "Créer l'envoi"}
        </button>
      </form>
    </div>
  );
}

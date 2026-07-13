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
      if (!res.ok) throw new Error(data.error || "Creation failed");
      setSuccessId(data.shipment.trackingId);
      setTimeout(() => router.push(`/track?id=${data.shipment.trackingId}`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-bold text-text-primary lg:text-4xl">
            Create <span className="text-gradient-primary">Shipment</span>
          </h1>
          <p className="mt-3 text-text-secondary">
            Fill in sender, recipient, and package details. Coordinates are geocoded automatically.
          </p>
        </div>
      </section>

      <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <section className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Sender</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="senderName" placeholder="Name" className="input-field px-3 py-2.5" required />
            <input name="senderEmail" type="email" placeholder="Email" className="input-field px-3 py-2.5" required />
            <input name="senderPhone" placeholder="Phone" className="input-field px-3 py-2.5" />
            <input name="senderStreet" placeholder="Street" className="input-field px-3 py-2.5" />
            <input name="senderCity" placeholder="City" className="input-field px-3 py-2.5" required />
            <input name="senderCountry" placeholder="Country" className="input-field px-3 py-2.5" required />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Recipient</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="recipientName" placeholder="Name" className="input-field px-3 py-2.5" required />
            <input name="recipientEmail" type="email" placeholder="Email" className="input-field px-3 py-2.5" required />
            <input name="recipientPhone" placeholder="Phone" className="input-field px-3 py-2.5" />
            <input name="recipientStreet" placeholder="Street" className="input-field px-3 py-2.5" />
            <input name="recipientCity" placeholder="City" className="input-field px-3 py-2.5" required />
            <input name="recipientCountry" placeholder="Country" className="input-field px-3 py-2.5" required />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Package & service</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="packageType" className="input-field px-3 py-2.5" defaultValue="parcel">
              <option value="parcel">Parcel</option>
              <option value="document">Document</option>
              <option value="freight">Freight</option>
              <option value="vehicle">Vehicle</option>
            </select>
            <input name="packageWeight" type="number" step="0.1" placeholder="Weight (kg)" className="input-field px-3 py-2.5" />
            <input name="packageValue" type="number" step="0.01" placeholder="Value" className="input-field px-3 py-2.5" />
            <select name="currency" className="input-field px-3 py-2.5" defaultValue="USD">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="XAF">XAF</option>
            </select>
            <input name="packageDescription" placeholder="Description" className="input-field px-3 py-2.5 sm:col-span-2" />
            <select name="serviceType" className="input-field px-3 py-2.5" defaultValue="standard">
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="economy">Economy</option>
            </select>
            <select name="status" className="input-field px-3 py-2.5" defaultValue="in_transit">
              <option value="pending">Pending</option>
              <option value="picked_up">Picked up</option>
              <option value="in_transit">In transit</option>
            </select>
            <input name="estimatedDelivery" type="datetime-local" className="input-field px-3 py-2.5" />
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input name="insurance" type="checkbox" /> Insurance
            </label>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-error-50 px-4 py-3 text-sm text-error">{error}</div>
        )}
        {successId && (
          <div className="rounded-lg border border-green-200 bg-success-50 px-4 py-3 text-sm text-success">
            Created: <strong>{successId}</strong> — redirecting…
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary px-8 py-3 text-lg disabled:opacity-60">
          {loading ? "Creating…" : "Create Shipment"}
        </button>
      </form>
    </div>
  );
}

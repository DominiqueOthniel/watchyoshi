"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Shipment } from "@/lib/types";

const TrackMap = dynamic(() => import("@/components/TrackMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-xl border border-emerald-900/10 bg-white/60 text-sm text-emerald-950/50">
      Chargement de la carte…
    </div>
  ),
});

export default function TrackClient() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    setShipment(null);
    try {
      const res = await fetch(`/api/shipments/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Envoi introuvable");
      setShipment(data.shipment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      lookup(id);
    }
  }, [searchParams, lookup]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await lookup(trackingId);
  }

  const origin =
    shipment?.sender?.address?.lat != null && shipment?.sender?.address?.lng != null
      ? {
          lat: shipment.sender.address.lat,
          lng: shipment.sender.address.lng,
          label: shipment.sender.address.city || "Origine",
        }
      : undefined;
  const destination =
    shipment?.recipient?.address?.lat != null && shipment?.recipient?.address?.lng != null
      ? {
          lat: shipment.recipient.address.lat,
          lng: shipment.recipient.address.lng,
          label: shipment.recipient.address.city || "Destination",
        }
      : undefined;
  const current =
    shipment?.currentLocation?.lat != null && shipment?.currentLocation?.lng != null
      ? {
          lat: shipment.currentLocation.lat,
          lng: shipment.currentLocation.lng,
          label: shipment.currentLocation.city || "Position",
        }
      : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-emerald-950">Suivi public</h1>
      <p className="mt-2 text-emerald-950/65">Entrez votre numéro de tracking CargoWatch.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="ex. CWAB12CD34"
          className="flex-1 rounded-xl border border-emerald-900/15 bg-white px-4 py-3 outline-none ring-emerald-600 focus:ring-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Recherche…" : "Suivre"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {shipment && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-emerald-950/55">Tracking ID</p>
                <p className="text-2xl font-bold text-emerald-950">{shipment.trackingId}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium capitalize text-emerald-800">
                {shipment.status.replaceAll("_", " ")}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-950/45">Expéditeur</p>
                <p className="font-medium">{shipment.sender.name}</p>
                <p className="text-sm text-emerald-950/60">
                  {shipment.sender.address?.city}
                  {shipment.sender.address?.country ? `, ${shipment.sender.address.country}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-950/45">Destinataire</p>
                <p className="font-medium">{shipment.recipient.name}</p>
                <p className="text-sm text-emerald-950/60">
                  {shipment.recipient.address?.city}
                  {shipment.recipient.address?.country
                    ? `, ${shipment.recipient.address.country}`
                    : ""}
                </p>
              </div>
            </div>
            {shipment.currentLocation?.city && (
              <p className="mt-4 text-sm">
                Position actuelle :{" "}
                <strong>{shipment.currentLocation.city}</strong>
              </p>
            )}
          </div>

          <TrackMap origin={origin} destination={destination} current={current} />

          <div className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6">
            <h2 className="font-semibold text-emerald-950">Historique</h2>
            <ul className="mt-4 space-y-3">
              {(shipment.events || []).length === 0 && (
                <li className="text-sm text-emerald-950/50">Aucun événement pour le moment.</li>
              )}
              {(shipment.events || []).map((ev, i) => (
                <li key={`${ev.timestamp}-${i}`} className="border-l-2 border-emerald-500 pl-3">
                  <p className="font-medium">{ev.title || ev.status}</p>
                  {ev.description && <p className="text-sm text-emerald-950/65">{ev.description}</p>}
                  <p className="text-xs text-emerald-950/45">
                    {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : ""}
                    {ev.location ? ` · ${ev.location}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

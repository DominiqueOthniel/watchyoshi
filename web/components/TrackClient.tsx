"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Shipment } from "@/lib/types";

const TrackMap = dynamic(() => import("@/components/TrackMap"), {
  ssr: false,
  loading: () => (
    <div className="card flex h-80 items-center justify-center text-sm text-text-muted">
      Loading map…
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
      if (!res.ok) throw new Error(data.error || "Shipment not found");
      setShipment(data.shipment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
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
          label: shipment.sender.address.city || "Origin",
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
          label: shipment.currentLocation.city || "Current",
        }
      : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary">Track Shipment</h1>
      <p className="mt-2 text-text-secondary">Enter your CargoWatch tracking ID.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="e.g. CWAB12CD34"
          className="input-field flex-1 px-4 py-3"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary px-6 py-3 disabled:opacity-60">
          {loading ? "Searching…" : "Track"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {shipment && (
        <div className="mt-8 space-y-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text-muted">Tracking ID</p>
                <p className="text-2xl font-bold text-text-primary">{shipment.trackingId}</p>
              </div>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium capitalize text-primary">
                {shipment.status.replaceAll("_", " ")}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Sender</p>
                <p className="font-medium text-text-primary">{shipment.sender.name}</p>
                <p className="text-sm text-text-secondary">
                  {shipment.sender.address?.city}
                  {shipment.sender.address?.country ? `, ${shipment.sender.address.country}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Recipient</p>
                <p className="font-medium text-text-primary">{shipment.recipient.name}</p>
                <p className="text-sm text-text-secondary">
                  {shipment.recipient.address?.city}
                  {shipment.recipient.address?.country
                    ? `, ${shipment.recipient.address.country}`
                    : ""}
                </p>
              </div>
            </div>
            {shipment.currentLocation?.city && (
              <p className="mt-4 text-sm text-text-secondary">
                Current location:{" "}
                <strong className="text-text-primary">{shipment.currentLocation.city}</strong>
              </p>
            )}
          </div>

          <TrackMap origin={origin} destination={destination} current={current} />

          <div className="card p-6">
            <h2 className="font-semibold text-text-primary">Timeline</h2>
            <ul className="mt-4 space-y-3">
              {(shipment.events || []).length === 0 && (
                <li className="text-sm text-text-muted">No events yet.</li>
              )}
              {(shipment.events || []).map((ev, i) => (
                <li key={`${ev.timestamp}-${i}`} className="border-l-2 border-primary pl-3">
                  <p className="font-medium text-text-primary">{ev.title || ev.status}</p>
                  {ev.description && <p className="text-sm text-text-secondary">{ev.description}</p>}
                  <p className="text-xs text-text-muted">
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

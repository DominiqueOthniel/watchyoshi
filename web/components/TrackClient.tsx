"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShipmentProgress from "@/components/ShipmentProgress";
import { routeProgressFromShipment } from "@/lib/progress";
import type { Shipment } from "@/lib/types";

const TrackMap = dynamic(() => import("@/components/TrackMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-xl bg-surface text-sm text-text-muted">
      Loading map…
    </div>
  ),
});

export default function TrackClient() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [routeProgress, setRouteProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (id: string, silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetch(`/api/shipments/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Shipment not found");
      setShipment(data.shipment);
      setRouteProgress(
        typeof data.routeProgress === "number"
          ? data.routeProgress
          : routeProgressFromShipment(data.shipment)
      );
    } catch (err) {
      if (!silent) {
        setShipment(null);
        setError(err instanceof Error ? err.message : "Error");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      lookup(id);
    }
  }, [searchParams, lookup]);

  // Live refresh while shipment is moving
  useEffect(() => {
    if (!shipment?.trackingId) return;
    if (shipment.status === "delivered" || shipment.status === "pending") return;

    const timer = setInterval(() => {
      lookup(shipment.trackingId, true);
    }, 4000);

    return () => clearInterval(timer);
  }, [shipment?.trackingId, shipment?.status, lookup]);

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

  const events = [...(shipment?.events || [])].reverse();

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
            Track Your <span className="text-gradient-primary">Shipment</span>
          </h1>
          <p className="mb-8 text-lg text-text-secondary">
            Enter your tracking ID to see live status, timeline, and map location.
          </p>
          <form onSubmit={onSubmit} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID..."
              className="input-field flex-1 px-4 py-3 text-lg"
              required
            />
            <button type="submit" disabled={loading} className="btn-primary px-8 py-3 text-lg disabled:opacity-60">
              {loading ? "Searching…" : "Track"}
            </button>
          </form>
          {error && (
            <div className="mx-auto mt-4 max-w-xl rounded-lg border border-red-200 bg-error-50 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}
        </div>
      </section>

      {shipment && (
        <section className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6">
          <div className="rounded-2xl bg-white p-6 shadow-large sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text-muted">Tracking ID</p>
                <p className="text-2xl font-bold text-text-primary">{shipment.trackingId}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  shipment.status === "delivered"
                    ? "bg-success-50 text-success"
                    : shipment.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : shipment.status === "exception"
                        ? "bg-error-50 text-error"
                        : "bg-primary-50 text-primary"
                }`}
              >
                {shipment.status === "in_transit" || shipment.status === "out_for_delivery" ? (
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                ) : null}
                {shipment.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="mt-6">
              <ShipmentProgress status={shipment.status} routeProgress={routeProgress} />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">From</p>
                <p className="font-semibold text-text-primary">{shipment.sender.name}</p>
                <p className="text-sm text-text-secondary">
                  {[shipment.sender.address?.city, shipment.sender.address?.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">To</p>
                <p className="font-semibold text-text-primary">{shipment.recipient.name}</p>
                <p className="text-sm text-text-secondary">
                  {[shipment.recipient.address?.city, shipment.recipient.address?.country]
                    .filter(Boolean)
                    .join(", ")}
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

          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-large">
            <TrackMap origin={origin} destination={destination} current={current} />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-large sm:p-8">
            <h2 className="mb-5 text-lg font-semibold text-text-primary">Shipment Timeline</h2>
            <div className="relative space-y-0">
              {events.length === 0 && (
                <p className="text-sm text-text-muted">No events yet.</p>
              )}
              {events.map((ev, i) => (
                <div
                  key={`${ev.timestamp}-${i}`}
                  className="timeline-item relative flex gap-4 pb-6 last:pb-0"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {i < events.length - 1 && (
                    <span className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-0.5 bg-border" />
                  )}
                  <div
                    className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white ${
                      i === 0 ? "step-pulse bg-primary" : "bg-success"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-text-primary">{ev.title || ev.status}</div>
                    {ev.description && (
                      <div className="text-sm text-text-secondary">{ev.description}</div>
                    )}
                    <div className="text-xs text-text-muted">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : ""}
                      {ev.location ? ` · ${ev.location}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

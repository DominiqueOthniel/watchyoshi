import type { Shipment, ShipmentEvent, ShipmentStatus } from "./types";

export const STATUS_FLOW: ShipmentStatus[] = [
  "pending",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export const STATUS_META: Record<
  ShipmentStatus,
  { label: string; title: string; description: string; progressFloor: number }
> = {
  pending: {
    label: "Pending",
    title: "Shipment registered",
    description: "Label created. Awaiting courier pickup.",
    progressFloor: 0,
  },
  picked_up: {
    label: "Picked up",
    title: "Package picked up",
    description: "Courier collected the package from the sender.",
    progressFloor: 0.02,
  },
  in_transit: {
    label: "In transit",
    title: "In transit",
    description: "Package is moving through the logistics network toward the destination.",
    progressFloor: 0.08,
  },
  out_for_delivery: {
    label: "Out for delivery",
    title: "Out for delivery",
    description: "Package is with the local courier and will arrive soon.",
    progressFloor: 0.88,
  },
  delivered: {
    label: "Delivered",
    title: "Delivered",
    description: "Package successfully delivered to the recipient.",
    progressFloor: 1,
  },
  exception: {
    label: "Exception",
    title: "Delivery exception",
    description: "An issue requires attention. Support has been notified.",
    progressFloor: 0.5,
  },
};

export function statusRank(status: string): number {
  const i = STATUS_FLOW.indexOf(status as ShipmentStatus);
  return i >= 0 ? i : -1;
}

export function isForwardTransition(from: string, to: string): boolean {
  if (to === "exception") return true;
  if (from === "exception") return to !== "delivered" || true;
  return statusRank(to) >= statusRank(from);
}

export function nextStatusInFlow(current: string): ShipmentStatus | null {
  if (current === "exception") return "in_transit";
  const i = statusRank(current);
  if (i < 0 || i >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[i + 1];
}

/** Auto-map route progress → lifecycle status (never downgrades). */
export function statusFromProgress(
  progress: number,
  current: ShipmentStatus | string
): ShipmentStatus {
  if (current === "exception") return "exception";
  if (current === "pending") return "pending";

  let suggested: ShipmentStatus = "picked_up";
  if (progress >= 1) suggested = "delivered";
  else if (progress >= 0.88) suggested = "out_for_delivery";
  else if (progress >= 0.08) suggested = "in_transit";
  else if (progress > 0) suggested = "picked_up";

  if (statusRank(suggested) > statusRank(current)) return suggested;
  return current as ShipmentStatus;
}

export function buildStatusEvent(
  status: ShipmentStatus | string,
  shipment: Shipment,
  note?: string
): ShipmentEvent {
  const meta = STATUS_META[status as ShipmentStatus] || {
    title: `Status: ${status}`,
    description: `Status updated to ${status}`,
  };
  const city =
    status === "delivered"
      ? shipment.recipient?.address?.city
      : status === "pending" || status === "picked_up"
        ? shipment.sender?.address?.city
        : shipment.currentLocation?.city || shipment.sender?.address?.city;

  return {
    status,
    title: meta.title,
    description: note || meta.description,
    location: city || undefined,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Apply a professional status change:
 * - starts the progress clock only when leaving pending
 * - does NOT reset the marker when advancing forward
 * - places the package near destination for out_for_delivery / delivered
 * - pauses auto-progress on exception / delivered
 */
export function applyStatusChange(
  shipment: Shipment,
  nextStatus: ShipmentStatus | string,
  options: { note?: string; forceRestart?: boolean } = {}
) {
  const status = nextStatus as ShipmentStatus;
  const now = new Date().toISOString();
  const meta = STATUS_META[status];
  const events = [...(shipment.events || []), buildStatusEvent(status, shipment, options.note)];

  const updates: Partial<Shipment> & {
    status: ShipmentStatus;
    events: ShipmentEvent[];
    updatedAt: string;
  } = {
    status,
    events,
    updatedAt: now,
  };

  const auto = { ...(shipment.autoProgress || {
    enabled: true,
    paused: false,
    pausedAt: null,
    pauseReason: null,
    pausedDuration: 0,
    startedAt: null,
    lastUpdate: null,
  }) };

  const leavingPending = shipment.status === "pending" && status !== "pending";
  const advancing =
    statusRank(status) > statusRank(shipment.status) && status !== "exception";

  if (status === "pending") {
    auto.enabled = true;
    auto.paused = false;
    auto.pausedAt = null;
    auto.pauseReason = null;
    auto.startedAt = null;
    auto.lastUpdate = now;
    updates.autoProgress = auto;
    if (shipment.sender?.address?.lat != null && shipment.sender?.address?.lng != null) {
      updates.currentLocation = {
        lat: Number(shipment.sender.address.lat),
        lng: Number(shipment.sender.address.lng),
        city: shipment.sender.address.city || "Origin",
      };
    }
    return updates;
  }

  if (status === "exception") {
    auto.paused = true;
    auto.pausedAt = now;
    auto.pauseReason = options.note || "Exception raised";
    auto.lastUpdate = now;
    updates.autoProgress = auto;
    return updates;
  }

  if (status === "delivered") {
    auto.enabled = true;
    auto.paused = false;
    auto.pausedAt = null;
    auto.pauseReason = null;
    auto.lastUpdate = now;
    if (!auto.startedAt) auto.startedAt = shipment.autoProgress?.startedAt || now;
    updates.autoProgress = auto;
    updates.deliveredAt = now;
    if (shipment.recipient?.address?.lat != null && shipment.recipient?.address?.lng != null) {
      updates.currentLocation = {
        lat: Number(shipment.recipient.address.lat),
        lng: Number(shipment.recipient.address.lng),
        city: shipment.recipient.address.city || "Destination",
      };
    }
    return updates;
  }

  // Active shipping states
  auto.enabled = true;
  auto.paused = false;
  auto.pausedAt = null;
  auto.pauseReason = null;
  auto.lastUpdate = now;

  if (leavingPending || options.forceRestart || !auto.startedAt) {
    auto.startedAt = now;
    if (shipment.sender?.address?.lat != null && shipment.sender?.address?.lng != null) {
      updates.currentLocation = {
        lat: Number(shipment.sender.address.lat),
        lng: Number(shipment.sender.address.lng),
        city: shipment.sender.address.city || "Origin",
      };
    }
  } else if (advancing && status === "out_for_delivery") {
    // Nudge position toward destination without restarting the whole journey
    const oLat = Number(shipment.sender?.address?.lat);
    const oLng = Number(shipment.sender?.address?.lng);
    const dLat = Number(shipment.recipient?.address?.lat);
    const dLng = Number(shipment.recipient?.address?.lng);
    if ([oLat, oLng, dLat, dLng].every((n) => Number.isFinite(n))) {
      const floor = meta?.progressFloor ?? 0.88;
      updates.currentLocation = {
        lat: oLat + (dLat - oLat) * floor,
        lng: oLng + (dLng - oLng) * floor,
        city: shipment.recipient?.address?.city
          ? `Near ${shipment.recipient.address.city}`
          : "Near destination",
      };
    }
  }
  // Forward transitions keep existing startedAt + currentLocation (smooth continuum)

  updates.autoProgress = auto;
  return updates;
}

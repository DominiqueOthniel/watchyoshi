import type { Shipment, ShipmentStatus } from "./types";

export const PROGRESS_STEPS: { key: ShipmentStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "picked_up", label: "Picked up" },
  { key: "in_transit", label: "In transit" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_BASE: Record<string, number> = {
  pending: 0.05,
  picked_up: 0.2,
  in_transit: 0.45,
  out_for_delivery: 0.8,
  delivered: 1,
  exception: 0.5,
};

/** 0–100 progress for UI bar / stepper fill */
export function shipmentProgressPercent(
  status: string,
  routeProgress?: number | null
): number {
  if (status === "delivered") return 100;
  if (status === "pending") return 5;
  if (status === "exception") return 50;

  if (
    typeof routeProgress === "number" &&
    !Number.isNaN(routeProgress) &&
    (status === "in_transit" || status === "out_for_delivery" || status === "picked_up")
  ) {
    const base = STATUS_BASE[status] ?? 0.2;
    const ceiling = status === "out_for_delivery" ? 0.95 : 0.78;
    const blended = Math.max(base, Math.min(ceiling, routeProgress));
    return Math.round(blended * 100);
  }

  return Math.round((STATUS_BASE[status] ?? 0.05) * 100);
}

export function stepIndex(status: string): number {
  const i = PROGRESS_STEPS.findIndex((s) => s.key === status);
  if (status === "exception") return 2;
  return i >= 0 ? i : 0;
}

export function isStepComplete(stepKey: ShipmentStatus, current: string): boolean {
  if (current === "delivered") return true;
  if (current === "exception") return stepIndex(stepKey) < 2;
  return stepIndex(stepKey) < stepIndex(current);
}

export function isStepActive(stepKey: ShipmentStatus, current: string): boolean {
  if (current === "exception") return stepKey === "in_transit";
  return stepKey === current;
}

export function routeProgressFromShipment(shipment: Shipment): number | null {
  const cur = shipment.currentLocation;
  const o = shipment.sender?.address;
  const d = shipment.recipient?.address;
  if (
    cur?.lat == null ||
    cur?.lng == null ||
    o?.lat == null ||
    o?.lng == null ||
    d?.lat == null ||
    d?.lng == null
  ) {
    return null;
  }
  const dist = (a: number, b: number, c: number, e: number) => {
    const R = 6371;
    const dLat = ((c - a) * Math.PI) / 180;
    const dLon = ((e - b) * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a * Math.PI) / 180) * Math.cos((c * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };
  const total = dist(o.lat, o.lng, d.lat, d.lng);
  if (total < 0.01) return null;
  const traveled = dist(o.lat, o.lng, cur.lat, cur.lng);
  return Math.min(1, Math.max(0, traveled / total));
}

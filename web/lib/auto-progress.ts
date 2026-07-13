import type { Shipment } from "./types";

/** Wall-clock seconds at origin before the marker starts moving */
const HANDLING_DELAY_SEC = 12;

/**
 * Demo-visible journey length: long hauls finish in a few minutes of real time
 * so the map clearly animates while the user watches.
 */
function journeyDurationSec(distanceMiles: number) {
  // ~400 miles per real minute of travel, min 90s, max 10 min
  return Math.min(600, Math.max(90, distanceMiles / 400 * 60));
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getPointOnRoute(routeGeometry: [number, number][], progress: number) {
  if (!routeGeometry.length) return null;
  const p = Math.max(0, Math.min(1, progress));
  const exactIndex = p * (routeGeometry.length - 1);
  const index = Math.floor(exactIndex);
  const fraction = exactIndex - index;
  if (index >= routeGeometry.length - 1) return routeGeometry[routeGeometry.length - 1];
  const point1 = routeGeometry[index];
  const point2 = routeGeometry[index + 1];
  return [
    point1[0] + (point2[0] - point1[0]) * fraction,
    point1[1] + (point2[1] - point1[1]) * fraction,
  ] as [number, number];
}

export async function fetchOsrmRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&alternatives=false`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code !== "Ok" || !json.routes?.[0]) return null;
    const route = json.routes[0];
    return {
      geometry: route.geometry.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0],
      ]) as [number, number][],
      distanceMiles: (route.distance / 1000) * 0.621371,
    };
  } catch {
    return null;
  }
}

export function resolveProgressStart(shipment: Shipment): Date | null {
  if (shipment.autoProgress?.startedAt) return new Date(shipment.autoProgress.startedAt);
  if (shipment.events?.length) {
    const firstActive = shipment.events.find((e) => e.status && e.status !== "pending");
    if (firstActive?.timestamp) return new Date(firstActive.timestamp);
  }
  if (shipment.status !== "pending" && shipment.updatedAt) return new Date(shipment.updatedAt);
  return null;
}

/** Pure progress 0–1 from elapsed wall time (same formula client + server). */
export function computeProgressFraction(
  startedAt: Date,
  distanceMiles: number,
  pausedDurationMs = 0,
  pausedAt: string | null = null,
  now = new Date()
) {
  let elapsedMs = now.getTime() - startedAt.getTime() - pausedDurationMs;
  if (pausedAt) {
    elapsedMs -= Math.max(0, now.getTime() - new Date(pausedAt).getTime());
  }
  elapsedMs = Math.max(0, elapsedMs);

  const handlingMs = HANDLING_DELAY_SEC * 1000;
  if (elapsedMs <= handlingMs) {
    return Math.min(0.02, (elapsedMs / handlingMs) * 0.02);
  }

  const travelMs = elapsedMs - handlingMs;
  const durationMs = journeyDurationSec(distanceMiles) * 1000;
  return Math.min(1, Math.max(0, travelMs / durationMs));
}

export function interpolatePosition(
  progress: number,
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  routeGeometry?: [number, number][] | null
) {
  if (routeGeometry?.length) {
    const point = getPointOnRoute(routeGeometry, progress);
    if (point) return { lat: point[0], lng: point[1] };
  }
  return {
    lat: originLat + (destLat - originLat) * progress,
    lng: originLng + (destLng - originLng) * progress,
  };
}

export async function calculateAutomaticProgression(shipment: Shipment) {
  if (!shipment.autoProgress?.enabled || shipment.status === "delivered") return null;
  if (shipment.autoProgress?.paused) return null;
  if (shipment.status === "pending") return null;

  const originLat = Number(shipment.sender?.address?.lat);
  const originLng = Number(shipment.sender?.address?.lng);
  const destLat = Number(shipment.recipient?.address?.lat);
  const destLng = Number(shipment.recipient?.address?.lng);
  if (![originLat, originLng, destLat, destLng].every((n) => Number.isFinite(n))) return null;

  let routeGeometry = shipment.routeGeometry;
  let routeDistanceMiles = shipment.routeDistanceMiles;

  if (!routeGeometry) {
    const routeData = await fetchOsrmRoute(originLat, originLng, destLat, destLng);
    if (routeData) {
      routeGeometry = routeData.geometry;
      routeDistanceMiles = routeData.distanceMiles;
    }
  }

  const startedAt = resolveProgressStart(shipment);
  if (!startedAt || Number.isNaN(startedAt.getTime())) return null;

  const totalDistanceMiles =
    routeDistanceMiles || haversineMiles(originLat, originLng, destLat, destLng);
  if (!totalDistanceMiles) return null;

  const progress = computeProgressFraction(
    startedAt,
    totalDistanceMiles,
    shipment.autoProgress.pausedDuration || 0,
    shipment.autoProgress.paused ? shipment.autoProgress.pausedAt : null
  );

  if (progress >= 1) {
    return {
      lat: destLat,
      lng: destLng,
      city: shipment.recipient?.address?.city || "Destination",
      progress: 1,
      routeGeometry,
      routeDistanceMiles: totalDistanceMiles,
    };
  }

  const pos = interpolatePosition(
    progress,
    originLat,
    originLng,
    destLat,
    destLng,
    routeGeometry
  );

  return {
    ...pos,
    city:
      progress < 0.05
        ? shipment.sender?.address?.city || "Origin"
        : progress > 0.9
          ? "Near destination"
          : "In Transit",
    progress,
    routeGeometry,
    routeDistanceMiles: totalDistanceMiles,
  };
}

import type { Shipment } from "./types";

const TRUCK_SPEED_MPH = 55;
const MIN_MILES_PER_MINUTE = 1;
const DAILY_DRIVING_HOURS = 11;
const HANDLING_DELAY_HOURS = 4;

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

function getPointOnRoute(routeGeometry: [number, number][], progress: number) {
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

export async function calculateAutomaticProgression(shipment: Shipment) {
  if (!shipment.autoProgress?.enabled || shipment.status === "delivered") return null;
  if (shipment.autoProgress?.paused) return null;

  const originLat = shipment.sender?.address?.lat;
  const originLng = shipment.sender?.address?.lng;
  const destLat = shipment.recipient?.address?.lat;
  const destLng = shipment.recipient?.address?.lng;
  if (originLat == null || originLng == null || destLat == null || destLng == null) return null;

  let routeGeometry = shipment.routeGeometry;
  let routeDistanceMiles = shipment.routeDistanceMiles;

  if (!routeGeometry) {
    const routeData = await fetchOsrmRoute(originLat, originLng, destLat, destLng);
    if (routeData) {
      routeGeometry = routeData.geometry;
      routeDistanceMiles = routeData.distanceMiles;
    }
  }

  let startedAt = shipment.autoProgress.startedAt
    ? new Date(shipment.autoProgress.startedAt)
    : shipment.createdAt
      ? new Date(shipment.createdAt)
      : null;

  if (!startedAt && shipment.events?.length) {
    const firstActive = shipment.events.find((e) => e.status && e.status !== "pending");
    if (firstActive?.timestamp) startedAt = new Date(firstActive.timestamp);
  }
  if (!startedAt) return null;

  const now = new Date();
  let elapsedHours = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60);
  if (elapsedHours < 0) return null;

  let pausedDurationHours = (shipment.autoProgress.pausedDuration || 0) / (1000 * 60 * 60);
  if (shipment.autoProgress.paused && shipment.autoProgress.pausedAt) {
    const pauseStart = new Date(shipment.autoProgress.pausedAt);
    pausedDurationHours += Math.max(0, (now.getTime() - pauseStart.getTime()) / (1000 * 60 * 60));
  }

  const effectiveElapsedHours = Math.max(0, elapsedHours - pausedDurationHours);

  const interpolate = (progress: number) => {
    if (routeGeometry?.length) {
      const point = getPointOnRoute(routeGeometry, progress);
      if (point) return { lat: point[0], lng: point[1] };
    }
    return {
      lat: originLat + (destLat - originLat) * progress,
      lng: originLng + (destLng - originLng) * progress,
    };
  };

  if (effectiveElapsedHours <= HANDLING_DELAY_HOURS) {
    const minProgress = Math.min(0.05, (effectiveElapsedHours / HANDLING_DELAY_HOURS) * 0.05);
    const pos = interpolate(minProgress);
    return {
      ...pos,
      city: shipment.sender?.address?.city || "Origin",
      progress: minProgress,
      routeGeometry,
      routeDistanceMiles,
    };
  }

  const drivingWindowHours = effectiveElapsedHours - HANDLING_DELAY_HOURS;
  const fullDays = Math.floor(drivingWindowHours / 24);
  const remainderHours = drivingWindowHours - fullDays * 24;
  const drivingHours = fullDays * DAILY_DRIVING_HOURS + Math.min(DAILY_DRIVING_HOURS, remainderHours);
  const totalDistanceMiles =
    routeDistanceMiles || haversineMiles(originLat, originLng, destLat, destLng);
  if (!totalDistanceMiles) return null;

  const drivingHoursRequired = totalDistanceMiles / TRUCK_SPEED_MPH;
  const defaultProgress = Math.min(1, Math.max(0, drivingHours / drivingHoursRequired));
  const elapsedMinutesSinceStart = Math.max(0, drivingWindowHours * 60);
  const minProgressFromSpeed =
    totalDistanceMiles > 0
      ? Math.min(1, (elapsedMinutesSinceStart * MIN_MILES_PER_MINUTE) / totalDistanceMiles)
      : 0;
  const progress = Math.min(1, Math.max(defaultProgress, minProgressFromSpeed));

  if (progress >= 1) {
    return {
      lat: destLat,
      lng: destLng,
      city: shipment.recipient?.address?.city || "Destination",
      progress: 1,
      routeGeometry,
      routeDistanceMiles,
    };
  }

  const pos = interpolate(progress);
  return {
    ...pos,
    city: "In Transit",
    progress,
    routeGeometry,
    routeDistanceMiles,
  };
}

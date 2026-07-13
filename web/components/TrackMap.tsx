"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";

const baseIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const pulseIcon = L.divIcon({
  className: "",
  html: `<div class="cw-pulse-marker"><span class="cw-pulse-ring"></span><span class="cw-pulse-dot"></span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface Point {
  lat: number;
  lng: number;
  label?: string;
}

interface TrackMapProps {
  origin?: Point;
  destination?: Point;
  current?: Point;
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [36, 36], maxZoom: 8 });
    } else if (points.length === 1) {
      map.setView(points[0], 6);
    }
  }, [map, points]);
  return null;
}

function AnimatedCurrentMarker({ current }: { current: Point }) {
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();
  const fromRef = useRef<[number, number] | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const target: [number, number] = [current.lat, current.lng];
    const marker = markerRef.current;
    if (!marker) {
      fromRef.current = target;
      return;
    }

    const start = fromRef.current || (marker.getLatLng() as L.LatLng);
    const startPos: [number, number] = Array.isArray(start)
      ? start
      : [start.lat, start.lng];
    fromRef.current = target;

    const dist = Math.hypot(target[0] - startPos[0], target[1] - startPos[1]);
    if (dist < 0.00001) {
      marker.setLatLng(target);
      return;
    }

    const duration = Math.min(2800, Math.max(600, dist * 80000));
    const t0 = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const lat = startPos[0] + (target[0] - startPos[0]) * ease;
      const lng = startPos[1] + (target[1] - startPos[1]) * ease;
      marker.setLatLng([lat, lng]);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        map.panTo([lat, lng], { animate: true, duration: 0.6 });
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [current.lat, current.lng, map]);

  return (
    <Marker
      position={[current.lat, current.lng]}
      icon={pulseIcon}
      ref={(m) => {
        markerRef.current = m;
      }}
    >
      <Popup>{current.label || "Current position"}</Popup>
    </Marker>
  );
}

export default function TrackMap({ origin, destination, current }: TrackMapProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const centerLat = current?.lat ?? origin?.lat ?? destination?.lat ?? 20;
  const centerLng = current?.lng ?? origin?.lng ?? destination?.lng ?? 0;

  const routeLine = useMemo(() => {
    const line: [number, number][] = [];
    if (origin) line.push([origin.lat, origin.lng]);
    if (destination) line.push([destination.lat, destination.lng]);
    return line;
  }, [origin, destination]);

  const traveledLine = useMemo(() => {
    const line: [number, number][] = [];
    if (origin) line.push([origin.lat, origin.lng]);
    if (current) line.push([current.lat, current.lng]);
    return line;
  }, [origin, current]);

  const fitPoints = useMemo(() => {
    const pts: [number, number][] = [];
    if (origin) pts.push([origin.lat, origin.lng]);
    if (current) pts.push([current.lat, current.lng]);
    if (destination) pts.push([destination.lat, destination.lng]);
    return pts;
  }, [origin, destination, current]);

  return (
    <div className="h-56 w-full overflow-hidden rounded-xl border border-border sm:h-80">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={fitPoints} />
        {routeLine.length >= 2 && (
          <Polyline positions={routeLine} pathOptions={{ color: "#bfdbfe", weight: 4 }} />
        )}
        {traveledLine.length >= 2 && (
          <Polyline positions={traveledLine} pathOptions={{ color: "#2563EB", weight: 4 }} />
        )}
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={baseIcon}>
            <Popup>{origin.label || "Origin"}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={baseIcon}>
            <Popup>{destination.label || "Destination"}</Popup>
          </Marker>
        )}
        {current && <AnimatedCurrentMarker current={current} />}
      </MapContainer>
    </div>
  );
}

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
  className: "cw-pulse-icon",
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
  routeGeometry?: [number, number][] | null;
}

function FitOnce({ points }: { points: [number, number][] }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || points.length === 0) return;
    done.current = true;
    if (points.length >= 2) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 7 });
    } else {
      map.setView(points[0], 6);
    }
  }, [map, points]);

  return null;
}

function MovingMarker({ current }: { current: Point }) {
  const markerRef = useRef<L.Marker | null>(null);
  const displayRef = useRef<[number, number]>([current.lat, current.lng]);
  const targetRef = useRef<[number, number]>([current.lat, current.lng]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = [current.lat, current.lng];
  }, [current.lat, current.lng]);

  useEffect(() => {
    const tick = () => {
      const marker = markerRef.current;
      const [tLat, tLng] = targetRef.current;
      let [lat, lng] = displayRef.current;
      const dLat = tLat - lat;
      const dLng = tLng - lng;
      // Smooth chase — visibly crawls toward latest progress point
      lat += dLat * 0.12;
      lng += dLng * 0.12;
      if (Math.abs(dLat) < 0.00001 && Math.abs(dLng) < 0.00001) {
        lat = tLat;
        lng = tLng;
      }
      displayRef.current = [lat, lng];
      marker?.setLatLng([lat, lng]);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Marker
      position={[current.lat, current.lng]}
      icon={pulseIcon}
      zIndexOffset={1000}
      ref={(m) => {
        markerRef.current = m;
        if (m) displayRef.current = [m.getLatLng().lat, m.getLatLng().lng];
      }}
    >
      <Popup>{current.label || "Package location"}</Popup>
    </Marker>
  );
}

export default function TrackMap({
  origin,
  destination,
  current,
  routeGeometry,
}: TrackMapProps) {
  const centerLat = current?.lat ?? origin?.lat ?? destination?.lat ?? 20;
  const centerLng = current?.lng ?? origin?.lng ?? destination?.lng ?? 0;

  const fullRoute = useMemo(() => {
    if (routeGeometry && routeGeometry.length >= 2) return routeGeometry;
    const line: [number, number][] = [];
    if (origin) line.push([origin.lat, origin.lng]);
    if (destination) line.push([destination.lat, destination.lng]);
    return line;
  }, [routeGeometry, origin, destination]);

  const traveledLine = useMemo(() => {
    if (!current || !origin) return [] as [number, number][];
    if (routeGeometry && routeGeometry.length >= 2) {
      // Approximate traveled portion by nearest index to current
      let best = 0;
      let bestD = Infinity;
      routeGeometry.forEach((p, i) => {
        const d = Math.hypot(p[0] - current.lat, p[1] - current.lng);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return routeGeometry.slice(0, Math.max(2, best + 1));
    }
    return [
      [origin.lat, origin.lng],
      [current.lat, current.lng],
    ] as [number, number][];
  }, [origin, current, routeGeometry]);

  const fitPoints = useMemo(() => {
    if (fullRoute.length >= 2) return fullRoute;
    const pts: [number, number][] = [];
    if (origin) pts.push([origin.lat, origin.lng]);
    if (destination) pts.push([destination.lat, destination.lng]);
    return pts;
  }, [fullRoute, origin, destination]);

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
        <FitOnce points={fitPoints} />
        {fullRoute.length >= 2 && (
          <Polyline positions={fullRoute} pathOptions={{ color: "#bfdbfe", weight: 5, opacity: 0.9 }} />
        )}
        {traveledLine.length >= 2 && (
          <Polyline positions={traveledLine} pathOptions={{ color: "#2563EB", weight: 5 }} />
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
        {current && <MovingMarker current={current} />}
      </MapContainer>
    </div>
  );
}

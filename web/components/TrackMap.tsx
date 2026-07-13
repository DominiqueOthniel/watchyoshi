"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface TrackMapProps {
  origin?: { lat: number; lng: number; label?: string };
  destination?: { lat: number; lng: number; label?: string };
  current?: { lat: number; lng: number; label?: string };
}

export default function TrackMap({ origin, destination, current }: TrackMapProps) {
  useEffect(() => {
    // Fix default icon paths in bundlers
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
  const line: [number, number][] = [];
  if (origin) line.push([origin.lat, origin.lng]);
  if (current) line.push([current.lat, current.lng]);
  if (destination) line.push([destination.lat, destination.lng]);

  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-emerald-900/10">
      <MapContainer center={[centerLat, centerLng]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={markerIcon}>
            <Popup>{origin.label || "Origine"}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={markerIcon}>
            <Popup>{destination.label || "Destination"}</Popup>
          </Marker>
        )}
        {current && (
          <Marker position={[current.lat, current.lng]} icon={markerIcon}>
            <Popup>{current.label || "Position actuelle"}</Popup>
          </Marker>
        )}
        {line.length >= 2 && <Polyline positions={line} pathOptions={{ color: "#2563EB" }} />}
      </MapContainer>
    </div>
  );
}

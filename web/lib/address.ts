import type { Address } from "@/lib/types";

export const FRANCE = "France";

export const FR_CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Lille",
  "Toulouse",
  "Bordeaux",
  "Nantes",
  "Strasbourg",
  "Nice",
  "Rennes",
  "Le Havre",
  "Rouen",
  "Montpellier",
  "Grenoble",
  "Dijon",
  "Tours",
  "Orléans",
  "Reims",
  "Clermont-Ferrand",
  "Metz",
];

export function isFrance(country?: string) {
  const c = (country || "").trim().toLowerCase();
  return c === "france" || c === "fr" || c === "français" || c === "francais";
}

export function isFrenchPostalCode(zip?: string) {
  return /^\d{5}$/.test((zip || "").trim());
}

export function formatAddress(address?: Address | null) {
  if (!address) return "";
  const cityLine = [address.zip, address.city].filter(Boolean).join(" ");
  return [address.street, cityLine, address.state, address.country].filter(Boolean).join(", ");
}

export function geocodeQuery(address: {
  street?: string;
  zip?: string;
  city: string;
  country: string;
}) {
  return [address.street, address.zip, address.city, address.country || FRANCE]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}

function uniqueQueries(parts: Array<string | undefined>) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const q = part?.replace(/\s+/g, " ").trim();
    if (!q || seen.has(q.toLowerCase())) continue;
    seen.add(q.toLowerCase());
    out.push(q);
  }
  return out;
}

async function geocodeFranceBan(address: {
  street?: string;
  zip?: string;
  city: string;
  country: string;
}) {
  const zip = address.zip?.trim();
  const city = address.city?.trim();
  const street = address.street?.trim();
  const queries = uniqueQueries([
    [street, zip, city].filter(Boolean).join(" "),
    [street, city].filter(Boolean).join(" "),
    [zip, city].filter(Boolean).join(" "),
    city,
  ]);

  for (const q of queries) {
    for (const withPostcode of zip ? [true, false] : [false]) {
      const params = new URLSearchParams({ q, limit: "1" });
      if (withPostcode && zip) params.set("postcode", zip);
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?${params.toString()}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) continue;
        const data = await res.json();
        const feat = data?.features?.[0];
        const score = Number(feat?.properties?.score ?? 0);
        const coords = feat?.geometry?.coordinates;
        if (!Array.isArray(coords) || coords.length < 2 || score < 0.3) continue;
        return { lat: Number(coords[1]), lng: Number(coords[0]) };
      } catch {
        continue;
      }
    }
  }
  return null;
}

async function geocodeNominatim(address: {
  street?: string;
  zip?: string;
  city: string;
  country: string;
}) {
  const country = address.country?.trim() || FRANCE;
  const queries = uniqueQueries([
    geocodeQuery({ ...address, country }),
    [address.street, address.city, country].filter(Boolean).join(", "),
    [address.zip, address.city, country].filter(Boolean).join(", "),
    [address.city, country].filter(Boolean).join(", "),
  ]);

  for (const q of queries) {
    const params = new URLSearchParams({
      format: "json",
      limit: "1",
      q,
    });
    if (isFrance(country)) params.set("countrycodes", "fr");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "AurexLogistics/1.0 (logisticsaurex@gmail.com)",
        },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data?.[0]?.lat || !data?.[0]?.lon) continue;
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch {
      continue;
    }
  }
  return null;
}

export async function geocodeAddress(address: {
  street?: string;
  zip?: string;
  city: string;
  country: string;
}) {
  if (isFrance(address.country)) {
    const ban = await geocodeFranceBan(address);
    if (ban) return ban;
  }
  return geocodeNominatim(address);
}

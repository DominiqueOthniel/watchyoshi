import { NextResponse } from "next/server";
import { FRANCE, geocodeAddress } from "@/lib/address";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const address = {
      street: String(body?.street || "").trim(),
      zip: String(body?.zip || "").trim(),
      city: String(body?.city || "").trim(),
      country: String(body?.country || FRANCE).trim() || FRANCE,
    };
    if (!address.city) {
      return NextResponse.json({ error: "Ville requise" }, { status: 400 });
    }
    const coords = await geocodeAddress(address);
    if (!coords) {
      return NextResponse.json({ error: "Adresse introuvable" }, { status: 404 });
    }
    return NextResponse.json(coords);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Geocodage impossible" },
      { status: 500 }
    );
  }
}

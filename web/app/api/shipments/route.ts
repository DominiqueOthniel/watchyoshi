import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateTrackingId, transformShipmentFromDB, transformShipmentToDB } from "@/lib/shipments";
import type { Shipment } from "@/lib/types";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({
      shipments: (data || []).map((row) => transformShipmentFromDB(row)),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list shipments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const trackingId = generateTrackingId();

    const shipment: Partial<Shipment> = {
      trackingId,
      status: body.status || "pending",
      createdAt: now,
      updatedAt: now,
      sender: body.sender || {},
      recipient: body.recipient || {},
      package: body.package || {},
      service: body.service || {},
      events: [
        {
          status: body.status || "pending",
          title: "Shipment created",
          description: "Your shipment has been registered in CargoWatch.",
          location: body.sender?.address?.city,
          timestamp: now,
        },
      ],
      cost: body.cost || {
        base: 0,
        shipping: 0,
        insurance: 0,
        total: 0,
        currency: body.package?.currency || "USD",
      },
      estimatedDelivery: body.estimatedDelivery || null,
      currentLocation: {
        lat: body.sender?.address?.lat,
        lng: body.sender?.address?.lng,
        city: body.sender?.address?.city || "Origin",
      },
      autoProgress: {
        enabled: true,
        paused: false,
        pausedAt: null,
        pauseReason: null,
        pausedDuration: 0,
        startedAt: now,
        lastUpdate: now,
      },
    };

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("shipments")
      .insert([transformShipmentToDB(shipment)])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ shipment: transformShipmentFromDB(data) }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create shipment" },
      { status: 500 }
    );
  }
}

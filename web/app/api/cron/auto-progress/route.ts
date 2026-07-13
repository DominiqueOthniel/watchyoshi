import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { transformShipmentFromDB, transformShipmentToDB } from "@/lib/shipments";
import { calculateAutomaticProgression } from "@/lib/auto-progress";

export async function GET(request: Request) {
  return runCron(request);
}

export async function POST(request: Request) {
  return runCron(request);
}

async function runCron(request: Request) {
  const auth = request.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("shipments").select("*");
    if (error) throw error;

    let updated = 0;
    for (const row of data || []) {
      const shipment = transformShipmentFromDB(row);
      if (
        !shipment.autoProgress?.enabled ||
        shipment.autoProgress?.paused ||
        shipment.status === "delivered" ||
        shipment.status === "pending"
      ) {
        continue;
      }

      const autoPos = await calculateAutomaticProgression(shipment);
      if (!autoPos) continue;

      const nextStatus =
        autoPos.progress >= 1
          ? "delivered"
          : autoPos.progress >= 0.9
            ? "out_for_delivery"
            : shipment.status === "picked_up"
              ? "in_transit"
              : shipment.status;

      const autoProgress = {
        ...shipment.autoProgress,
        lastUpdate: new Date().toISOString(),
      };

      const patch = transformShipmentToDB({
        currentLocation: {
          lat: autoPos.lat,
          lng: autoPos.lng,
          city: autoPos.city,
        },
        autoProgress,
        status: nextStatus as never,
        updatedAt: new Date().toISOString(),
        ...(nextStatus === "delivered" ? { deliveredAt: new Date().toISOString() } : {}),
      });

      const { error: updateError } = await supabase
        .from("shipments")
        .update(patch)
        .eq("tracking_id", shipment.trackingId);

      if (!updateError) updated += 1;
    }

    return NextResponse.json({ ok: true, updated, total: data?.length || 0 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cron failed" },
      { status: 500 }
    );
  }
}

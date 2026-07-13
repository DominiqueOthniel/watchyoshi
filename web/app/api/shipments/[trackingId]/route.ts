import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { transformShipmentFromDB, transformShipmentToDB } from "@/lib/shipments";
import { calculateAutomaticProgression } from "@/lib/auto-progress";

interface Params {
  params: Promise<{ trackingId: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { trackingId } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_id", trackingId.toUpperCase())
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    let shipment = transformShipmentFromDB(data);

    // Refresh position on read when auto-progress is active
    if (
      shipment.autoProgress?.enabled &&
      !shipment.autoProgress?.paused &&
      shipment.status !== "delivered" &&
      shipment.status !== "pending"
    ) {
      const autoPos = await calculateAutomaticProgression(shipment);
      if (autoPos) {
        shipment = {
          ...shipment,
          currentLocation: {
            lat: autoPos.lat,
            lng: autoPos.lng,
            city: autoPos.city,
          },
          autoProgress: {
            ...shipment.autoProgress,
            lastUpdate: new Date().toISOString(),
          },
        };
        await supabase
          .from("shipments")
          .update(
            transformShipmentToDB({
              currentLocation: shipment.currentLocation,
              autoProgress: shipment.autoProgress,
              updatedAt: new Date().toISOString(),
            })
          )
          .eq("tracking_id", shipment.trackingId);
      }
    }

    return NextResponse.json({ shipment });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch shipment" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { trackingId } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: existing, error: fetchError } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_id", trackingId.toUpperCase())
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    const shipment = transformShipmentFromDB(existing);
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.status) {
      updates.status = body.status;
      const events = [
        ...(shipment.events || []),
        {
          status: body.status,
          title: `Status: ${body.status}`,
          description: body.note || `Status updated to ${body.status}`,
          timestamp: new Date().toISOString(),
          location: shipment.currentLocation?.city,
        },
      ];
      updates.events = events;
      if (body.status === "delivered") {
        updates.deliveredAt = new Date().toISOString();
      }
    }

    if (typeof body.pause === "boolean") {
      const auto = { ...shipment.autoProgress };
      if (body.pause && !auto.paused) {
        auto.paused = true;
        auto.pausedAt = new Date().toISOString();
        auto.pauseReason = body.pauseReason || "Paused by admin";
      } else if (!body.pause && auto.paused) {
        if (auto.pausedAt) {
          auto.pausedDuration += Date.now() - new Date(auto.pausedAt).getTime();
        }
        auto.paused = false;
        auto.pausedAt = null;
        auto.pauseReason = null;
      }
      updates.autoProgress = auto;
    }

    if (body.currentLocation) updates.currentLocation = body.currentLocation;

    const { data, error } = await supabase
      .from("shipments")
      .update(transformShipmentToDB(updates as never))
      .eq("tracking_id", trackingId.toUpperCase())
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ shipment: transformShipmentFromDB(data) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update shipment" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { trackingId } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("shipments")
      .delete()
      .eq("tracking_id", trackingId.toUpperCase());
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete shipment" },
      { status: 500 }
    );
  }
}

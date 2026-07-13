import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { transformShipmentFromDB, transformShipmentToDB } from "@/lib/shipments";
import { calculateAutomaticProgression } from "@/lib/auto-progress";
import {
  applyStatusChange,
  buildStatusEvent,
  statusFromProgress,
  statusRank,
} from "@/lib/shipment-status";
import type { Shipment, ShipmentStatus } from "@/lib/types";

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
    let routeProgress: number | null = null;
    let routeGeometry: [number, number][] | null = null;

    if (
      shipment.autoProgress?.enabled &&
      !shipment.autoProgress?.paused &&
      shipment.status !== "delivered" &&
      shipment.status !== "pending" &&
      shipment.status !== "exception"
    ) {
      // Ensure clock exists once movement has begun — never restart a healthy journey
      if (!shipment.autoProgress.startedAt) {
        shipment = {
          ...shipment,
          autoProgress: {
            ...shipment.autoProgress,
            startedAt: new Date().toISOString(),
          },
        };
      }

      const autoPos = await calculateAutomaticProgression(shipment);
      if (autoPos) {
        routeProgress = autoPos.progress;
        routeGeometry = autoPos.routeGeometry || null;

        const suggested = statusFromProgress(autoPos.progress, shipment.status);
        const statusChanged = suggested !== shipment.status;
        const events = statusChanged
          ? [...(shipment.events || []), buildStatusEvent(suggested, shipment)]
          : shipment.events;

        shipment = {
          ...shipment,
          status: suggested,
          events,
          currentLocation: {
            lat: autoPos.lat,
            lng: autoPos.lng,
            city: autoPos.city,
          },
          routeGeometry: autoPos.routeGeometry,
          routeDistanceMiles: autoPos.routeDistanceMiles,
          autoProgress: {
            ...shipment.autoProgress,
            lastUpdate: new Date().toISOString(),
          },
          ...(suggested === "delivered" ? { deliveredAt: new Date().toISOString() } : {}),
        };

        await supabase
          .from("shipments")
          .update(
            transformShipmentToDB({
              status: shipment.status,
              events: shipment.events,
              currentLocation: shipment.currentLocation,
              autoProgress: shipment.autoProgress,
              deliveredAt: shipment.deliveredAt,
              updatedAt: new Date().toISOString(),
            })
          )
          .eq("tracking_id", shipment.trackingId);
      }
    }

    return NextResponse.json({ shipment, routeProgress, routeGeometry });
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
    let updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.status) {
      const next = String(body.status) as ShipmentStatus;
      // Optional: block illegal backward jumps unless force=true
      if (
        !body.force &&
        next !== "exception" &&
        statusRank(next) < statusRank(shipment.status) &&
        shipment.status !== "exception"
      ) {
        return NextResponse.json(
          {
            error: `Cannot move from ${shipment.status} back to ${next}. Use force=true to override.`,
          },
          { status: 400 }
        );
      }

      const changed = applyStatusChange(shipment, next, {
        note: body.note,
        forceRestart: Boolean(body.forceRestart),
      });
      updates = { ...updates, ...changed };
    }

    if (typeof body.pause === "boolean") {
      const auto = {
        ...((updates.autoProgress as Shipment["autoProgress"]) || shipment.autoProgress),
      };
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

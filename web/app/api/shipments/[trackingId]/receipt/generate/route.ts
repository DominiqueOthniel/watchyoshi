import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { transformShipmentFromDB, transformShipmentToDB } from "@/lib/shipments";
import { generateReceiptPdfBuffer } from "@/lib/receipt-pdf";

interface Params {
  params: Promise<{ trackingId: string }>;
}

export async function POST(_request: Request, { params }: Params) {
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

    const shipment = transformShipmentFromDB(data);
    const pdfBuffer = await generateReceiptPdfBuffer(shipment);
    const filename = `receipt-${shipment.trackingId}-${Date.now()}.pdf`;

    // Ensure bucket exists (ignore error if already created)
    await supabase.storage.createBucket("receipts", { public: true }).catch(() => null);

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filename, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      // Fallback: store as data URL in DB if storage bucket is missing/private
      const base64 = pdfBuffer.toString("base64");
      const dataUrl = `data:application/pdf;base64,${base64}`;
      const { data: updated, error: updateError } = await supabase
        .from("shipments")
        .update(
          transformShipmentToDB({
            receipt: dataUrl,
            receiptUploadedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        )
        .eq("tracking_id", shipment.trackingId)
        .select()
        .single();

      if (updateError) throw updateError;

      return NextResponse.json({
        success: true,
        receipt: dataUrl,
        warning: `Storage upload failed (${uploadError.message}). Saved inline. Create a public 'receipts' bucket in Supabase Storage for better performance.`,
        shipment: transformShipmentFromDB(updated),
      });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("receipts").getPublicUrl(filename);

    const { data: updated, error: updateError } = await supabase
      .from("shipments")
      .update(
        transformShipmentToDB({
          receipt: publicUrl,
          receiptUploadedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      )
      .eq("tracking_id", shipment.trackingId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      receipt: publicUrl,
      shipment: transformShipmentFromDB(updated),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate receipt" },
      { status: 500 }
    );
  }
}

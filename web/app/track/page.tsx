import { Suspense } from "react";
import TrackClient from "@/components/TrackClient";

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Chargement…</div>}>
      <TrackClient />
    </Suspense>
  );
}

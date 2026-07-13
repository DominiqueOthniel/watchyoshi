import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Chargement…</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}

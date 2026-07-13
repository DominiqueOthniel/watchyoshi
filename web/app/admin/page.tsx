"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Shipment, ChatConversation, ShipmentStatus } from "@/lib/types";
import ChatPanel from "@/components/ChatPanel";
import { nextStatusInFlow, STATUS_FLOW, STATUS_META } from "@/lib/shipment-status";

type ReceiptRow = {
  trackingId: string;
  receipt: string | null;
  receiptUploadedAt?: string | null;
  status: string;
  sender?: string;
  recipient?: string;
};

function statusBadgeClass(status: string) {
  switch (status) {
    case "delivered":
      return "bg-success-50 text-success";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "exception":
      return "bg-error-50 text-error";
    case "out_for_delivery":
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-primary-50 text-primary";
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [tab, setTab] = useState<"shipments" | "chat" | "receipts">("shipments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusBusy, setStatusBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [sRes, cRes, rRes] = await Promise.all([
        fetch("/api/shipments"),
        fetch("/api/chat"),
        fetch("/api/receipts"),
      ]);
      const sData = await sRes.json();
      const cData = await cRes.json();
      const rData = await rRes.json();
      if (!sRes.ok) throw new Error(sData.error || "Failed to load shipments");
      if (!cRes.ok) throw new Error(cData.error || "Failed to load chats");
      if (!rRes.ok) throw new Error(rData.error || "Failed to load receipts");
      setShipments(sData.shipments || []);
      setChats(cData.chats || []);
      setReceipts(rData.receipts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter((s) =>
      ["in_transit", "picked_up", "out_for_delivery"].includes(s.status)
    ).length;
    const delivered = shipments.filter((s) => s.status === "delivered").length;
    const pending = shipments.filter((s) => s.status === "pending").length;
    return { total, inTransit, delivered, pending };
  }, [shipments]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function setStatus(
    trackingId: string,
    status: string,
    opts: { force?: boolean; forceRestart?: boolean } = {}
  ) {
    setStatusBusy(trackingId);
    setError(null);
    try {
      const res = await fetch(`/api/shipments/${trackingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          force: opts.force,
          forceRestart: opts.forceRestart,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status error");
    } finally {
      setStatusBusy(null);
    }
  }

  async function advanceStatus(shipment: Shipment) {
    const next = nextStatusInFlow(shipment.status);
    if (!next) return;
    await setStatus(shipment.trackingId, next);
  }

  async function togglePause(shipment: Shipment) {
    const res = await fetch(`/api/shipments/${shipment.trackingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pause: !shipment.autoProgress?.paused }),
    });
    if (res.ok) load();
  }

  async function generateReceipt(trackingId: string) {
    setBusyId(trackingId);
    setError(null);
    try {
      const res = await fetch(`/api/shipments/${trackingId}/receipt/generate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Receipt generation failed");
      await load();
      if (data.receipt && !String(data.receipt).startsWith("data:")) {
        window.open(data.receipt, "_blank");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Receipt error");
    } finally {
      setBusyId(null);
    }
  }

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-text-primary sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="text-sm text-text-secondary">
              Professional shipment lifecycle, receipts, and live support
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/create" className="btn-primary">
              Create Shipment
            </Link>
            <button onClick={logout} className="btn-secondary">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            ["Total", stats.total, "text-primary"],
            ["In Transit", stats.inTransit, "text-accent"],
            ["Delivered", stats.delivered, "text-success"],
            ["Pending", stats.pending, "text-text-secondary"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="rounded-2xl bg-white p-4 shadow-soft sm:p-5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted sm:text-xs">
                {label}
              </p>
              <p className={`mt-1 text-2xl font-bold sm:text-3xl ${color}`}>{value as number}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["shipments", "Shipments"],
              ["chat", `Chat (${chats.filter((c) => c.status !== "closed").length})`],
              ["receipts", `Receipts (${receipts.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 ${tab === key ? "btn-primary" : "btn-secondary"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-error-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}
        {loading && <p className="mt-4 text-sm text-text-muted">Loading…</p>}

        {tab === "shipments" && !loading && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-text-secondary">
              Lifecycle: Pending → Picked up → In transit → Out for delivery → Delivered. Use{" "}
              <strong>Advance</strong> for the next step. Status also advances automatically with
              map progress.
            </p>
            <div className="overflow-x-auto rounded-2xl bg-white shadow-large">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="border-b border-border bg-surface text-xs uppercase text-text-muted">
                  <tr>
                    <th className="px-4 py-3">Tracking</th>
                    <th className="px-4 py-3">Lifecycle</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Auto</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => {
                    const next = nextStatusInFlow(s.status);
                    const busy = statusBusy === s.trackingId;
                    const currentIdx = STATUS_FLOW.indexOf(s.status as ShipmentStatus);
                    return (
                      <tr key={s.id} className="border-b border-border/60 align-top">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-text-primary">{s.trackingId}</p>
                          <Link
                            href={`/track?id=${s.trackingId}`}
                            className="text-xs text-primary hover:underline"
                          >
                            Open tracking
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(s.status)}`}
                          >
                            {STATUS_META[s.status as ShipmentStatus]?.label || s.status}
                          </span>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {STATUS_FLOW.map((st, idx) => {
                              const active = s.status === st;
                              const done = currentIdx >= 0 && idx < currentIdx;
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  title={STATUS_META[st].label}
                                  disabled={busy || s.status === "exception"}
                                  onClick={() =>
                                    setStatus(s.trackingId, st, {
                                      force: currentIdx >= 0 && idx < currentIdx,
                                    })
                                  }
                                  className={`h-2 w-8 rounded-full transition ${
                                    active
                                      ? "bg-primary"
                                      : done
                                        ? "bg-primary/40"
                                        : "bg-border hover:bg-primary/20"
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {s.sender.address?.city || "?"} → {s.recipient.address?.city || "?"}
                        </td>
                        <td className="px-4 py-3">
                          {s.autoProgress?.paused
                            ? "Paused"
                            : s.autoProgress?.enabled
                              ? "On"
                              : "Off"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {next && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => advanceStatus(s)}
                                className="btn-primary px-3 py-1 text-xs disabled:opacity-60"
                              >
                                {busy ? "…" : `Advance → ${STATUS_META[next].label}`}
                              </button>
                            )}
                            {s.status !== "exception" && s.status !== "delivered" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => setStatus(s.trackingId, "exception")}
                                className="btn-secondary px-3 py-1 text-xs text-error disabled:opacity-60"
                              >
                                Exception
                              </button>
                            )}
                            {s.status === "exception" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  setStatus(s.trackingId, "in_transit", { force: true })
                                }
                                className="btn-primary px-3 py-1 text-xs disabled:opacity-60"
                              >
                                Resume transit
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => togglePause(s)}
                              className="btn-secondary px-3 py-1 text-xs"
                            >
                              {s.autoProgress?.paused ? "Resume auto" : "Pause auto"}
                            </button>
                            <button
                              type="button"
                              onClick={() => generateReceipt(s.trackingId)}
                              disabled={busyId === s.trackingId}
                              className="btn-secondary px-3 py-1 text-xs disabled:opacity-60"
                            >
                              {busyId === s.trackingId ? "PDF…" : s.receipt ? "Regen PDF" : "PDF"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {shipments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                        No shipments yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "chat" && !loading && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="rounded-2xl bg-white p-3 shadow-large">
              <ul className="max-h-[40vh] space-y-2 overflow-y-auto lg:max-h-none">
                {chats.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveChatId(c.id)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                        activeChatId === c.id ? "bg-primary-50 text-primary" : "hover:bg-surface"
                      }`}
                    >
                      <p className="font-medium text-text-primary">{c.clientName}</p>
                      <p className="truncate text-xs text-text-muted">{c.subject || c.status}</p>
                    </button>
                  </li>
                ))}
                {chats.length === 0 && (
                  <li className="px-2 py-6 text-center text-sm text-text-muted">No chats</li>
                )}
              </ul>
            </div>
            <div className="min-h-[420px] rounded-2xl bg-white p-4 shadow-large">
              {activeChat ? (
                <ChatPanel
                  conversationId={activeChat.id}
                  initialMessages={activeChat.messages}
                  senderType="admin"
                  senderName="Admin"
                  onClose={async () => {
                    await fetch(`/api/chat/${activeChat.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "closed" }),
                    });
                    load();
                    setActiveChatId(null);
                  }}
                />
              ) : (
                <p className="text-sm text-text-muted">Select a conversation</p>
              )}
            </div>
          </div>
        )}

        {tab === "receipts" && !loading && (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-large">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3">Tracking</th>
                  <th className="px-4 py-3">Parties</th>
                  <th className="px-4 py-3">Generated</th>
                  <th className="px-4 py-3">File</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.trackingId} className="border-b border-border/60">
                    <td className="px-4 py-3 font-semibold">{r.trackingId}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {r.sender || "?"} → {r.recipient || "?"}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {r.receiptUploadedAt ? new Date(r.receiptUploadedAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.receipt && !r.receipt.startsWith("data:") ? (
                        <a
                          href={r.receipt}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          Open PDF
                        </a>
                      ) : r.receipt ? (
                        <a
                          href={r.receipt}
                          download={`${r.trackingId}.pdf`}
                          className="text-primary hover:underline"
                        >
                          Download PDF
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-text-muted">
                      No receipts yet — generate one from the Shipments tab
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

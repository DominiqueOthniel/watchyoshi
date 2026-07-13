"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Shipment, ChatConversation } from "@/lib/types";
import ChatPanel from "@/components/ChatPanel";

export default function AdminDashboard() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [tab, setTab] = useState<"shipments" | "chat">("shipments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetch("/api/shipments"),
        fetch("/api/chat"),
      ]);
      const sData = await sRes.json();
      const cData = await cRes.json();
      if (!sRes.ok) throw new Error(sData.error || "Erreur shipments");
      if (!cRes.ok) throw new Error(cData.error || "Erreur chat");
      setShipments(sData.shipments || []);
      setChats(cData.chats || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
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

  async function updateStatus(trackingId: string, status: string) {
    const res = await fetch(`/api/shipments/${trackingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  async function togglePause(shipment: Shipment) {
    const res = await fetch(`/api/shipments/${shipment.trackingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pause: !shipment.autoProgress?.paused }),
    });
    if (res.ok) load();
  }

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950">Dashboard admin</h1>
          <p className="text-sm text-emerald-950/60">Envois, statuts et support live</p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-medium"
        >
          Déconnexion
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          ["Total", stats.total],
          ["En transit", stats.inTransit],
          ["Livrés", stats.delivered],
          ["Pending", stats.pending],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-emerald-900/10 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-950/45">{label}</p>
            <p className="mt-1 text-2xl font-bold text-emerald-950">{value as number}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-2">
        <button
          onClick={() => setTab("shipments")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === "shipments" ? "bg-emerald-800 text-white" : "bg-white border border-emerald-900/10"
          }`}
        >
          Envois
        </button>
        <button
          onClick={() => setTab("chat")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === "chat" ? "bg-emerald-800 text-white" : "bg-white border border-emerald-900/10"
          }`}
        >
          Chat ({chats.filter((c) => c.status !== "closed").length})
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="mt-4 text-sm text-emerald-950/50">Chargement…</p>}

      {tab === "shipments" && !loading && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-emerald-900/10 bg-white/80">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-emerald-900/10 bg-emerald-50/80 text-xs uppercase text-emerald-950/55">
              <tr>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Auto</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id} className="border-b border-emerald-900/5">
                  <td className="px-4 py-3 font-medium">{s.trackingId}</td>
                  <td className="px-4 py-3 capitalize">{s.status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-emerald-950/70">
                    {s.sender.address?.city || "?"} → {s.recipient.address?.city || "?"}
                  </td>
                  <td className="px-4 py-3">
                    {s.autoProgress?.paused ? "⏸️ Pause" : s.autoProgress?.enabled ? "▶️ On" : "Off"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <select
                        className="rounded-lg border border-emerald-900/15 px-2 py-1"
                        value={s.status}
                        onChange={(e) => updateStatus(s.trackingId, e.target.value)}
                      >
                        {[
                          "pending",
                          "picked_up",
                          "in_transit",
                          "out_for_delivery",
                          "delivered",
                          "exception",
                        ].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => togglePause(s)}
                        className="rounded-lg border border-emerald-900/15 px-2 py-1 hover:bg-emerald-50"
                      >
                        {s.autoProgress?.paused ? "Resume" : "Pause"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-emerald-950/45">
                    Aucun envoi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "chat" && !loading && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-emerald-900/10 bg-white/80 p-3">
            <ul className="space-y-2">
              {chats.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveChatId(c.id)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                      activeChatId === c.id ? "bg-emerald-100" : "hover:bg-emerald-50"
                    }`}
                  >
                    <p className="font-medium">{c.clientName}</p>
                    <p className="truncate text-xs text-emerald-950/55">{c.subject || c.status}</p>
                  </button>
                </li>
              ))}
              {chats.length === 0 && (
                <li className="px-2 py-6 text-center text-sm text-emerald-950/45">Aucun chat</li>
              )}
            </ul>
          </div>
          <div className="min-h-[420px] rounded-2xl border border-emerald-900/10 bg-white/80 p-4">
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
              <p className="text-sm text-emerald-950/45">Sélectionnez une conversation</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

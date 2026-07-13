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
      const [sRes, cRes] = await Promise.all([fetch("/api/shipments"), fetch("/api/chat")]);
      const sData = await sRes.json();
      const cData = await cRes.json();
      if (!sRes.ok) throw new Error(sData.error || "Failed to load shipments");
      if (!cRes.ok) throw new Error(cData.error || "Failed to load chats");
      setShipments(sData.shipments || []);
      setChats(cData.chats || []);
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
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-sm text-text-secondary">Shipments, statuses, and live support</p>
          </div>
          <button onClick={logout} className="btn-secondary">
            Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ["Total", stats.total, "text-primary"],
            ["In Transit", stats.inTransit, "text-accent"],
            ["Delivered", stats.delivered, "text-success"],
            ["Pending", stats.pending, "text-text-secondary"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="rounded-2xl bg-white p-5 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
              <p className={`mt-1 text-3xl font-bold ${color}`}>{value as number}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setTab("shipments")}
            className={tab === "shipments" ? "btn-primary" : "btn-secondary"}
          >
            Shipments
          </button>
          <button
            onClick={() => setTab("chat")}
            className={tab === "chat" ? "btn-primary" : "btn-secondary"}
          >
            Chat ({chats.filter((c) => c.status !== "closed").length})
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-error-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}
        {loading && <p className="mt-4 text-sm text-text-muted">Loading…</p>}

        {tab === "shipments" && !loading && (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-large">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3">Tracking</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Auto</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="border-b border-border/60">
                    <td className="px-4 py-3 font-semibold text-text-primary">{s.trackingId}</td>
                    <td className="px-4 py-3 capitalize text-text-secondary">
                      {s.status.replaceAll("_", " ")}
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
                        <select
                          className="input-field px-2 py-1"
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
                        <button onClick={() => togglePause(s)} className="btn-secondary px-3 py-1 text-xs">
                          {s.autoProgress?.paused ? "Resume" : "Pause"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
        )}

        {tab === "chat" && !loading && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="rounded-2xl bg-white p-3 shadow-large">
              <ul className="space-y-2">
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
      </div>
    </div>
  );
}

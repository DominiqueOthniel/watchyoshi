"use client";

import { FormEvent, useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import type { ChatConversation } from "@/lib/types";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [chat, setChat] = useState<ChatConversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startChat(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          subject,
          trackingId: trackingId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible de démarrer le chat");
      setChat(data.chat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary">Support</h1>
      <p className="mt-2 text-text-secondary">
        Discutez en direct avec l&apos;équipe CargoWatch (Supabase Realtime).
      </p>

      {!chat ? (
        <form
          onSubmit={startChat}
          className="mt-8 space-y-3 rounded-2xl border card p-6"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            required
            className="w-full rounded-xl input-field border px-3 py-2.5 "
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-xl input-field border px-3 py-2.5 "
          />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet"
            className="w-full rounded-xl input-field border px-3 py-2.5 "
          />
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Tracking ID (optionnel)"
            className="w-full rounded-xl input-field border px-3 py-2.5 "
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-5 py-3 disabled:opacity-60"
          >
            {loading ? "Ouverture…" : "Démarrer le chat"}
          </button>
        </form>
      ) : (
        <div className="mt-8 min-h-[480px] rounded-2xl border card p-4">
          <ChatPanel
            conversationId={chat.id}
            initialMessages={chat.messages}
            senderType="client"
            senderName={name}
          />
        </div>
      )}

      <section className="mt-10 rounded-2xl border card p-6">
        <h2 className="font-semibold text-text-primary">FAQ rapide</h2>
        <ul className="mt-3 space-y-2 text-sm text-text-secondary">
          <li>Le tracking ID commence par <strong>CW</strong>.</li>
          <li>La position se met à jour automatiquement quand l&apos;envoi est en transit.</li>
          <li>Pour toute urgence, indiquez votre tracking ID dans le chat.</li>
        </ul>
      </section>
    </div>
  );
}

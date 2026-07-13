"use client";

import { FormEvent, useEffect, useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import {
  clearChatSession,
  loadChatSession,
  saveChatSession,
} from "@/lib/chat-session";
import type { ChatConversation } from "@/lib/types";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [chat, setChat] = useState<ChatConversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const session = loadChatSession();
      if (!session) {
        if (!cancelled) setRestoring(false);
        return;
      }

      setName(session.clientName);
      setEmail(session.clientEmail);
      if (session.subject) setSubject(session.subject);
      if (session.trackingId) setTrackingId(session.trackingId);

      try {
        const res = await fetch(`/api/chat/${session.chatId}`);
        const data = await res.json();
        if (!res.ok || !data.chat || data.chat.status === "closed") {
          clearChatSession();
          return;
        }
        if (!cancelled) setChat(data.chat);
      } catch {
        // ignore — form remains available
      } finally {
        if (!cancelled) setRestoring(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

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
      if (!res.ok) throw new Error(data.error || "Could not start chat");
      setChat(data.chat);
      saveChatSession({
        chatId: data.chat.id,
        clientName: name,
        clientEmail: email,
        subject: subject || "Support",
        trackingId: trackingId || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  function endLocalSession() {
    clearChatSession();
    setChat(null);
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold text-text-primary lg:text-5xl">
            How can we <span className="text-gradient-primary">help you</span> today?
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-text-secondary">
            Find answers, get support, and discover resources to make your shipping experience
            seamless.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn-primary">
              Contact Support
            </a>
            <a href="#faq" className="btn-secondary">
              Browse FAQ
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-3xl font-bold text-text-primary">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Where do I find my tracking ID?",
                a: "Your tracking ID starts with CW and was sent in your confirmation email or shipment receipt.",
              },
              {
                q: "How often is my location updated?",
                a: "In-transit shipments refresh automatically. You can also reopen the tracking page anytime for the latest position.",
              },
              {
                q: "How do I contact support?",
                a: "Use the live chat below with your name, email, and optional tracking ID.",
              },
            ].map((item) => (
              <div key={item.q} className="card p-5">
                <h3 className="font-semibold text-text-primary">{item.q}</h3>
                <p className="mt-2 text-sm text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-3xl font-bold text-text-primary">Live Support Chat</h2>
          <p className="mb-8 text-center text-text-secondary">
            Chat in realtime with the CargoWatch team. Your conversation stays saved on this device.
          </p>

          {restoring ? (
            <div className="card p-8 text-center text-sm text-text-muted">
              Restoring your conversation…
            </div>
          ) : !chat ? (
            <form onSubmit={startChat} className="card space-y-4 p-6 sm:p-8">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="input-field px-4 py-3"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="input-field px-4 py-3"
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="input-field px-4 py-3"
              />
              <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Tracking ID (optional)"
                className="input-field px-4 py-3"
              />
              {error && (
                <div className="rounded-lg border border-red-200 bg-error-50 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
                {loading ? "Opening…" : "Start Chat"}
              </button>
            </form>
          ) : (
            <div className="card min-h-[480px] p-4 sm:p-6">
              <ChatPanel
                conversationId={chat.id}
                initialMessages={chat.messages}
                senderType="client"
                senderName={name || chat.clientName}
                onClose={endLocalSession}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

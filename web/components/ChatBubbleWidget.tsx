"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ChatPanel from "@/components/ChatPanel";
import type { ChatConversation } from "@/lib/types";

export default function ChatBubbleWidget() {
  const pathname = usePathname();
  const hideOnAdmin = pathname?.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [chat, setChat] = useState<ChatConversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Close widget when navigating to admin
    if (hideOnAdmin) setOpen(false);
  }, [hideOnAdmin]);

  if (hideOnAdmin) return null;

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
          subject: subject || "Live support",
          trackingId: trackingId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start chat");
      setChat(data.chat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-5 sm:right-5">
          <button
            type="button"
            aria-label="Open live chat support"
            onClick={() => setOpen(true)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-700 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition hover:scale-105 sm:h-16 sm:w-16"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="pointer-events-none absolute -inset-1 animate-pulse-soft rounded-full bg-primary/30" />
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-3 z-[9999] flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-large sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(640px,85vh)] sm:w-[min(400px,92vw)]">
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary-700 px-4 py-3 text-white">
            <div>
              <p className="font-semibold">CargoWatch Support</p>
              <p className="text-xs text-white/80">We typically reply instantly</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {!chat ? (
              <form onSubmit={startChat} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="input-field px-3 py-2.5"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="input-field px-3 py-2.5"
                />
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help?"
                  className="input-field px-3 py-2.5"
                />
                <input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Tracking ID (optional)"
                  className="input-field px-3 py-2.5"
                />
                {error && (
                  <div className="rounded-lg border border-red-200 bg-error-50 px-3 py-2 text-sm text-error">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary mt-auto w-full py-3 disabled:opacity-60"
                >
                  {loading ? "Starting…" : "Start Chat"}
                </button>
              </form>
            ) : (
              <div className="min-h-0 flex-1 p-3">
                <ChatPanel
                  conversationId={chat.id}
                  initialMessages={chat.messages}
                  senderType="client"
                  senderName={name}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

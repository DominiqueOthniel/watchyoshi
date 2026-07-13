"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  conversationId: string;
  initialMessages?: ChatMessage[];
  senderType: "client" | "admin";
  senderName: string;
  onClose?: () => void;
}

export default function ChatPanel({
  conversationId,
  initialMessages = [],
  senderType,
  senderName,
  onClose,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const msg: ChatMessage = {
            id: String(row.id),
            text: String(row.text),
            image: (row.image as string) || null,
            senderType: row.sender_type as "client" | "admin",
            senderName: (row.sender_name as string) || null,
            timestamp: String(row.created_at),
            read: Boolean(row.read),
          };
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/chat/${conversationId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), senderType, senderName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Envoi échoué");
      setText("");
      if (data.message) {
        setMessages((prev) =>
          prev.some((m) => m.id === data.message.id) ? prev : [...prev, data.message]
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-[400px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Conversation</h3>
        {onClose && (
          <button onClick={onClose} className="text-xs text-primary hover:underline">
            Fermer le chat
          </button>
        )}
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-primary-50 p-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.senderType === senderType
                ? "ml-auto bg-primary text-white"
                : "bg-white border border-border text-text-primary"
            }`}
          >
            <p className="text-[10px] opacity-70">{m.senderName || m.senderType}</p>
            <p>{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Votre message…"
          className="flex-1 rounded-xl border border-emerald-900/15 px-3 py-2 outline-none ring-primary focus:ring-2"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

import { promises as fs } from "fs";
import path from "path";
import type { ChatConversation, ChatMessage, Shipment } from "@/lib/types";

export type DataState = {
  shipments: Shipment[];
  chats: ChatConversation[];
};

const EMPTY: DataState = { shipments: [], chats: [] };
const LOCAL_FILE = path.join(process.cwd(), "data", "store.json");
const TMP_FILE = path.join("/tmp", "aurex-store.json");

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function normalize(raw: unknown): DataState {
  if (!raw || typeof raw !== "object") return { shipments: [], chats: [] };
  const data = raw as Partial<DataState>;
  return {
    shipments: Array.isArray(data.shipments) ? data.shipments : [],
    chats: Array.isArray(data.chats) ? data.chats : [],
  };
}

async function readJsonFile(file: string): Promise<DataState | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return normalize(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function writeJsonFile(file: string, state: DataState) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(state), "utf8");
}

async function readBlobs(): Promise<DataState | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("aurex-data");
    const data = await store.get("state", { type: "json" });
    if (!data) return { shipments: [], chats: [] };
    return normalize(data);
  } catch {
    return null;
  }
}

async function writeBlobs(state: DataState): Promise<boolean> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("aurex-data");
    await store.setJSON("state", state);
    return true;
  } catch {
    return false;
  }
}

async function load(): Promise<DataState> {
  if (process.env.NETLIFY) {
    const blob = await readBlobs();
    if (blob) return blob;
    const tmp = await readJsonFile(TMP_FILE);
    if (tmp) return tmp;
  }
  return (await readJsonFile(LOCAL_FILE)) || { ...EMPTY, shipments: [], chats: [] };
}

async function save(state: DataState) {
  if (process.env.NETLIFY) {
    const ok = await writeBlobs(state);
    if (ok) return;
    await writeJsonFile(TMP_FILE, state);
    return;
  }
  await writeJsonFile(LOCAL_FILE, state);
}

export async function readState(): Promise<DataState> {
  return load();
}

export async function updateState<T>(fn: (state: DataState) => T | Promise<T>): Promise<T> {
  return enqueue(async () => {
    const state = await load();
    const result = await fn(state);
    await save(state);
    return result;
  });
}

export function findShipment(state: DataState, trackingId: string) {
  const id = trackingId.toUpperCase();
  return state.shipments.find((s) => s.trackingId.toUpperCase() === id) || null;
}

export function upsertShipment(state: DataState, shipment: Shipment) {
  const id = shipment.trackingId.toUpperCase();
  const idx = state.shipments.findIndex((s) => s.trackingId.toUpperCase() === id);
  if (idx >= 0) state.shipments[idx] = shipment;
  else state.shipments.unshift(shipment);
}

export function removeShipment(state: DataState, trackingId: string) {
  const id = trackingId.toUpperCase();
  state.shipments = state.shipments.filter((s) => s.trackingId.toUpperCase() !== id);
}

export function findChat(state: DataState, chatId: string) {
  return state.chats.find((c) => c.id === chatId) || null;
}

export function upsertChat(state: DataState, chat: ChatConversation) {
  const idx = state.chats.findIndex((c) => c.id === chat.id);
  if (idx >= 0) state.chats[idx] = chat;
  else state.chats.unshift(chat);
}

export function newId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function newMessage(
  text: string,
  senderType: ChatMessage["senderType"],
  senderName?: string | null,
  image?: string | null
): ChatMessage {
  return {
    id: newId("msg"),
    text,
    image: image || null,
    senderType,
    senderName: senderName || null,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

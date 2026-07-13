export type UserRole = "admin" | "client" | "user";

export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface AutoProgress {
  enabled: boolean;
  paused: boolean;
  pausedAt: string | null;
  pauseReason: string | null;
  pausedDuration: number;
  startedAt: string | null;
  lastUpdate: string | null;
}

export interface ShipmentEvent {
  status?: string;
  title?: string;
  description?: string;
  location?: string;
  timestamp?: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string | null;
  sender: {
    name?: string;
    email?: string;
    phone?: string;
    address?: Address;
  };
  recipient: {
    name?: string;
    email?: string;
    phone?: string;
    address?: Address;
  };
  package: {
    type?: string;
    weight?: number;
    dimensions?: Record<string, unknown>;
    description?: string;
    value?: number;
    currency?: string;
    vehicle?: Record<string, unknown>;
  };
  service: {
    type?: string;
    priority?: string;
    insurance?: boolean;
  };
  events: ShipmentEvent[];
  cost: {
    base?: number;
    shipping?: number;
    insurance?: number;
    total?: number;
    currency?: string;
  };
  estimatedDelivery?: string | null;
  currentLocation?: Address & { city?: string };
  autoProgress: AutoProgress;
  receipt?: string | null;
  receiptUploadedAt?: string | null;
  routeGeometry?: [number, number][];
  routeDistanceMiles?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  image?: string | null;
  senderType: "client" | "admin";
  senderName?: string | null;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  clientName: string;
  clientEmail: string;
  subject?: string | null;
  trackingId?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string | null;
  messages: ChatMessage[];
}

export interface AppUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}

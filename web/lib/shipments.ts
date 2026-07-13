import type { Shipment } from "./types";

type DbShipment = Record<string, unknown>;

export function transformShipmentToDB(shipment: Partial<Shipment> & { trackingId?: string }) {
  const row: DbShipment = {};

  if (shipment.id) row.id = shipment.id;
  if (shipment.trackingId) row.tracking_id = shipment.trackingId;
  if (shipment.status) row.status = shipment.status;
  if (shipment.createdAt) row.created_at = shipment.createdAt;
  if (shipment.updatedAt) row.updated_at = shipment.updatedAt;
  if (shipment.deliveredAt !== undefined) row.delivered_at = shipment.deliveredAt;

  if (shipment.sender) {
    if (shipment.sender.name !== undefined) row.sender_name = shipment.sender.name;
    if (shipment.sender.email !== undefined) row.sender_email = shipment.sender.email;
    if (shipment.sender.phone !== undefined) row.sender_phone = shipment.sender.phone;
    if (shipment.sender.address !== undefined) row.sender_address = shipment.sender.address;
  }

  if (shipment.recipient) {
    if (shipment.recipient.name !== undefined) row.recipient_name = shipment.recipient.name;
    if (shipment.recipient.email !== undefined) row.recipient_email = shipment.recipient.email;
    if (shipment.recipient.phone !== undefined) row.recipient_phone = shipment.recipient.phone;
    if (shipment.recipient.address !== undefined) row.recipient_address = shipment.recipient.address;
  }

  if (shipment.package) {
    if (shipment.package.type !== undefined) row.package_type = shipment.package.type;
    if (shipment.package.weight !== undefined) row.package_weight = shipment.package.weight;
    if (shipment.package.dimensions !== undefined) row.package_dimensions = shipment.package.dimensions;
    if (shipment.package.description !== undefined) row.package_description = shipment.package.description;
    if (shipment.package.value !== undefined) row.package_value = shipment.package.value;
    if (shipment.package.currency !== undefined) row.package_currency = shipment.package.currency;
    if (shipment.package.vehicle !== undefined) row.package_vehicle = shipment.package.vehicle;
  }

  if (shipment.service) {
    if (shipment.service.type !== undefined) row.service_type = shipment.service.type;
    if (shipment.service.priority !== undefined) row.service_priority = shipment.service.priority;
    if (shipment.service.insurance !== undefined) row.service_insurance = shipment.service.insurance;
  }

  if (shipment.events !== undefined) row.events = shipment.events;

  if (shipment.cost) {
    if (shipment.cost.base !== undefined) row.cost_base = shipment.cost.base;
    if (shipment.cost.shipping !== undefined) row.cost_shipping = shipment.cost.shipping;
    if (shipment.cost.insurance !== undefined) row.cost_insurance = shipment.cost.insurance;
    if (shipment.cost.total !== undefined) row.cost_total = shipment.cost.total;
    if (shipment.cost.currency !== undefined) row.cost_currency = shipment.cost.currency;
  }

  if (shipment.estimatedDelivery !== undefined) row.estimated_delivery = shipment.estimatedDelivery;
  if (shipment.currentLocation !== undefined) row.current_location = shipment.currentLocation;
  if (shipment.autoProgress !== undefined) row.auto_progress = shipment.autoProgress;
  if (shipment.receipt !== undefined) row.receipt = shipment.receipt;
  if (shipment.receiptUploadedAt !== undefined) row.receipt_uploaded_at = shipment.receiptUploadedAt;

  return row;
}

export function transformShipmentFromDB(db: DbShipment): Shipment {
  const auto = (db.auto_progress as Shipment["autoProgress"]) || {
    enabled: true,
    paused: false,
    pausedAt: null,
    pauseReason: null,
    pausedDuration: 0,
    startedAt: null,
    lastUpdate: null,
  };

  return {
    id: String(db.id),
    trackingId: String(db.tracking_id),
    status: db.status as Shipment["status"],
    createdAt: String(db.created_at),
    updatedAt: String(db.updated_at),
    deliveredAt: (db.delivered_at as string) || null,
    sender: {
      name: db.sender_name as string | undefined,
      email: db.sender_email as string | undefined,
      phone: db.sender_phone as string | undefined,
      address: (db.sender_address as Shipment["sender"]["address"]) || {},
    },
    recipient: {
      name: db.recipient_name as string | undefined,
      email: db.recipient_email as string | undefined,
      phone: db.recipient_phone as string | undefined,
      address: (db.recipient_address as Shipment["recipient"]["address"]) || {},
    },
    package: {
      type: db.package_type as string | undefined,
      weight: db.package_weight as number | undefined,
      dimensions: (db.package_dimensions as Record<string, unknown>) || {},
      description: db.package_description as string | undefined,
      value: db.package_value as number | undefined,
      currency: (db.package_currency as string) || "USD",
      vehicle: (db.package_vehicle as Record<string, unknown>) || {},
    },
    service: {
      type: db.service_type as string | undefined,
      priority: db.service_priority as string | undefined,
      insurance: Boolean(db.service_insurance),
    },
    events: (db.events as Shipment["events"]) || [],
    cost: {
      base: db.cost_base as number | undefined,
      shipping: db.cost_shipping as number | undefined,
      insurance: db.cost_insurance as number | undefined,
      total: db.cost_total as number | undefined,
      currency: (db.cost_currency as string) || "USD",
    },
    estimatedDelivery: (db.estimated_delivery as string) || null,
    currentLocation: (db.current_location as Shipment["currentLocation"]) || {},
    autoProgress: auto,
    receipt: (db.receipt as string) || null,
    receiptUploadedAt: (db.receipt_uploaded_at as string) || null,
  };
}

export function generateTrackingId(): string {
  const part = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CW${part()}${part()}`;
}

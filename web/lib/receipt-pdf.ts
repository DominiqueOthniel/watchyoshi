import { PDFDocument, StandardFonts, rgb, RGB, PDFFont, PDFPage } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import type { Shipment } from "./types";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;

function hex(r: number, g: number, b: number) {
  return rgb(r / 255, g / 255, b / 255);
}

const C = {
  primary: hex(37, 99, 235),
  primaryDark: hex(30, 64, 175),
  white: rgb(1, 1, 1),
  ink: hex(15, 23, 42),
  muted: hex(100, 116, 139),
  light: hex(248, 250, 252),
  border: hex(226, 232, 240),
  blueSoft: hex(239, 246, 255),
  green: hex(5, 150, 105),
  greenSoft: hex(236, 253, 245),
  amber: hex(217, 119, 6),
  amberSoft: hex(255, 251, 235),
  red: hex(220, 38, 38),
  redSoft: hex(254, 242, 242),
  indigo: hex(99, 102, 241),
  indigoSoft: hex(238, 242, 255),
};

function currencySymbol(code?: string) {
  const map: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    XAF: "FCFA ",
    XOF: "CFA ",
    CAD: "CA$",
    CHF: "CHF ",
  };
  return map[(code || "USD").toUpperCase()] || `${(code || "USD").toUpperCase()} `;
}

function money(n: number | undefined, symbol: string) {
  const v = Number(n ?? 0);
  return `${symbol}${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(value?: string | null) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function safe(v?: string | number | null, fallback = "N/A") {
  if (v == null || String(v).trim() === "") return fallback;
  return String(v);
}

function statusMeta(status: string) {
  switch (status) {
    case "delivered":
      return {
        label: "DELIVERED",
        color: C.green,
        soft: C.greenSoft,
        title: "Successfully delivered",
        text: "This shipment has been delivered to the recipient.",
      };
    case "out_for_delivery":
      return {
        label: "OUT FOR DELIVERY",
        color: C.amber,
        soft: C.amberSoft,
        title: "Out for delivery",
        text: "The package is with the courier and will arrive soon.",
      };
    case "in_transit":
      return {
        label: "IN TRANSIT",
        color: C.primary,
        soft: C.blueSoft,
        title: "Package in transit",
        text: "Your shipment is on the way. Tracking updates continue automatically.",
      };
    case "picked_up":
      return {
        label: "PICKED UP",
        color: C.indigo,
        soft: C.indigoSoft,
        title: "Package picked up",
        text: "The shipment has been collected and entered the logistics network.",
      };
    case "exception":
      return {
        label: "EXCEPTION",
        color: C.red,
        soft: C.redSoft,
        title: "Action required",
        text: "An exception occurred. Please contact CargoWatch support immediately.",
      };
    default:
      return {
        label: "PENDING",
        color: C.red,
        soft: C.redSoft,
        title: "Awaiting pickup",
        text: "This shipment is registered and waiting to be picked up.",
      };
  }
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color: RGB,
  maxWidth?: number
) {
  const content = maxWidth
    ? truncateToWidth(text, font, size, maxWidth)
    : text;
  page.drawText(content, { x, y, size, font, color });
}

function truncateToWidth(text: string, font: PDFFont, size: number, maxWidth: number) {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && font.widthOfTextAtSize(`${t}…`, size) > maxWidth) {
    t = t.slice(0, -1);
  }
  return `${t}…`;
}

function addressOf(party?: Shipment["sender"]) {
  if (!party?.address) return "N/A";
  return (
    [
      party.address.street,
      party.address.city,
      party.address.state,
      party.address.zip,
      party.address.country,
    ]
      .filter(Boolean)
      .join(", ") || "N/A"
  );
}

export async function generateReceiptPdfBuffer(shipment: Shipment): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`CargoWatch Receipt — ${shipment.trackingId}`);
  pdfDoc.setAuthor("CargoWatch");
  pdfDoc.setSubject("Official shipment receipt");
  pdfDoc.setCreator("CargoWatch Logistics Platform");

  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const status = shipment.status || "pending";
  const meta = statusMeta(status);
  const symbol = currencySymbol(shipment.cost?.currency || shipment.package?.currency);
  const generatedAt = new Date().toISOString();
  const docId = `CW-RCPT-${shipment.trackingId}-${Date.now().toString().slice(-6)}`;

  // ===== HEADER =====
  page.drawRectangle({ x: 0, y: PAGE_H - 108, width: PAGE_W, height: 108, color: C.primary });
  page.drawRectangle({ x: 0, y: PAGE_H - 112, width: PAGE_W, height: 4, color: C.primaryDark });

  // Try logo
  try {
    const logoPath = path.join(process.cwd(), "public", "delivery-truck-logo.png");
    const logoBytes = await readFile(logoPath);
    const logo = await pdfDoc.embedPng(logoBytes);
    const logoH = 36;
    const logoW = (logo.width / logo.height) * logoH;
    page.drawImage(logo, {
      x: MARGIN,
      y: PAGE_H - 78,
      width: logoW,
      height: logoH,
    });
    drawText(page, "CargoWatch", MARGIN + logoW + 10, PAGE_H - 58, 22, fontBold, C.white);
  } catch {
    drawText(page, "CargoWatch", MARGIN, PAGE_H - 58, 24, fontBold, C.white);
  }

  drawText(page, "Your cargo. Our watch. Every mile.", MARGIN, PAGE_H - 78, 9, font, hex(191, 219, 254));
  drawText(page, "OFFICIAL SHIPMENT RECEIPT", PAGE_W - MARGIN - 190, PAGE_H - 52, 11, fontBold, C.white);
  drawText(page, docId, PAGE_W - MARGIN - 190, PAGE_H - 68, 8, font, hex(191, 219, 254));

  let y = PAGE_H - 140;

  // ===== TRACKING BOX =====
  page.drawRectangle({
    x: MARGIN,
    y: y - 28,
    width: PAGE_W - MARGIN * 2,
    height: 54,
    color: C.blueSoft,
    borderColor: C.primary,
    borderWidth: 1.5,
  });
  drawText(page, "TRACKING NUMBER", MARGIN + 16, y + 8, 9, font, C.primary);
  drawText(page, shipment.trackingId, MARGIN + 16, y - 14, 22, fontBold, C.ink);

  y -= 70;

  // ===== STATUS + DATES =====
  drawText(page, "Shipment Information", MARGIN, y, 13, fontBold, C.primary);
  y -= 22;

  const badgeLabel = meta.label;
  const badgeW = fontBold.widthOfTextAtSize(badgeLabel, 10) + 20;
  page.drawRectangle({
    x: MARGIN,
    y: y - 4,
    width: badgeW,
    height: 18,
    color: meta.color,
  });
  drawText(page, badgeLabel, MARGIN + 10, y, 10, fontBold, C.white);

  y -= 28;
  const col = (PAGE_W - MARGIN * 2) / 2;
  drawText(page, "Created", MARGIN, y, 8, font, C.muted);
  drawText(page, "Last updated", MARGIN + col, y, 8, font, C.muted);
  y -= 14;
  drawText(page, fmtDate(shipment.createdAt), MARGIN, y, 10, fontBold, C.ink);
  drawText(page, fmtDate(shipment.updatedAt), MARGIN + col, y, 10, fontBold, C.ink);
  y -= 18;
  drawText(page, "Estimated delivery", MARGIN, y, 8, font, C.muted);
  drawText(
    page,
    status === "delivered" ? "Delivered at" : "Current location",
    MARGIN + col,
    y,
    8,
    font,
    C.muted
  );
  y -= 14;
  drawText(page, fmtDate(shipment.estimatedDelivery), MARGIN, y, 10, fontBold, C.ink);
  drawText(
    page,
    status === "delivered"
      ? fmtDate(shipment.deliveredAt)
      : safe(shipment.currentLocation?.city, "In network"),
    MARGIN + col,
    y,
    10,
    fontBold,
    C.ink
  );

  // Status message banner
  y -= 28;
  page.drawRectangle({
    x: MARGIN,
    y: y - 18,
    width: PAGE_W - MARGIN * 2,
    height: 36,
    color: meta.soft,
    borderColor: meta.color,
    borderWidth: 1,
  });
  drawText(page, meta.title, MARGIN + 12, y + 2, 10, fontBold, meta.color);
  drawText(page, meta.text, MARGIN + 12, y - 12, 8, font, C.ink, PAGE_W - MARGIN * 2 - 24);

  // ===== SENDER / RECIPIENT CARDS =====
  y -= 50;
  const cardW = (PAGE_W - MARGIN * 2 - 14) / 2;
  const cardH = 128;
  const cardY = y - cardH;

  function partyCard(
    x: number,
    title: string,
    name: string,
    email: string,
    phone: string,
    address: string
  ) {
    page.drawRectangle({
      x,
      y: cardY,
      width: cardW,
      height: cardH,
      color: C.light,
      borderColor: C.border,
      borderWidth: 1,
    });
    drawText(page, title, x + 12, cardY + cardH - 18, 11, fontBold, C.primary);
    page.drawRectangle({
      x: x + 12,
      y: cardY + cardH - 26,
      width: cardW - 24,
      height: 0.8,
      color: C.border,
    });
    drawText(page, name, x + 12, cardY + cardH - 44, 11, fontBold, C.ink, cardW - 24);
    drawText(page, "Email", x + 12, cardY + cardH - 60, 7, font, C.muted);
    drawText(page, email, x + 12, cardY + cardH - 72, 9, font, C.ink, cardW - 24);
    drawText(page, "Phone", x + 12, cardY + cardH - 86, 7, font, C.muted);
    drawText(page, phone, x + 12, cardY + cardH - 98, 9, font, C.ink, cardW - 24);
    drawText(page, "Address", x + 12, cardY + cardH - 112, 7, font, C.muted);
    drawText(page, address, x + 12, cardY + 8, 8, font, C.ink, cardW - 24);
  }

  partyCard(
    MARGIN,
    "SENDER",
    safe(shipment.sender?.name),
    safe(shipment.sender?.email),
    safe(shipment.sender?.phone),
    addressOf(shipment.sender)
  );
  partyCard(
    MARGIN + cardW + 14,
    "RECIPIENT",
    safe(shipment.recipient?.name),
    safe(shipment.recipient?.email),
    safe(shipment.recipient?.phone),
    addressOf(shipment.recipient)
  );

  y = cardY - 24;

  // ===== PACKAGE =====
  drawText(page, "Package Details", MARGIN, y, 13, fontBold, C.primary);
  y -= 12;
  const pkgH = 78;
  page.drawRectangle({
    x: MARGIN,
    y: y - pkgH,
    width: PAGE_W - MARGIN * 2,
    height: pkgH,
    color: C.light,
    borderColor: C.border,
    borderWidth: 1,
  });
  const pkgTop = y - 16;
  drawText(page, "Type", MARGIN + 14, pkgTop, 7, font, C.muted);
  drawText(page, safe(shipment.package?.type), MARGIN + 14, pkgTop - 12, 10, fontBold, C.ink);
  drawText(page, "Weight", MARGIN + 150, pkgTop, 7, font, C.muted);
  drawText(
    page,
    `${safe(shipment.package?.weight)} kg`,
    MARGIN + 150,
    pkgTop - 12,
    10,
    fontBold,
    C.ink
  );
  drawText(page, "Service", MARGIN + 280, pkgTop, 7, font, C.muted);
  drawText(
    page,
    `${safe(shipment.service?.type)} / ${safe(shipment.service?.priority)}`,
    MARGIN + 280,
    pkgTop - 12,
    10,
    fontBold,
    C.ink,
    220
  );
  drawText(page, "Description", MARGIN + 14, pkgTop - 34, 7, font, C.muted);
  drawText(
    page,
    safe(shipment.package?.description, "No description provided"),
    MARGIN + 14,
    pkgTop - 48,
    9,
    font,
    C.ink,
    PAGE_W - MARGIN * 2 - 28
  );
  drawText(
    page,
    `Declared value: ${money(shipment.package?.value, currencySymbol(shipment.package?.currency || shipment.cost?.currency))}`,
    MARGIN + 14,
    pkgTop - 64,
    9,
    font,
    C.ink
  );

  y = y - pkgH - 22;

  // ===== COSTS =====
  drawText(page, "Cost Summary", MARGIN, y, 13, fontBold, C.primary);
  y -= 12;
  const costH = 86;
  page.drawRectangle({
    x: MARGIN,
    y: y - costH,
    width: PAGE_W - MARGIN * 2,
    height: costH,
    color: C.white,
    borderColor: C.border,
    borderWidth: 1,
  });

  const rows: [string, string][] = [
    ["Base service", money(shipment.cost?.base, symbol)],
    ["Shipping", money(shipment.cost?.shipping, symbol)],
    ["Insurance", money(shipment.cost?.insurance, symbol)],
  ];
  let ry = y - 18;
  for (const [label, value] of rows) {
    drawText(page, label, MARGIN + 16, ry, 10, font, C.muted);
    drawText(page, value, PAGE_W - MARGIN - 100, ry, 10, fontBold, C.ink);
    ry -= 16;
  }
  page.drawRectangle({
    x: MARGIN + 12,
    y: y - costH + 8,
    width: PAGE_W - MARGIN * 2 - 24,
    height: 22,
    color: C.blueSoft,
  });
  drawText(page, "TOTAL", MARGIN + 20, y - costH + 14, 10, fontBold, C.primary);
  drawText(
    page,
    money(shipment.cost?.total, symbol),
    PAGE_W - MARGIN - 110,
    y - costH + 14,
    12,
    fontBold,
    C.primary
  );

  y = y - costH - 20;

  // ===== TIMELINE (latest events) =====
  const events = (shipment.events || []).slice(-4).reverse();
  if (events.length > 0 && y > 120) {
    drawText(page, "Recent Activity", MARGIN, y, 13, fontBold, C.primary);
    y -= 16;
    for (const ev of events) {
      if (y < 90) break;
      page.drawCircle({ x: MARGIN + 6, y: y + 3, size: 3, color: C.primary });
      drawText(
        page,
        safe(ev.title || ev.status),
        MARGIN + 18,
        y,
        9,
        fontBold,
        C.ink,
        280
      );
      drawText(page, fmtDate(ev.timestamp), MARGIN + 310, y, 8, font, C.muted);
      y -= 12;
      if (ev.description || ev.location) {
        drawText(
          page,
          [ev.description, ev.location].filter(Boolean).join(" · "),
          MARGIN + 18,
          y,
          8,
          font,
          C.muted,
          PAGE_W - MARGIN * 2 - 30
        );
        y -= 14;
      } else {
        y -= 8;
      }
    }
  }

  // ===== FOOTER =====
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 58, color: C.light });
  page.drawRectangle({ x: 0, y: 58, width: PAGE_W, height: 1.2, color: C.border });
  drawText(
    page,
    "This document is an official receipt issued by CargoWatch. Verify authenticity with the tracking number above.",
    MARGIN,
    38,
    7,
    font,
    C.muted,
    PAGE_W - MARGIN * 2
  );
  drawText(page, `Generated ${fmtDate(generatedAt)}  ·  ${docId}`, MARGIN, 22, 7, font, C.muted);
  drawText(page, "cargowatch.com", PAGE_W - MARGIN - 80, 22, 7, fontBold, C.primary);

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

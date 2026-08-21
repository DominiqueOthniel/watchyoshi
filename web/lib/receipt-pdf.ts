import { PDFDocument, StandardFonts, rgb, RGB, PDFFont, PDFPage } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import type { Shipment } from "./types";
import { DEFAULT_LOCALE, PDF_LOCALES, type PdfLocale } from "./i18n/config";
import { LEGACY_EN_COPY, STATUS_META } from "./shipment-status";

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

export function normalizePdfLocale(raw?: string | null): PdfLocale {
  const v = String(raw || "").toLowerCase().slice(0, 2);
  if ((PDF_LOCALES as readonly string[]).includes(v)) return v as PdfLocale;
  return DEFAULT_LOCALE;
}

type StatusCopy = { label: string; title: string; text: string };

type PdfCopy = {
  metaTitle: string;
  metaSubject: string;
  tagline: string;
  receiptTitle: string;
  trackingNumber: string;
  shipmentInfo: string;
  created: string;
  lastUpdated: string;
  estDelivery: string;
  deliveredOn: string;
  currentLocation: string;
  inNetwork: string;
  na: string;
  sender: string;
  recipient: string;
  email: string;
  phone: string;
  address: string;
  packageDetails: string;
  type: string;
  weight: string;
  service: string;
  description: string;
  noDescription: string;
  declaredValue: string;
  costSummary: string;
  baseService: string;
  shipping: string;
  insurance: string;
  total: string;
  recentActivity: string;
  footer: string;
  generatedOn: string;
  months: string[];
  packageTypes: Record<string, string>;
  services: Record<string, string>;
  status: Record<string, StatusCopy>;
};

const COPY: Record<PdfLocale, PdfCopy> = {
  fr: {
    metaTitle: "Recu Aurex Logistics",
    metaSubject: "Recu officiel d'envoi",
    tagline: "Fret mondial. Suivi clair.",
    receiptTitle: "RECU OFFICIEL D'ENVOI",
    trackingNumber: "NUMERO DE SUIVI",
    shipmentInfo: "Informations d'envoi",
    created: "Cree le",
    lastUpdated: "Derniere mise a jour",
    estDelivery: "Livraison estimee",
    deliveredOn: "Livre le",
    currentLocation: "Position actuelle",
    inNetwork: "En reseau",
    na: "N/D",
    sender: "EXPEDITEUR",
    recipient: "DESTINATAIRE",
    email: "E-mail",
    phone: "Telephone",
    address: "Adresse",
    packageDetails: "Details du colis",
    type: "Type",
    weight: "Poids",
    service: "Prestation",
    description: "Description",
    noDescription: "Aucune description",
    declaredValue: "Valeur declaree",
    costSummary: "Resume des couts",
    baseService: "Service de base",
    shipping: "Transport",
    insurance: "Assurance",
    total: "TOTAL",
    recentActivity: "Activite recente",
    footer:
      "Document officiel emis par Aurex Logistics. Verifiez l'authenticite avec le numero de suivi ci-dessus.",
    generatedOn: "Genere le",
    months: [
      "janv.",
      "fevr.",
      "mars",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "aout",
      "sept.",
      "oct.",
      "nov.",
      "dec.",
    ],
    packageTypes: {
      parcel: "Colis",
      document: "Document",
      freight: "Fret",
      vehicle: "Vehicule",
    },
    services: { standard: "Standard", express: "Express", economy: "Economique" },
    status: {
      delivered: {
        label: "LIVRE",
        title: "Livraison reussie",
        text: "Cet envoi a ete remis au destinataire.",
      },
      out_for_delivery: {
        label: "EN LIVRAISON",
        title: "En cours de livraison",
        text: "Le colis est chez le coursier et arrivera bientot.",
      },
      in_transit: {
        label: "EN TRANSIT",
        title: "Colis en transit",
        text: "Votre envoi est en route. Le suivi se met a jour automatiquement.",
      },
      picked_up: {
        label: "RAMASSE",
        title: "Colis ramasse",
        text: "L'envoi a ete ramasse et entre dans le reseau logistique.",
      },
      exception: {
        label: "INCIDENT",
        title: "Action requise",
        text: "Un incident est survenu. Contactez Aurex Logistics au +33 6 44 68 49 20.",
      },
      pending: {
        label: "EN ATTENTE",
        title: "En attente de ramassage",
        text: "Cet envoi est enregistre et attend d'etre ramasse.",
      },
    },
  },
  en: {
    metaTitle: "Aurex Logistics receipt",
    metaSubject: "Official shipment receipt",
    tagline: "Global freight. Clear tracking.",
    receiptTitle: "OFFICIAL SHIPMENT RECEIPT",
    trackingNumber: "TRACKING NUMBER",
    shipmentInfo: "Shipment details",
    created: "Created",
    lastUpdated: "Last updated",
    estDelivery: "Estimated delivery",
    deliveredOn: "Delivered on",
    currentLocation: "Current location",
    inNetwork: "In network",
    na: "N/A",
    sender: "SENDER",
    recipient: "RECIPIENT",
    email: "Email",
    phone: "Phone",
    address: "Address",
    packageDetails: "Package details",
    type: "Type",
    weight: "Weight",
    service: "Service",
    description: "Description",
    noDescription: "No description",
    declaredValue: "Declared value",
    costSummary: "Cost summary",
    baseService: "Base service",
    shipping: "Shipping",
    insurance: "Insurance",
    total: "TOTAL",
    recentActivity: "Recent activity",
    footer:
      "Official document issued by Aurex Logistics. Verify authenticity with the tracking number above.",
    generatedOn: "Generated on",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    packageTypes: {
      parcel: "Parcel",
      document: "Document",
      freight: "Freight",
      vehicle: "Vehicle",
    },
    services: { standard: "Standard", express: "Express", economy: "Economy" },
    status: {
      delivered: {
        label: "DELIVERED",
        title: "Successfully delivered",
        text: "This shipment was handed to the recipient.",
      },
      out_for_delivery: {
        label: "OUT FOR DELIVERY",
        title: "Out for delivery",
        text: "The package is with the courier and will arrive soon.",
      },
      in_transit: {
        label: "IN TRANSIT",
        title: "Package in transit",
        text: "Your shipment is on the way. Tracking updates automatically.",
      },
      picked_up: {
        label: "PICKED UP",
        title: "Package picked up",
        text: "The shipment was collected and entered the logistics network.",
      },
      exception: {
        label: "EXCEPTION",
        title: "Action required",
        text: "An issue occurred. Contact Aurex Logistics at +33 6 44 68 49 20.",
      },
      pending: {
        label: "PENDING",
        title: "Awaiting pickup",
        text: "This shipment is registered and waiting to be picked up.",
      },
    },
  },
  es: {
    metaTitle: "Recibo Aurex Logistics",
    metaSubject: "Recibo oficial de envio",
    tagline: "Flete mundial. Seguimiento claro.",
    receiptTitle: "RECIBO OFICIAL DE ENVIO",
    trackingNumber: "NUMERO DE SEGUIMIENTO",
    shipmentInfo: "Informacion del envio",
    created: "Creado el",
    lastUpdated: "Ultima actualizacion",
    estDelivery: "Entrega estimada",
    deliveredOn: "Entregado el",
    currentLocation: "Posicion actual",
    inNetwork: "En red",
    na: "N/D",
    sender: "REMITENTE",
    recipient: "DESTINATARIO",
    email: "Correo",
    phone: "Telefono",
    address: "Direccion",
    packageDetails: "Detalles del paquete",
    type: "Tipo",
    weight: "Peso",
    service: "Servicio",
    description: "Descripcion",
    noDescription: "Sin descripcion",
    declaredValue: "Valor declarado",
    costSummary: "Resumen de costes",
    baseService: "Servicio base",
    shipping: "Transporte",
    insurance: "Seguro",
    total: "TOTAL",
    recentActivity: "Actividad reciente",
    footer:
      "Documento oficial emitido por Aurex Logistics. Verifique la autenticidad con el numero de seguimiento.",
    generatedOn: "Generado el",
    months: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."],
    packageTypes: {
      parcel: "Paquete",
      document: "Documento",
      freight: "Flete",
      vehicle: "Vehiculo",
    },
    services: { standard: "Estandar", express: "Express", economy: "Economico" },
    status: {
      delivered: {
        label: "ENTREGADO",
        title: "Entrega realizada",
        text: "Este envio fue entregado al destinatario.",
      },
      out_for_delivery: {
        label: "EN REPARTO",
        title: "En curso de entrega",
        text: "El paquete esta con el mensajero y llegara pronto.",
      },
      in_transit: {
        label: "EN TRANSITO",
        title: "Paquete en transito",
        text: "Su envio esta en camino. El seguimiento se actualiza automaticamente.",
      },
      picked_up: {
        label: "RECOGIDO",
        title: "Paquete recogido",
        text: "El envio fue recogido y entro en la red logistica.",
      },
      exception: {
        label: "INCIDENTE",
        title: "Accion requerida",
        text: "Ocurrio un incidente. Contacte a Aurex Logistics al +33 6 44 68 49 20.",
      },
      pending: {
        label: "PENDIENTE",
        title: "En espera de recogida",
        text: "Este envio esta registrado y espera ser recogido.",
      },
    },
  },
  de: {
    metaTitle: "Aurex Logistics Quittung",
    metaSubject: "Offizielle Versandquittung",
    tagline: "Weltweiter Frachtverkehr. Klares Tracking.",
    receiptTitle: "OFFIZIELLE VERSANDQUITTUNG",
    trackingNumber: "SENDUNGSNUMMER",
    shipmentInfo: "Sendungsinformationen",
    created: "Erstellt am",
    lastUpdated: "Zuletzt aktualisiert",
    estDelivery: "Voraussichtliche Lieferung",
    deliveredOn: "Zugestellt am",
    currentLocation: "Aktueller Standort",
    inNetwork: "Im Netz",
    na: "k. A.",
    sender: "ABSENDER",
    recipient: "EMPFANGER",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    packageDetails: "Paketdetails",
    type: "Typ",
    weight: "Gewicht",
    service: "Leistung",
    description: "Beschreibung",
    noDescription: "Keine Beschreibung",
    declaredValue: "Deklarierter Wert",
    costSummary: "Kostenubersicht",
    baseService: "Grundservice",
    shipping: "Transport",
    insurance: "Versicherung",
    total: "GESAMT",
    recentActivity: "Letzte Aktivitat",
    footer:
      "Offizielles Dokument von Aurex Logistics. Prufen Sie die Echtheit anhand der Sendungsnummer oben.",
    generatedOn: "Erstellt am",
    months: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sept", "Okt", "Nov", "Dez"],
    packageTypes: {
      parcel: "Paket",
      document: "Dokument",
      freight: "Fracht",
      vehicle: "Fahrzeug",
    },
    services: { standard: "Standard", express: "Express", economy: "Economy" },
    status: {
      delivered: {
        label: "ZUGESTELLT",
        title: "Erfolgreich zugestellt",
        text: "Diese Sendung wurde an den Empfanger ubergeben.",
      },
      out_for_delivery: {
        label: "IN ZUSTELLUNG",
        title: "In Zustellung",
        text: "Das Paket ist beim Zusteller und kommt bald an.",
      },
      in_transit: {
        label: "UNTERWEGS",
        title: "Paket unterwegs",
        text: "Ihre Sendung ist unterwegs. Das Tracking wird automatisch aktualisiert.",
      },
      picked_up: {
        label: "ABGEHOLT",
        title: "Paket abgeholt",
        text: "Die Sendung wurde abgeholt und ist im Logistiknetz.",
      },
      exception: {
        label: "AUSNAHME",
        title: "Handlung erforderlich",
        text: "Es ist ein Problem aufgetreten. Kontaktieren Sie Aurex Logistics unter +33 6 44 68 49 20.",
      },
      pending: {
        label: "AUSSTEHEND",
        title: "Wartet auf Abholung",
        text: "Diese Sendung ist erfasst und wartet auf die Abholung.",
      },
    },
  },
};

function currencySymbol(code?: string) {
  const map: Record<string, string> = {
    USD: "$",
    EUR: "EUR ",
    GBP: "GBP ",
    XAF: "FCFA ",
    XOF: "CFA ",
    CAD: "CA$",
    CHF: "CHF ",
  };
  return map[(code || "USD").toUpperCase()] || `${(code || "USD").toUpperCase()} `;
}

function money(n: number | undefined, symbol: string, locale: PdfLocale) {
  const v = Number(n ?? 0);
  const sep = locale === "en" ? "." : ",";
  const formatted = Math.abs(v).toFixed(2).replace(".", sep);
  return `${v < 0 ? "-" : ""}${symbol}${formatted}`;
}

function fmtDate(value: string | null | undefined, t: PdfCopy) {
  if (!value) return t.na;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return t.na;
  const day = String(d.getDate()).padStart(2, "0");
  const month = t.months[d.getMonth()] || "";
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${d.getFullYear()}, ${hour}:${minute}`;
}

function packageType(type: string | undefined, t: PdfCopy) {
  const key = String(type || "").toLowerCase();
  return t.packageTypes[key] || type || "";
}

function serviceLabel(value: string | undefined, t: PdfCopy) {
  const key = String(value || "").toLowerCase();
  return t.services[key] || value || "";
}

function safe(v?: string | number | null, fallback = "N/D") {
  if (v == null || String(v).trim() === "") return fallback;
  return String(v);
}

function statusColors(status: string) {
  switch (status) {
    case "delivered":
      return { color: C.green, soft: C.greenSoft };
    case "out_for_delivery":
      return { color: C.amber, soft: C.amberSoft };
    case "in_transit":
      return { color: C.primary, soft: C.blueSoft };
    case "picked_up":
      return { color: C.indigo, soft: C.indigoSoft };
    case "exception":
      return { color: C.red, soft: C.redSoft };
    default:
      return { color: C.red, soft: C.redSoft };
  }
}

function statusMeta(status: string, t: PdfCopy) {
  const copy = t.status[status] || t.status.pending;
  const colors = statusColors(status);
  return { ...copy, ...colors };
}

function pdfEventCopy(ev: { status?: string; title?: string; description?: string }, t: PdfCopy) {
  const mapped = t.status[ev.status || ""] || t.status.pending;
  const meta = STATUS_META[ev.status as keyof typeof STATUS_META];
  const title = ev.title || "";
  const desc = ev.description || "";
  const titleIsGeneric =
    !title || LEGACY_EN_COPY.has(title) || (meta && title === meta.title);
  const descIsGeneric =
    !desc || LEGACY_EN_COPY.has(desc) || (meta && desc === meta.description);
  return {
    title: titleIsGeneric ? mapped.title : title,
    description: descIsGeneric ? mapped.text : desc,
  };
}

const WINANSI_REPLACEMENTS: Record<string, string> = {
  "€": "EUR ",
  "£": "GBP ",
  "¥": "Y",
  "’": "'",
  "‘": "'",
  "‚": ",",
  "“": '"',
  "”": '"',
  "„": '"',
  "—": "-",
  "–": "-",
  "−": "-",
  "…": "...",
  "œ": "oe",
  "Œ": "OE",
  "æ": "ae",
  "Æ": "AE",
  "ß": "ss",
  "•": "-",
  "·": "-",
  "×": "x",
  "÷": "/",
  "™": "TM",
  "®": "(R)",
  "©": "(C)",
  "\u00a0": " ",
  "\u202f": " ",
  "\u2007": " ",
  "\u2009": " ",
  "\u200a": " ",
  "\u200b": "",
  "\u2060": "",
  "\ufeff": "",
};

function pdfSafe(text: string) {
  let out = "";
  for (const ch of String(text ?? "")) {
    if (WINANSI_REPLACEMENTS[ch] !== undefined) {
      out += WINANSI_REPLACEMENTS[ch];
      continue;
    }
    const code = ch.codePointAt(0) || 0;
    if (code === 0x09 || code === 0x0a || code === 0x0d) {
      out += " ";
      continue;
    }
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff && code !== 0xad)) {
      out += ch;
      continue;
    }
    const stripped = ch.normalize("NFD").replace(/\p{M}/gu, "");
    if (stripped && stripped !== ch) {
      for (const part of stripped) {
        const sc = part.codePointAt(0) || 0;
        if ((sc >= 0x20 && sc <= 0x7e) || (sc >= 0xa0 && sc <= 0xff)) out += part;
      }
      continue;
    }
    out += "?";
  }
  return out;
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
  const raw = pdfSafe(text);
  if (!raw) return;
  try {
    const content = maxWidth ? truncateToWidth(raw, font, size, maxWidth) : raw;
    page.drawText(content, { x, y, size, font, color });
  } catch {
    const fallback = raw.replace(/[^\x20-\x7E]/g, "?");
    if (!fallback) return;
    const content = maxWidth ? truncateToWidth(fallback, font, size, maxWidth) : fallback;
    page.drawText(content, { x, y, size, font, color });
  }
}

function truncateToWidth(text: string, font: PDFFont, size: number, maxWidth: number) {
  try {
    if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
    let t = text;
    while (t.length > 0 && font.widthOfTextAtSize(`${t}...`, size) > maxWidth) {
      t = t.slice(0, -1);
    }
    return `${t}...`;
  } catch {
    const ascii = text.replace(/[^\x20-\x7E]/g, "?");
    if (ascii.length * size * 0.5 <= maxWidth) return ascii;
    return `${ascii.slice(0, Math.max(1, Math.floor(maxWidth / (size * 0.5))))}...`;
  }
}

function addressOf(party?: Shipment["sender"]) {
  if (!party?.address) return "N/D";
  const cityLine = [party.address.zip, party.address.city].filter(Boolean).join(" ");
  return (
    [party.address.street, cityLine, party.address.state, party.address.country]
      .filter(Boolean)
      .join(", ") || "N/D"
  );
}

export async function generateReceiptPdfBuffer(
  shipment: Shipment,
  language: PdfLocale | string = DEFAULT_LOCALE
): Promise<Buffer> {
  const locale = normalizePdfLocale(language);
  const t = COPY[locale] || COPY.fr;
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`${t.metaTitle} ${shipment.trackingId}`);
  pdfDoc.setAuthor("Aurex Logistics");
  pdfDoc.setSubject(t.metaSubject);
  pdfDoc.setCreator("Aurex Logistics Platform");

  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const status = shipment.status || "pending";
  const meta = statusMeta(status, t);
  const symbol = currencySymbol(shipment.cost?.currency || shipment.package?.currency);
  const generatedAt = new Date().toISOString();
  const docId = `AX-RCPT-${shipment.trackingId}-${Date.now().toString().slice(-6)}`;

  page.drawRectangle({ x: 0, y: PAGE_H - 108, width: PAGE_W, height: 108, color: C.primary });
  page.drawRectangle({ x: 0, y: PAGE_H - 112, width: PAGE_W, height: 4, color: C.primaryDark });

  try {
    const logoPath = path.join(process.cwd(), "public", "aurex-logo-light.png");
    const logoBytes = await readFile(logoPath);
    const logo = await pdfDoc.embedPng(logoBytes);
    const logoH = 58;
    const logoW = Math.min((logo.width / logo.height) * logoH, 150);
    page.drawImage(logo, {
      x: MARGIN,
      y: PAGE_H - 78,
      width: logoW,
      height: logoH,
    });
  } catch {
    drawText(page, "Aurex Logistics", MARGIN, PAGE_H - 58, 20, fontBold, C.white);
  }

  drawText(page, t.tagline, MARGIN, PAGE_H - 98, 9, font, hex(191, 219, 254));
  drawText(page, t.receiptTitle, PAGE_W - MARGIN - 190, PAGE_H - 52, 11, fontBold, C.white);
  drawText(page, docId, PAGE_W - MARGIN - 190, PAGE_H - 68, 8, font, hex(191, 219, 254));

  let y = PAGE_H - 140;

  page.drawRectangle({
    x: MARGIN,
    y: y - 28,
    width: PAGE_W - MARGIN * 2,
    height: 54,
    color: C.blueSoft,
    borderColor: C.primary,
    borderWidth: 1.5,
  });
  drawText(page, t.trackingNumber, MARGIN + 16, y + 8, 9, font, C.primary);
  drawText(page, shipment.trackingId, MARGIN + 16, y - 14, 22, fontBold, C.ink);

  y -= 70;

  drawText(page, t.shipmentInfo, MARGIN, y, 13, fontBold, C.primary);
  y -= 22;

  const badgeLabel = meta.label;
  const badgeW = fontBold.widthOfTextAtSize(pdfSafe(badgeLabel), 10) + 20;
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
  drawText(page, t.created, MARGIN, y, 8, font, C.muted);
  drawText(page, t.lastUpdated, MARGIN + col, y, 8, font, C.muted);
  y -= 14;
  drawText(page, fmtDate(shipment.createdAt, t), MARGIN, y, 10, fontBold, C.ink);
  drawText(page, fmtDate(shipment.updatedAt, t), MARGIN + col, y, 10, fontBold, C.ink);
  y -= 18;
  drawText(page, t.estDelivery, MARGIN, y, 8, font, C.muted);
  drawText(
    page,
    status === "delivered" ? t.deliveredOn : t.currentLocation,
    MARGIN + col,
    y,
    8,
    font,
    C.muted
  );
  y -= 14;
  drawText(page, fmtDate(shipment.estimatedDelivery, t), MARGIN, y, 10, fontBold, C.ink);
  drawText(
    page,
    status === "delivered"
      ? fmtDate(shipment.deliveredAt, t)
      : safe(shipment.currentLocation?.city, t.inNetwork),
    MARGIN + col,
    y,
    10,
    fontBold,
    C.ink
  );

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
    drawText(page, t.email, x + 12, cardY + cardH - 60, 7, font, C.muted);
    drawText(page, email, x + 12, cardY + cardH - 72, 9, font, C.ink, cardW - 24);
    drawText(page, t.phone, x + 12, cardY + cardH - 86, 7, font, C.muted);
    drawText(page, phone, x + 12, cardY + cardH - 98, 9, font, C.ink, cardW - 24);
    drawText(page, t.address, x + 12, cardY + cardH - 112, 7, font, C.muted);
    drawText(page, address, x + 12, cardY + 8, 8, font, C.ink, cardW - 24);
  }

  partyCard(
    MARGIN,
    t.sender,
    safe(shipment.sender?.name, t.na),
    safe(shipment.sender?.email, t.na),
    safe(shipment.sender?.phone, t.na),
    addressOf(shipment.sender)
  );
  partyCard(
    MARGIN + cardW + 14,
    t.recipient,
    safe(shipment.recipient?.name, t.na),
    safe(shipment.recipient?.email, t.na),
    safe(shipment.recipient?.phone, t.na),
    addressOf(shipment.recipient)
  );

  y = cardY - 24;

  drawText(page, t.packageDetails, MARGIN, y, 13, fontBold, C.primary);
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
  drawText(page, t.type, MARGIN + 14, pkgTop, 7, font, C.muted);
  drawText(page, safe(packageType(shipment.package?.type, t), t.na), MARGIN + 14, pkgTop - 12, 10, fontBold, C.ink);
  drawText(page, t.weight, MARGIN + 150, pkgTop, 7, font, C.muted);
  drawText(
    page,
    `${safe(shipment.package?.weight, t.na)} kg`,
    MARGIN + 150,
    pkgTop - 12,
    10,
    fontBold,
    C.ink
  );
  drawText(page, t.service, MARGIN + 280, pkgTop, 7, font, C.muted);
  drawText(
    page,
    `${safe(serviceLabel(shipment.service?.type, t), t.na)} / ${safe(serviceLabel(shipment.service?.priority, t), t.na)}`,
    MARGIN + 280,
    pkgTop - 12,
    10,
    fontBold,
    C.ink,
    220
  );
  drawText(page, t.description, MARGIN + 14, pkgTop - 34, 7, font, C.muted);
  drawText(
    page,
    safe(shipment.package?.description, t.noDescription),
    MARGIN + 14,
    pkgTop - 48,
    9,
    font,
    C.ink,
    PAGE_W - MARGIN * 2 - 28
  );
  drawText(
    page,
    `${t.declaredValue} : ${money(shipment.package?.value, currencySymbol(shipment.package?.currency || shipment.cost?.currency), locale)}`,
    MARGIN + 14,
    pkgTop - 64,
    9,
    font,
    C.ink
  );

  y = y - pkgH - 22;

  drawText(page, t.costSummary, MARGIN, y, 13, fontBold, C.primary);
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
    [t.baseService, money(shipment.cost?.base, symbol, locale)],
    [t.shipping, money(shipment.cost?.shipping, symbol, locale)],
    [t.insurance, money(shipment.cost?.insurance, symbol, locale)],
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
  drawText(page, t.total, MARGIN + 20, y - costH + 14, 10, fontBold, C.primary);
  drawText(
    page,
    money(shipment.cost?.total, symbol, locale),
    PAGE_W - MARGIN - 110,
    y - costH + 14,
    12,
    fontBold,
    C.primary
  );

  y = y - costH - 20;

  const events = (shipment.events || []).slice(-4).reverse();
  if (events.length > 0 && y > 120) {
    drawText(page, t.recentActivity, MARGIN, y, 13, fontBold, C.primary);
    y -= 16;
    for (const ev of events) {
      if (y < 90) break;
      const copy = pdfEventCopy(ev, t);
      page.drawCircle({ x: MARGIN + 6, y: y + 3, size: 3, color: C.primary });
      drawText(
        page,
        safe(copy.title || ev.status, t.na),
        MARGIN + 18,
        y,
        9,
        fontBold,
        C.ink,
        280
      );
      drawText(page, fmtDate(ev.timestamp, t), MARGIN + 310, y, 8, font, C.muted);
      y -= 12;
      if (copy.description || ev.location) {
        drawText(
          page,
          [copy.description, ev.location].filter(Boolean).join(" - "),
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

  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 58, color: C.light });
  page.drawRectangle({ x: 0, y: 58, width: PAGE_W, height: 1.2, color: C.border });
  drawText(
    page,
    t.footer,
    MARGIN,
    38,
    7,
    font,
    C.muted,
    PAGE_W - MARGIN * 2
  );
  drawText(page, `${t.generatedOn} ${fmtDate(generatedAt, t)}  -  ${docId}`, MARGIN, 22, 7, font, C.muted);
  drawText(page, "+33 6 44 68 49 20", PAGE_W - MARGIN - 95, 34, 7, fontBold, C.primary);
  drawText(page, "logisticsaurex@gmail.com", PAGE_W - MARGIN - 118, 22, 7, fontBold, C.primary);

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

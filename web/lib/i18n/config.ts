export const LOCALES = ["en", "fr", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
};

export const STORAGE_KEY = "cw_locale";

/** Map browser / region hints to a supported locale */
export function detectLocaleFromRegion(): Locale {
  if (typeof navigator === "undefined") return "en";

  const candidates = [
    ...(navigator.languages || []),
    navigator.language,
  ].filter(Boolean);

  for (const raw of candidates) {
    const tag = raw.toLowerCase();
    const lang = tag.split("-")[0];
    const region = tag.split("-")[1]?.toUpperCase();

    if (lang === "fr") return "fr";
    if (lang === "es") return "es";
    if (lang === "en") return "en";

    // Region fallbacks when language tag is ambiguous
    if (region && ["FR", "BE", "CH", "LU", "MC", "SN", "CI", "CM"].includes(region)) {
      return "fr";
    }
    if (region && ["ES", "MX", "AR", "CO", "CL", "PE", "UY", "EC"].includes(region)) {
      return "es";
    }
  }

  // Soft timezone hint (Europe/Paris etc.)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Paris|Brussels|Zurich|Luxembourg|Abidjan|Dakar/i.test(tz)) return "fr";
    if (/Madrid|Mexico|Buenos_Aires|Bogota|Santiago|Lima/i.test(tz)) return "es";
  } catch {
    // ignore
  }

  return "en";
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && LOCALES.includes(v as Locale)) return v as Locale;
  } catch {
    // ignore
  }
  return null;
}

export function resolveInitialLocale(): Locale {
  return readStoredLocale() || detectLocaleFromRegion();
}

// =============================================================
// 🔧 TRACKING & ANALYTICS — CENTRAL CONFIG
// =============================================================
// সব ID এক জায়গায়। পরে শুধু এখানে value বসিয়ে দিলেই
// পুরো site-wide tracking automatically চালু হয়ে যাবে।
//
// HOW TO ENABLE (one-time setup):
//   1. GTM_ID:  Google Tag Manager → Admin → Container ID (GTM-XXXXXXX)
//   2. GA4_ID:  GA4 → Admin → Data Streams → Measurement ID (G-XXXXXXX)
//   3. GOOGLE_ADS_ID:  Google Ads → Tools → Conversions → Tag setup → AW-XXXXXXXXX
//   4. CONVERSION_LABELS:  Per-service Conversion Label from each Ads conversion action
//   5. WHATSAPP_NUMBER:  E.164 format without "+" (e.g. 18885550199)
//
// সব placeholder-এ "XXXXXXX" আছে — যতক্ষণ replace না হবে ততক্ষণ
// সংশ্লিষ্ট tracking script load হবে না (no-op + safe)।
// =============================================================

export const TRACKING = {
  // Google Tag Manager (preferred — সব event এর hub)
  GTM_ID: "GTM-XXXXXXX",

  // Google Analytics 4 (GTM থাকলেও direct fallback হিসেবে রাখা)
  GA4_ID: "G-XXXXXXXXXX",

  // Google Ads
  GOOGLE_ADS_ID: "AW-XXXXXXXXX",

  // WhatsApp floating button (international format, no "+")
  WHATSAPP_NUMBER: "18885550199",
  WHATSAPP_DEFAULT_MSG: "Hi! I need help with home services.",

  // Qualified-call threshold (seconds). Real call duration আসবে CallRail/
  // Twilio webhook থেকে; এখানে structure ready রাখা।
  QUALIFIED_CALL_SECONDS: 60,
} as const;

// Per-service Google Ads Conversion Labels (Ads → Conversion action → Label)
// "default" = generic site-wide call conversion।
export const CONVERSION_LABELS: Record<string, string> = {
  default: "XXXXXXXXXXXXXXXXXXXX",
  plumbing: "XXXXXXXXXXXXXXXXXXXX",
  "pest-control": "XXXXXXXXXXXXXXXXXXXX",
  roofing: "XXXXXXXXXXXXXXXXXXXX",
  "water-damage": "XXXXXXXXXXXXXXXXXXXX",
  "floor-coating": "XXXXXXXXXXXXXXXXXXXX",
};

// Helpers ----------------------------------------------------
const isPlaceholder = (v: string) => !v || v.includes("XXXXXXX");

export const TRACKING_ENABLED = {
  gtm: !isPlaceholder(TRACKING.GTM_ID),
  ga4: !isPlaceholder(TRACKING.GA4_ID),
  ads: !isPlaceholder(TRACKING.GOOGLE_ADS_ID),
};

export function adsSendTo(serviceSlug?: string | null) {
  if (!TRACKING_ENABLED.ads) return null;
  const slug = serviceSlug ?? "default";
  const label = CONVERSION_LABELS[slug] ?? CONVERSION_LABELS.default;
  if (!label || isPlaceholder(label)) return null;
  return `${TRACKING.GOOGLE_ADS_ID}/${label}`;
}

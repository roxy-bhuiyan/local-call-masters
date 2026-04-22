// Google Ads call-conversion tracking.
//
// HOW TO CONFIGURE:
// 1. In Google Ads, create a "Phone calls → Calls from a website" conversion
//    action for each service line you want to track separately. Each one
//    gives you a Conversion ID (AW-XXXXXXXXX) and a Conversion Label.
// 2. Put the Conversion ID below in GOOGLE_ADS_ID (one account-level ID).
// 3. Map each service slug to its Conversion Label in CONVERSION_LABELS.
//    Use "default" for the generic site-wide Call Now button.
//
// The gtag.js script is injected once from __root.tsx. Every call click
// fires both:
//   - a generic `event: "call_click"` (useful in GA4 if you also link it)
//   - a `conversion` event with send_to = "AW-ID/LABEL" for Google Ads.

export const GOOGLE_ADS_ID = "AW-XXXXXXXXX"; // TODO: replace with your real Google Ads conversion ID

// Map each service slug (and "default") to its Google Ads conversion label.
// Replace the placeholder labels with the real ones from Google Ads.
export const CONVERSION_LABELS: Record<string, string> = {
  default: "AbC-D_efG-hIjKLmnOP",
  plumbing: "AbC-D_efG-PLUMB123",
  "pest-control": "AbC-D_efG-PEST1234",
  roofing: "AbC-D_efG-ROOF1234",
  "water-damage": "AbC-D_efG-WATER123",
  "floor-coating": "AbC-D_efG-FLOOR123",
};

function isConfigured() {
  return !!GOOGLE_ADS_ID && !GOOGLE_ADS_ID.includes("XXXXXXXXX");
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

/**
 * Fire a Google Ads call conversion for a given service slug (or default).
 * Safe to call from anywhere — it no-ops if gtag isn't loaded yet or if
 * the Conversion ID hasn't been set.
 */
export function trackGoogleAdsCallConversion(opts: {
  serviceSlug?: string | null;
  phone?: string | null;
}) {
  if (typeof window === "undefined") return;
  if (!isConfigured()) return;
  if (typeof window.gtag !== "function") return;

  const slug = opts.serviceSlug ?? "default";
  const label = CONVERSION_LABELS[slug] ?? CONVERSION_LABELS.default;
  if (!label) return;

  // Generic event (helpful for GA4 + audience building)
  window.gtag("event", "call_click", {
    service: slug,
    phone_number: opts.phone ?? undefined,
    event_category: "engagement",
    event_label: slug,
  });

  // Google Ads conversion event
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    value: 1.0,
    currency: "USD",
    transaction_id: `${slug}-${Date.now()}`,
  });
}

/** Returns the gtag.js loader URL for the configured Google Ads ID. */
export function googleAdsScriptUrl() {
  if (!isConfigured()) return null;
  return `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
}

/** Inline init snippet injected after gtag.js loads. */
export function googleAdsInitSnippet() {
  if (!isConfigured()) return null;
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`;
}

export const GOOGLE_ADS_CONFIGURED = isConfigured();
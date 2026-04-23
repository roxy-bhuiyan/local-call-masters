// =============================================================
// 📥 ATTRIBUTION — GCLID, GBRAID, WBRAID, UTM capture
// =============================================================
// First-touch + last-touch capture. localStorage এ store হয় যাতে
// pageviews / sessions পরেও এক visitor এর সব lead এ attach করা যায়।
// Offline conversion upload-এর জন্য GCLID critical।
// =============================================================

const STORAGE_KEY = "attribution_v1";
const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = {
  // First-touch (kept forever per browser)
  first?: Record<string, string> & { ts?: string; landing?: string; referrer?: string };
  // Last-touch (overwritten on each new attributed visit)
  last?: Record<string, string> & { ts?: string; landing?: string; referrer?: string };
};

function read(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function write(a: Attribution) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Run once on first paint of any page. Reads URL params and persists
 * any click IDs / UTM params it finds.
 */
export function captureAttributionFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const found: Record<string, string> = {};
  for (const k of [...CLICK_ID_KEYS, ...UTM_KEYS]) {
    const v = url.searchParams.get(k);
    if (v) found[k] = v.slice(0, 200);
  }
  if (Object.keys(found).length === 0) return;

  const now = new Date().toISOString();
  const landing = url.pathname + url.search;
  const referrer = document.referrer ? document.referrer.slice(0, 300) : "";
  const data = read();
  const enriched = { ...found, ts: now, landing, referrer };
  if (!data.first) data.first = enriched;
  data.last = enriched;
  write(data);
}

export function getAttribution(): Attribution {
  return read();
}

/** Flatten for sending with leads / events. Last-touch wins, first-touch
 *  prefixed so we keep both without overwriting. */
export function flattenAttribution() {
  const a = read();
  const flat: Record<string, string> = {};
  if (a.last) {
    for (const [k, v] of Object.entries(a.last)) if (v) flat[k] = String(v);
  }
  if (a.first) {
    for (const [k, v] of Object.entries(a.first)) {
      if (v) flat[`first_${k}`] = String(v);
    }
  }
  return flat;
}

export function getGclid(): string | null {
  const a = read();
  return (a.last?.gclid as string) || (a.first?.gclid as string) || null;
}

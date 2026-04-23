// =============================================================
// 📊 DATALAYER — central event push for GTM / GA4 / Google Ads
// =============================================================
// সব tracking event এই helper দিয়ে যায় — কোনো hardcoded gtag call
// component এর ভিতরে নাই। GTM enabled থাকলে GTM dataLayer fire হবে,
// না থাকলে direct gtag fallback (GA4/Ads সরাসরি configured থাকলে)।
// =============================================================

import { TRACKING, TRACKING_ENABLED, adsSendTo } from "./tracking-config";
import { flattenAttribution } from "./attribution";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

function safePush(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...payload, ...flattenAttribution() });
}

// ------- Consent Mode v2 ----------------------------------------------------
export function setConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const state = granted ? "granted" : "denied";
  window.dataLayer.push([
    "consent",
    "update",
    {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    },
  ]);
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
  try {
    localStorage.setItem("consent_v2", state);
  } catch {
    /* noop */
  }
}

export function getStoredConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem("consent_v2");
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

// ------- Page view ----------------------------------------------------------
export function trackPageView(path: string, title?: string) {
  safePush({
    event: "page_view",
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : ""),
  });
}

// ------- CTA / Call ---------------------------------------------------------
export function trackCallButtonClick(opts: { phone?: string | null; serviceSlug?: string | null; placement?: string }) {
  const sendTo = adsSendTo(opts.serviceSlug);
  safePush({
    event: "click_call_button",
    phone_number: opts.phone ?? null,
    service: opts.serviceSlug ?? "default",
    placement: opts.placement ?? "unknown",
  });
  // Direct gtag fallback for Google Ads conversion (যদি GTM না থাকে)
  if (sendTo && typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: sendTo,
      value: 1.0,
      currency: "USD",
      transaction_id: `${opts.serviceSlug ?? "default"}-${Date.now()}`,
    });
  }
}

export function trackQualifiedCall(opts: { phone?: string | null; serviceSlug?: string | null; durationSeconds: number }) {
  if (opts.durationSeconds < TRACKING.QUALIFIED_CALL_SECONDS) return;
  safePush({
    event: "qualified_call",
    phone_number: opts.phone ?? null,
    service: opts.serviceSlug ?? "default",
    duration_seconds: opts.durationSeconds,
  });
}

export function trackWhatsAppClick(opts: { serviceSlug?: string | null }) {
  safePush({
    event: "click_whatsapp",
    service: opts.serviceSlug ?? "default",
  });
}

export function trackCtaClick(label: string, extra?: Record<string, unknown>) {
  safePush({ event: "cta_click", cta_label: label, ...extra });
}

// ------- Forms --------------------------------------------------------------
export function trackFormStart(formName: string) {
  safePush({ event: "form_start", form_name: formName });
}

export function trackFormSubmit(formName: string, extra?: Record<string, unknown>) {
  safePush({ event: "form_submit", form_name: formName, ...extra });
}

// ------- Micro conversions --------------------------------------------------
export function trackScrollDepth(percent: 25 | 50 | 75 | 100) {
  safePush({ event: "scroll_depth", percent });
}

export function trackTimeOnSite(seconds: number) {
  safePush({ event: "time_on_site", seconds });
}

// ------- Enhanced Conversions (hashed phone) -------------------------------
async function sha256(text: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return "";
  const buf = new TextEncoder().encode(text.trim().toLowerCase());
  const hash = await window.crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function setEnhancedUserData(opts: { phone?: string | null; email?: string | null }) {
  if (!TRACKING_ENABLED.ads || typeof window === "undefined") return;
  const user_data: Record<string, string> = {};
  if (opts.phone) {
    const digits = opts.phone.replace(/\D/g, "");
    if (digits) user_data.sha256_phone_number = await sha256("+" + digits);
  }
  if (opts.email) user_data.sha256_email_address = await sha256(opts.email);
  if (Object.keys(user_data).length === 0) return;
  if (typeof window.gtag === "function") {
    window.gtag("set", "user_data", user_data);
  }
  safePush({ event: "enhanced_user_data", ...user_data });
}

export { TRACKING_ENABLED };

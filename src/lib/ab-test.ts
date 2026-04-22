import { supabase } from "@/integrations/supabase/client";

// Two simultaneous tests:
//  1. Button label copy
//  2. Animation intensity
// Each visitor is bucketed once (sticky via localStorage) so the experience
// is consistent across pages, and each variant combo is counted as one
// "impression" per session — this lets us compute conversion rate
// (clicks / impressions), not just click totals.

export const LABEL_VARIANTS = ["Call Now", "Get Immediate Help"] as const;
export type LabelVariant = (typeof LABEL_VARIANTS)[number];

export const ANIM_VARIANTS = ["calm", "standard", "intense"] as const;
export type AnimVariant = (typeof ANIM_VARIANTS)[number];

const LABEL_KEY = "ab_label_variant_v1";
const ANIM_KEY = "ab_anim_variant_v1";
const SESSION_IMPRESSION_KEY = "ab_impression_logged_v1";

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function readOrAssign<T extends string>(key: string, options: readonly T[]): T {
  if (typeof window === "undefined") return options[0];
  try {
    const existing = localStorage.getItem(key) as T | null;
    if (existing && (options as readonly string[]).includes(existing)) return existing;
    const chosen = pick(options);
    localStorage.setItem(key, chosen);
    return chosen;
  } catch {
    return pick(options);
  }
}

export function getLabelVariant(): LabelVariant {
  return readOrAssign<LabelVariant>(LABEL_KEY, LABEL_VARIANTS);
}

export function getAnimVariant(): AnimVariant {
  return readOrAssign<AnimVariant>(ANIM_KEY, ANIM_VARIANTS);
}

export function getVariants() {
  return { label: getLabelVariant(), anim: getAnimVariant() };
}

/** Animation intensity → CSS classes layered on the call button. */
export function animClassesFor(variant: AnimVariant) {
  switch (variant) {
    case "calm":
      return { wrapper: "", icon: "" };
    case "intense":
      // Pulse + bouncy scale + ringing icon
      return {
        wrapper: "animate-call-pulse animate-call-bounce",
        icon: "animate-phone-ring",
      };
    case "standard":
    default:
      return { wrapper: "animate-call-pulse", icon: "animate-phone-ring" };
  }
}

/**
 * Log one impression per session for the visitor's assigned variants.
 * Safe to call on every page; deduplicated via sessionStorage.
 */
export async function logImpressionOnce() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(SESSION_IMPRESSION_KEY) === "1") return;
    const { label, anim } = getVariants();
    sessionStorage.setItem(SESSION_IMPRESSION_KEY, "1");
    await supabase.rpc("record_ab_impression", { _label: label, _anim: anim });
  } catch {
    /* never block UI */
  }
}
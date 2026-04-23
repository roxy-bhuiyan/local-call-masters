import { supabase } from "@/integrations/supabase/client";
import { getVariants } from "@/lib/ab-test";
import { trackCallButtonClick, setEnhancedUserData } from "@/lib/datalayer";
import { flattenAttribution } from "@/lib/attribution";

export async function trackCallClick(opts: {
  serviceSlug?: string | null;
  phone?: string | null;
  placement?: string;
}) {
  if (typeof window === "undefined") return;
  const { label, anim } = getVariants();
  // Enhanced Conversions: hashed phone for better Google Ads match rate.
  void setEnhancedUserData({ phone: opts.phone });
  // Fire dataLayer event + Google Ads conversion immediately so it
  // isn't lost when the browser navigates to the tel: URL.
  trackCallButtonClick({
    serviceSlug: opts.serviceSlug ?? null,
    phone: opts.phone ?? null,
    placement: opts.placement,
  });
  const attr = flattenAttribution();
  try {
    await supabase.from("call_leads").insert({
      service_slug: opts.serviceSlug ?? null,
      phone: opts.phone ?? null,
      page_path: (window.location.pathname + window.location.search).slice(0, 200),
      user_agent: navigator.userAgent.slice(0, 500),
      referrer: [
        document.referrer ? document.referrer.slice(0, 200) : "",
        attr.gclid ? `gclid=${attr.gclid}` : "",
        attr.utm_source ? `src=${attr.utm_source}` : "",
        attr.utm_campaign ? `cmp=${attr.utm_campaign}` : "",
      ].filter(Boolean).join(" | ").slice(0, 200) || null,
      ab_label_variant: label,
      ab_anim_variant: anim,
    });
  } catch {
    /* never block the call */
  }
}

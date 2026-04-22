import { supabase } from "@/integrations/supabase/client";
import { trackGoogleAdsCallConversion } from "@/lib/google-ads";

export async function trackCallClick(opts: {
  serviceSlug?: string | null;
  phone?: string | null;
}) {
  if (typeof window === "undefined") return;
  // Fire Google Ads conversion immediately so it isn't lost when the
  // browser navigates to the tel: URL.
  trackGoogleAdsCallConversion({
    serviceSlug: opts.serviceSlug ?? null,
    phone: opts.phone ?? null,
  });
  try {
    await supabase.from("call_leads").insert({
      service_slug: opts.serviceSlug ?? null,
      phone: opts.phone ?? null,
      page_path: window.location.pathname + window.location.search,
      user_agent: navigator.userAgent.slice(0, 500),
      referrer: document.referrer ? document.referrer.slice(0, 500) : null,
    });
  } catch {
    /* never block the call */
  }
}

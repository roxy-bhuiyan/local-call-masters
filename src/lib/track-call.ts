import { supabase } from "@/integrations/supabase/client";

export async function trackCallClick(opts: {
  serviceSlug?: string | null;
  phone?: string | null;
}) {
  if (typeof window === "undefined") return;
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

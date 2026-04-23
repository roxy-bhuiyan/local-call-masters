// Tracks scroll depth (50/75/100%) and time-on-site (60s) micro conversions.
import { useEffect } from "react";
import { trackScrollDepth, trackTimeOnSite } from "@/lib/datalayer";

export function EngagementTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fired = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop + window.innerHeight;
      const total = h.scrollHeight;
      if (total <= 0) return;
      const pct = Math.round((scrolled / total) * 100);
      ([50, 75, 100] as const).forEach((m) => {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          trackScrollDepth(m);
        }
      });
    };
    const t60 = window.setTimeout(() => trackTimeOnSite(60), 60_000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t60);
    };
  }, []);
  return null;
}

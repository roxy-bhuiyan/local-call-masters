import { Phone } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { SITE, SERVICES, getServicePhone, type ServiceSlug } from "@/data/site";
import { CallButton } from "./CallButton";
import { trackCallClick } from "@/lib/track-call";

function useCurrentServicePhone() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "").split("/")[0] as ServiceSlug | "";
  const match = SERVICES.find((s) => s.slug === slug);
  if (match) {
    const { phone, phoneHref } = getServicePhone(match.slug);
    return { phone, phoneHref, slug: match.slug as ServiceSlug | null };
  }
  return { phone: SITE.phone, phoneHref: SITE.phoneHref, slug: null as ServiceSlug | null };
}

export function StickyCallBar() {
  const { phone, phoneHref, slug } = useCurrentServicePhone();
  return (
    <>
      {/* Mobile: full-width sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t-2 border-accent shadow-2xl px-3 pt-2 pb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="inline-block h-2 w-2 rounded-full bg-success animate-badge-blink" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
            Live Agents • 24/7 • Tap to Call
          </span>
        </div>
        <CallButton fullWidth size="lg" phone={phone} phoneHref={phoneHref} serviceSlug={slug} />
      </div>

      {/* Desktop: floating circular call button bottom-right */}
      <a
        href={phoneHref}
        aria-label={`Call ${phone}`}
        onClick={() => trackCallClick({ serviceSlug: slug, phone })}
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-3 bg-cta-gradient text-accent-foreground font-extrabold rounded-full pl-4 pr-6 py-4 shadow-[var(--shadow-cta)] hover:brightness-110 transition-all animate-call-pulse"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 animate-call-bounce">
          <Phone className="h-6 w-6 animate-phone-ring" fill="currentColor" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest opacity-90">Call Now 24/7</span>
          <span className="text-lg">{phone}</span>
        </span>
      </a>
    </>
  );
}

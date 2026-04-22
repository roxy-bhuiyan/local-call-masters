import { CallButton } from "./CallButton";
import { SITE } from "@/data/site";

interface Props {
  title?: string;
  subtitle?: string;
}

export function CTASection({ title = "Need Help Right Now?", subtitle = "Call now and speak to a live expert — no waiting, no voicemail." }: Props) {
  return (
    <section className="relative py-16 md:py-20 bg-[var(--gradient-hero)] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <p className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground font-bold text-xs uppercase tracking-wider mb-4">Available Now</p>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{title}</h2>
        <p className="text-lg md:text-xl opacity-90 mb-8">{subtitle}</p>
        <CallButton size="xl" />
        <p className="mt-4 text-sm opacity-80">Or dial {SITE.phone} · 24/7 Live Dispatch</p>
      </div>
    </section>
  );
}

import { Shield, Star, Clock, BadgeCheck } from "lucide-react";

const items = [
  { icon: Star, label: "4.9/5 Google Reviews", sub: "2,300+ happy customers" },
  { icon: Shield, label: "Licensed & Insured", sub: "Fully bonded technicians" },
  { icon: Clock, label: "24/7 Emergency", sub: "Same-day service" },
  { icon: BadgeCheck, label: "100% Guarantee", sub: "Satisfaction promised" },
];

export function TrustBadges() {
  return (
    <section className="bg-secondary py-10">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary shadow-[var(--shadow-card)] shrink-0">
              <it.icon className="h-6 w-6" fill={it.icon === Star ? "currentColor" : "none"} />
            </div>
            <div>
              <div className="font-bold text-sm md:text-base text-foreground leading-tight">{it.label}</div>
              <div className="text-xs text-muted-foreground">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

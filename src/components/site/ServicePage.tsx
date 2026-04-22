import { CallButton } from "./CallButton";
import { TrustBadges } from "./TrustBadges";
import { CTASection } from "./CTASection";
import { Testimonials } from "./Testimonials";
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, DollarSign, Wrench, Phone, Star } from "lucide-react";
import { SITE } from "@/data/site";

export interface ServicePageProps {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  problems: string[];
  solutions: string[];
  benefits: { icon: "Clock" | "ShieldCheck" | "DollarSign" | "Wrench"; title: string; text: string }[];
  faqs: { q: string; a: string }[];
}

const iconMap = { Clock, ShieldCheck, DollarSign, Wrench };

export function ServicePage(p: ServicePageProps) {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative bg-[var(--gradient-hero)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground font-bold text-xs uppercase tracking-wider mb-4">{p.badge}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">{p.title}</h1>
            <p className="text-lg md:text-xl opacity-95 mb-6">{p.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CallButton size="xl" />
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 font-semibold border-2 border-white/40 px-6 py-4 rounded-full hover:bg-white/10">
                <Clock className="h-5 w-5" /> Same-Day Service
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-accent" fill="currentColor" /> 4.9★ rated</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Licensed & Insured</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> 24/7 Emergency</span>
            </div>
          </div>
          <div className="relative">
            <img src={p.image} alt={p.title} width={1280} height={800} loading="eager" className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3]" />
            <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground rounded-xl px-4 py-3 shadow-xl font-bold text-sm">
              ⚡ Avg. response: <span className="text-base">under 60 min</span>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* PAIN POINTS */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-bold uppercase tracking-wider text-sm mb-2">We Understand</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Sound Familiar?</h2>
            <p className="text-foreground/80 mt-2 max-w-2xl mx-auto">You shouldn't have to deal with this. Here's what our customers tell us before they call:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {p.problems.map((prob) => (
              <div key={prob} className="bg-white border-2 border-border rounded-xl p-5 flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{prob}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-accent font-bold uppercase tracking-wider text-sm mb-2">Our Solution</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground">Done Right — The First Time</h2>
            <p className="text-foreground/80 mb-6">Our certified local technicians arrive on time, diagnose the real problem, and fix it with quality parts and upfront pricing. No surprises, no callbacks.</p>
            <ul className="space-y-3">
              {p.solutions.map((s) => (
              <li key={s} className="flex items-start gap-3"><CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-0.5" /><span className="font-medium text-foreground">{s}</span></li>
              ))}
            </ul>
            <div className="mt-8"><CallButton size="lg" label="Call for Immediate Help" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {p.benefits.map((b) => {
              const Icon = iconMap[b.icon];
              return (
                <div key={b.title} className="bg-white rounded-2xl p-5 shadow-[var(--shadow-card)]">
                  <div className="h-12 w-12 rounded-xl bg-[var(--gradient-hero)] flex items-center justify-center text-white mb-3"><Icon className="h-6 w-6" /></div>
                  <h3 className="font-bold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection title="Ready to Fix the Problem?" subtitle="One quick call and we'll be on the way. Live dispatch, no voicemails." />

      <Testimonials />

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-bold uppercase tracking-wider text-sm mb-2">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {p.faqs.map((f) => (
              <details key={f.q} className="group bg-white rounded-xl p-5 border-2 border-border shadow-[var(--shadow-card)]">
                <summary className="cursor-pointer font-bold text-foreground list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-primary text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-foreground/85 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-foreground/80 mb-4">Still have questions? Talk to a real person right now.</p>
            <CallButton size="lg" label="Call Now" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-12 bg-primary-dark text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Available 24/7 — Call Now</h2>
          <p className="text-white/90 mb-6">Don't wait until it gets worse. Our team is standing by.</p>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-3 text-3xl md:text-5xl font-extrabold text-accent hover:underline">
            <Phone className="h-8 w-8 md:h-12 md:w-12" fill="currentColor" />{SITE.phone}
          </a>
        </div>
      </section>
    </main>
  );
}

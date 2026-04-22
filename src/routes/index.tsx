import { createFileRoute, Link } from "@tanstack/react-router";
import { CallButton } from "@/components/site/CallButton";
import { TrustBadges } from "@/components/site/TrustBadges";
import { CTASection } from "@/components/site/CTASection";
import { Testimonials } from "@/components/site/Testimonials";
import { SITE, SERVICES } from "@/data/site";
import { Wrench, Bug, Home as HomeIcon, Droplets, Paintbrush, ArrowRight, Clock, Award, Users, MapPin, Star, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-technician.jpg";
import imgPlumb from "@/assets/service-plumbing.jpg";
import imgPest from "@/assets/service-pest.jpg";
import imgRoof from "@/assets/service-roofing.jpg";
import imgWater from "@/assets/service-water.jpg";
import imgFloor from "@/assets/service-floor.jpg";

const iconMap = { Wrench, Bug, Home: HomeIcon, Droplets, Paintbrush };
const imgMap: Record<string, string> = {
  plumbing: imgPlumb,
  "pest-control": imgPest,
  roofing: imgRoof,
  "water-damage": imgWater,
  "floor-coating": imgFloor,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fast & Reliable Home Services Near You | ProShield" },
      { name: "description", content: "Licensed & insured plumbing, pest control, roofing, water damage & floor coating experts. Same-day service available 24/7. Call now!" },
      { property: "og:title", content: "ProShield Home Services — Call Now 24/7" },
      { property: "og:description", content: "Same-day home service experts. Licensed, insured, locally trusted." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative bg-hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground font-bold text-xs uppercase tracking-wider mb-4">⚡ Same-Day Service Available</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Fast & Reliable <span className="text-accent">Home Services</span> Near You
            </h1>
            <p className="text-lg md:text-xl opacity-95 mb-6">Licensed & insured experts ready 24/7. Speak to a live local technician in under 60 seconds.</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <CallButton size="xl" />
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 font-semibold border-2 border-white/40 px-6 py-4 rounded-full hover:bg-white/10">
                Get Free Estimate <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-accent" fill="currentColor" /> 4.9★ (2,300+ reviews)</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Licensed & Insured</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> 24/7 Emergency</span>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Friendly home service technician" width={1280} height={960} className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3]" />
            <div className="absolute -bottom-4 -right-4 bg-white text-foreground rounded-xl px-4 py-3 shadow-xl border border-border">
              <div className="text-2xl font-extrabold text-primary">{SITE.jobsCompleted}</div>
              <div className="text-xs text-foreground/70">Jobs completed</div>
            </div>
          </div>
        </div>

        {/* Department buttons */}
        <div className="relative mx-auto max-w-7xl px-4 pb-12 md:pb-20">
          <p className="text-sm uppercase tracking-wider opacity-80 mb-3 font-semibold">Choose your service:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SERVICES.map((s) => {
              const Icon = iconMap[s.icon as keyof typeof iconMap];
              return (
                <Link key={s.slug} to={`/${s.slug}` as string} className="group bg-white/10 hover:bg-white border border-white/20 rounded-xl p-4 backdrop-blur transition-all hover:text-primary text-white">
                  <Icon className="h-8 w-8 mb-2 text-accent group-hover:text-primary" />
                  <div className="font-bold">{s.name}</div>
                  <div className="text-xs opacity-80 group-hover:opacity-100">View service →</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* SERVICES OVERVIEW */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-bold uppercase tracking-wider text-sm mb-2">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Full-Service Home Specialists</h2>
            <p className="text-foreground/80 mt-2 max-w-2xl mx-auto">One trusted local team for every home emergency and upgrade.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => {
              const Icon = iconMap[s.icon as keyof typeof iconMap];
              return (
                <div key={s.slug} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-xl transition-all">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={imgMap[s.slug]} alt={s.name} loading="lazy" width={1280} height={800} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                      <h3 className="text-xl font-extrabold text-foreground">{s.name}</h3>
                    </div>
                    <p className="text-foreground/80 text-sm mb-4">{s.short}</p>
                    <div className="flex items-center justify-between">
                      <Link to={`/${s.slug}` as string} className="font-bold text-primary hover:underline inline-flex items-center gap-1">Learn More <ArrowRight className="h-4 w-4" /></Link>
                      <CallButton size="sm" label="Call" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-bold uppercase tracking-wider text-sm mb-2">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Local Experts You Can Trust</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, t: "Fast Response Time", d: "Average arrival under 60 minutes for emergencies." },
              { icon: Award, t: "Certified Technicians", d: "Background-checked, trained, and uniformed pros." },
              { icon: Users, t: `${SITE.yearsExperience}+ Years Experience`, d: `${SITE.jobsCompleted} jobs completed in your area.` },
              { icon: MapPin, t: "Local Experts", d: "Family-owned and proud to serve our neighbors." },
            ].map((it) => (
              <div key={it.t} className="bg-card border border-border rounded-2xl p-6 text-center shadow-[var(--shadow-card)]">
                <div className="mx-auto h-14 w-14 rounded-full bg-hero-gradient flex items-center justify-center text-white mb-4"><it.icon className="h-7 w-7" /></div>
                <h3 className="font-extrabold mb-1 text-foreground">{it.t}</h3>
                <p className="text-sm text-foreground/80">{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Call Now & Get Immediate Help" subtitle="Live dispatcher · No voicemails · Same-day service available" />

      <Testimonials />
    </main>
  );
}

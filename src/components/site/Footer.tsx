import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Clock, Shield } from "lucide-react";
import { SITE, SERVICES } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-extrabold mb-3">{SITE.name}</h3>
          <p className="text-sm text-primary-foreground/90">Licensed, insured & locally trusted home service experts available 24/7.</p>
          <a href={SITE.phoneHref} className="mt-4 inline-flex items-center gap-2 text-2xl font-extrabold text-accent">
            <Phone className="h-6 w-6" fill="currentColor" />{SITE.phone}
          </a>
        </div>
        <div>
          <h4 className="font-bold mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}><Link to={`/${s.slug}` as string} className="opacity-90 hover:opacity-100 hover:underline">{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Service Area</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/90">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Citywide & Surrounding Areas</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> 24/7 Emergency Service</li>
            <li className="flex items-center gap-2"><Shield className="h-4 w-4" /> Licensed & Insured</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="opacity-90 hover:underline">Home</Link></li>
            {SERVICES.map((s) => (
              <li key={s.slug}><Link to={`/${s.slug}` as string} className="opacity-90 hover:underline">{s.name} Service</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
          <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-primary-foreground/80 flex flex-col md:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Licensed & Insured · Available 24/7 · 100% Satisfaction Guaranteed</p>
        </div>
      </div>
    </footer>
  );
}

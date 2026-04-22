import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE, SERVICES } from "@/data/site";
import { CallButton } from "./CallButton";

export function TopBar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="bg-primary text-primary-foreground text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-success animate-badge-blink" />
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">{SITE.areas}</span>
            <span className="sm:hidden">24/7 Service</span>
          </div>
          <a href={SITE.phoneHref} className="flex items-center gap-2 font-extrabold text-base hover:underline">
            <Phone className="h-4 w-4 animate-phone-ring" fill="currentColor" />
            <span className="hidden xs:inline uppercase tracking-wide text-[11px] opacity-90">Call:</span>
            <span>{SITE.phone}</span>
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg md:text-xl text-primary">
            <div className="h-9 w-9 rounded-lg bg-hero-gradient flex items-center justify-center text-white">
              <Phone className="h-5 w-5" fill="currentColor" />
            </div>
            <span>{SITE.name}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-foreground">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="hover:text-primary">Home</Link>
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/${s.slug}` as string} activeProps={{ className: "text-primary" }} className="hover:text-primary">
                {s.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CallButton size="sm" />
            </div>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground" aria-label="Menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-card">
            <nav className="flex flex-col px-4 py-2">
              <Link to="/" onClick={() => setOpen(false)} className="py-3 font-semibold border-b border-border">Home</Link>
              {SERVICES.map((s) => (
                <Link key={s.slug} to={`/${s.slug}` as string} onClick={() => setOpen(false)} className="py-3 font-semibold border-b border-border last:border-0">
                  {s.name}
                </Link>
              ))}
              <div className="py-3 sm:hidden">
                <CallButton fullWidth />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

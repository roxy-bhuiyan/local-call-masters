import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Check } from "lucide-react";

interface Service {
  slug: string;
  name: string;
  short: string;
  icon: string;
  phone: string;
  phone_href: string;
  sort_order: number;
}

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const [items, setItems] = useState<Service[] | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  function update(slug: string, patch: Partial<Service>) {
    setItems((cur) => cur?.map((s) => (s.slug === slug ? { ...s, ...patch } : s)) ?? null);
  }

  async function save(s: Service) {
    setSavingSlug(s.slug);
    await supabase.from("services").update({
      name: s.name, short: s.short, phone: s.phone, phone_href: s.phone_href, updated_at: new Date().toISOString(),
    }).eq("slug", s.slug);
    setSavingSlug(null);
    setSavedSlug(s.slug);
    setTimeout(() => setSavedSlug(null), 1500);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Department Phone Numbers</h1>
        <p className="text-foreground/70 text-sm">
          Edit the tracking phone number for each service. Changes go live immediately on the public site.
        </p>
      </div>

      {items === null ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.slug} className="bg-white border border-border rounded-xl p-5 grid md:grid-cols-[180px,1fr,auto] gap-4 items-start">
              <div>
                <div className="font-extrabold text-foreground capitalize">{s.name}</div>
                <code className="text-xs text-foreground/60">/{s.slug}</code>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Display phone</label>
                  <input
                    value={s.phone} onChange={(e) => update(s.slug, { phone: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 font-mono text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60">tel: link</label>
                  <input
                    value={s.phone_href} onChange={(e) => update(s.slug, { phone_href: e.target.value })}
                    placeholder="tel:+18885550111"
                    className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 font-mono text-foreground"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Short description</label>
                  <input
                    value={s.short} onChange={(e) => update(s.slug, { short: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-foreground"
                  />
                </div>
              </div>
              <button
                onClick={() => save(s)} disabled={savingSlug === s.slug}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold disabled:opacity-60"
              >
                {savingSlug === s.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : savedSlug === s.slug ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

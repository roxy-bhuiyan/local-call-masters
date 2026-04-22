import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Trash2, Plus, Check } from "lucide-react";

interface Testimonial {
  id: string;
  customer_name: string;
  city: string;
  service: string;
  text: string;
  rating: number;
  sort_order: number;
}

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsAdmin,
});

function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  function update(id: string, patch: Partial<Testimonial>) {
    setItems((cur) => cur?.map((t) => (t.id === id ? { ...t, ...patch } : t)) ?? null);
  }
  async function save(t: Testimonial) {
    setBusy(t.id);
    await supabase.from("testimonials").update({
      customer_name: t.customer_name, city: t.city, service: t.service, text: t.text,
      rating: t.rating, sort_order: t.sort_order, updated_at: new Date().toISOString(),
    }).eq("id", t.id);
    setBusy(null); setSaved(t.id); setTimeout(() => setSaved(null), 1200);
  }
  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  }
  async function add() {
    const next = (items?.length ?? 0) + 1;
    await supabase.from("testimonials").insert({
      customer_name: "New Customer", city: "Local", service: "Plumbing", text: "Great service!", rating: 5, sort_order: next,
    });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Testimonials</h1>
          <p className="text-foreground/70 text-sm">Reviews displayed on the homepage and service pages.</p>
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground font-bold">
          <Plus className="h-4 w-4" /> Add review
        </button>
      </div>

      {items === null ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center text-foreground/60">No testimonials yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {items.map((t) => (
            <div key={t.id} className="bg-white border border-border rounded-xl p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={t.customer_name} onChange={(e) => update(t.id, { customer_name: e.target.value })}
                  className="rounded-md border border-input bg-white px-3 py-2 font-bold text-foreground" placeholder="Name" />
                <input value={t.city} onChange={(e) => update(t.id, { city: e.target.value })}
                  className="rounded-md border border-input bg-white px-3 py-2 text-foreground" placeholder="City" />
                <input value={t.service} onChange={(e) => update(t.id, { service: e.target.value })}
                  className="rounded-md border border-input bg-white px-3 py-2 text-foreground" placeholder="Service" />
                <input type="number" min={1} max={5} value={t.rating} onChange={(e) => update(t.id, { rating: Number(e.target.value) })}
                  className="rounded-md border border-input bg-white px-3 py-2 text-foreground" placeholder="Rating" />
              </div>
              <textarea value={t.text} onChange={(e) => update(t.id, { text: e.target.value })}
                rows={3} className="w-full rounded-md border border-input bg-white px-3 py-2 text-foreground" />
              <div className="flex items-center justify-between">
                <label className="text-xs text-foreground/60 inline-flex items-center gap-2">
                  Order:
                  <input type="number" value={t.sort_order} onChange={(e) => update(t.id, { sort_order: Number(e.target.value) })}
                    className="w-16 rounded-md border border-input bg-white px-2 py-1" />
                </label>
                <div className="flex gap-2">
                  <button onClick={() => remove(t.id)} className="px-3 py-1.5 rounded-full text-destructive hover:bg-destructive/10 inline-flex items-center gap-1.5 text-sm font-semibold">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                  <button onClick={() => save(t)} disabled={busy === t.id} className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-bold inline-flex items-center gap-1.5 text-sm">
                    {busy === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : saved === t.id ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

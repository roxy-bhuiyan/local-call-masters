import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Trash2, Plus, Check } from "lucide-react";

interface Faq {
  id: string;
  service_slug: string;
  question: string;
  answer: string;
  sort_order: number;
}

export const Route = createFileRoute("/admin/faqs")({
  component: FaqsAdmin,
});

function FaqsAdmin() {
  const [services, setServices] = useState<{ slug: string; name: string }[]>([]);
  const [active, setActive] = useState<string>("plumbing");
  const [items, setItems] = useState<Faq[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function loadServices() {
    const { data } = await supabase.from("services").select("slug, name").order("sort_order");
    setServices(data ?? []);
  }
  async function loadFaqs(slug: string) {
    setItems(null);
    const { data } = await supabase.from("faqs").select("*").eq("service_slug", slug).order("sort_order");
    setItems(data ?? []);
  }
  useEffect(() => { loadServices(); }, []);
  useEffect(() => { loadFaqs(active); }, [active]);

  function update(id: string, patch: Partial<Faq>) {
    setItems((cur) => cur?.map((f) => (f.id === id ? { ...f, ...patch } : f)) ?? null);
  }
  async function save(f: Faq) {
    setBusy(f.id);
    await supabase.from("faqs").update({
      question: f.question, answer: f.answer, sort_order: f.sort_order, updated_at: new Date().toISOString(),
    }).eq("id", f.id);
    setBusy(null); setSaved(f.id); setTimeout(() => setSaved(null), 1200);
  }
  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    loadFaqs(active);
  }
  async function add() {
    const next = (items?.length ?? 0) + 1;
    await supabase.from("faqs").insert({
      service_slug: active, question: "New question", answer: "Answer here.", sort_order: next,
    });
    loadFaqs(active);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">FAQs</h1>
          <p className="text-foreground/70 text-sm">Manage the questions shown on each service page.</p>
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground font-bold">
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {services.map((s) => (
          <button
            key={s.slug} onClick={() => setActive(s.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold ${active === s.slug ? "bg-primary text-primary-foreground" : "bg-white border border-border text-foreground"}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {items === null ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center text-foreground/60">No FAQs yet. Click "Add FAQ".</div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="bg-white border border-border rounded-xl p-4 space-y-2">
              <input
                value={f.question} onChange={(e) => update(f.id, { question: e.target.value })}
                className="w-full rounded-md border border-input bg-white px-3 py-2 font-bold text-foreground"
              />
              <textarea
                value={f.answer} onChange={(e) => update(f.id, { answer: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-foreground"
              />
              <div className="flex items-center justify-between">
                <label className="text-xs text-foreground/60 inline-flex items-center gap-2">
                  Order:
                  <input type="number" value={f.sort_order} onChange={(e) => update(f.id, { sort_order: Number(e.target.value) })}
                    className="w-16 rounded-md border border-input bg-white px-2 py-1" />
                </label>
                <div className="flex gap-2">
                  <button onClick={() => remove(f.id)} className="px-3 py-1.5 rounded-full text-destructive hover:bg-destructive/10 inline-flex items-center gap-1.5 text-sm font-semibold">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                  <button onClick={() => save(f)} disabled={busy === f.id} className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-bold inline-flex items-center gap-1.5 text-sm">
                    {busy === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : saved === f.id ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
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

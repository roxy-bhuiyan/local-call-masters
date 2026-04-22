import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Trash2, Loader2 } from "lucide-react";

interface Lead {
  id: string;
  service_slug: string | null;
  page_path: string | null;
  phone: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
}

export const Route = createFileRoute("/admin/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<string>("");

  async function load() {
    const { data } = await supabase
      .from("call_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setLeads(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("call_leads").delete().eq("id", id);
    load();
  }

  const filtered = (leads ?? []).filter((l) => !filter || l.service_slug === filter);
  const services = Array.from(new Set((leads ?? []).map((l) => l.service_slug).filter(Boolean))) as string[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Call Leads</h1>
          <p className="text-foreground/70 text-sm">Every Call Now click is logged here.</p>
        </div>
        <select
          value={filter} onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-input bg-white px-3 py-2 text-sm font-semibold text-foreground"
        >
          <option value="">All departments</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {leads === null ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center text-foreground/60">
          No call leads yet. Try clicking a Call Now button on the site.
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary text-foreground">
                <tr>
                  <th className="text-left p-3 font-bold">When</th>
                  <th className="text-left p-3 font-bold">Department</th>
                  <th className="text-left p-3 font-bold">Phone</th>
                  <th className="text-left p-3 font-bold">Page</th>
                  <th className="text-left p-3 font-bold">Referrer</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="p-3 text-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="p-3 text-foreground capitalize">{(l.service_slug || "—").replace(/-/g, " ")}</td>
                    <td className="p-3 text-foreground">
                      {l.phone ? <span className="inline-flex items-center gap-1 font-mono"><Phone className="h-3 w-3" /> {l.phone}</span> : "—"}
                    </td>
                    <td className="p-3 text-foreground/80 max-w-[200px] truncate" title={l.page_path || ""}>{l.page_path || "—"}</td>
                    <td className="p-3 text-foreground/60 max-w-[200px] truncate" title={l.referrer || ""}>{l.referrer || "Direct"}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => remove(l.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

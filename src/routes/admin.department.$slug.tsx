import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES, getServicePhone, type ServiceSlug } from "@/data/site";
import { ArrowLeft, Phone, Calendar, TrendingUp, Clock, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/department/$slug")({
  beforeLoad: ({ params }) => {
    const ok = SERVICES.some((s) => s.slug === params.slug);
    if (!ok) throw notFound();
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Admin | ProShield` }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ServiceDetail,
});

type Lead = {
  id: string;
  created_at: string;
  page_path: string | null;
  phone: string | null;
  referrer: string | null;
  user_agent: string | null;
  ab_label_variant: string | null;
  ab_anim_variant: string | null;
};

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = SERVICES.find((s) => s.slug === (slug as ServiceSlug))!;
  const { phone, phoneHref } = getServicePhone(service.slug);

  const [leads, setLeads] = useState<Lead[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("call_leads")
        .select("id, created_at, page_path, phone, referrer, user_agent, ab_label_variant, ab_anim_variant")
        .eq("service_slug", slug)
        .order("created_at", { ascending: false })
        .limit(500);
      setLeads(data ?? []);
    })();
  }, [slug]);

  const now = Date.now();
  const total = leads?.length ?? 0;
  const today = leads?.filter((l) => now - new Date(l.created_at).getTime() < 24 * 3600 * 1000).length ?? 0;
  const week = leads?.filter((l) => now - new Date(l.created_at).getTime() < 7 * 24 * 3600 * 1000).length ?? 0;

  const abMap = new Map<string, number>();
  leads?.forEach((l) => {
    const key = `${l.ab_label_variant ?? "—"} · ${l.ab_anim_variant ?? "—"}`;
    abMap.set(key, (abMap.get(key) || 0) + 1);
  });
  const abBreakdown = [...abMap.entries()].map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v);

  const cards = [
    { label: "Calls today", value: today, icon: Clock },
    { label: "Calls this week", value: week, icon: Calendar },
    { label: "All-time calls", value: total, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-primary mb-1">
            <ArrowLeft className="h-4 w-4" /> Back to overview
          </Link>
          <h1 className="text-2xl font-extrabold text-foreground">{service.name}</h1>
          <p className="text-foreground/70 text-sm">Department-specific call performance & lead history.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={phoneHref} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm">
            <Phone className="h-4 w-4" fill="currentColor" /> {phone}
          </a>
          <a href={`/${service.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-secondary text-foreground font-semibold text-sm hover:bg-muted">
            <ExternalLink className="h-4 w-4" /> View page
          </a>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><c.icon className="h-5 w-5" /></div>
              <div className="text-sm text-foreground/70 font-semibold">{c.label}</div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">{leads === null ? "—" : c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-bold text-foreground mb-3">A/B variant performance</h2>
        {leads === null ? <p className="text-sm text-foreground/60">Loading…</p> : abBreakdown.length === 0 ? (
          <p className="text-sm text-foreground/60">No tracked calls with A/B data yet.</p>
        ) : (
          <ul className="space-y-2">
            {abBreakdown.map((row) => (
              <li key={row.k} className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2 text-sm">
                <span className="font-semibold text-foreground">{row.k}</span>
                <span className="font-extrabold text-primary">{row.v}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">Recent leads ({total})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-foreground/70">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">When</th>
                <th className="text-left px-4 py-2 font-semibold">Page</th>
                <th className="text-left px-4 py-2 font-semibold">Phone</th>
                <th className="text-left px-4 py-2 font-semibold">Variant</th>
                <th className="text-left px-4 py-2 font-semibold">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {leads === null ? (
                <tr><td colSpan={5} className="px-4 py-6 text-foreground/60">Loading…</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-foreground/60">No leads for this department yet.</td></tr>
              ) : leads.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 truncate max-w-[200px]">{l.page_path ?? "—"}</td>
                  <td className="px-4 py-2">{l.phone ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{(l.ab_label_variant ?? "—") + " / " + (l.ab_anim_variant ?? "—")}</td>
                  <td className="px-4 py-2 truncate max-w-[200px] text-foreground/70">{l.referrer ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

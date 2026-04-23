import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phone, TrendingUp, Calendar, FileText, ChevronRight } from "lucide-react";
import { SERVICES } from "@/data/site";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const [stats, setStats] = useState<{ total: number; today: number; week: number; byService: { slug: string; count: number }[] } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: leads } = await supabase
        .from("call_leads")
        .select("service_slug, created_at")
        .order("created_at", { ascending: false });
      const all = leads ?? [];
      const now = Date.now();
      const today = all.filter((l) => now - new Date(l.created_at).getTime() < 24 * 3600 * 1000).length;
      const week = all.filter((l) => now - new Date(l.created_at).getTime() < 7 * 24 * 3600 * 1000).length;
      const byMap = new Map<string, number>();
      all.forEach((l) => {
        const k = l.service_slug || "unknown";
        byMap.set(k, (byMap.get(k) || 0) + 1);
      });
      const byService = [...byMap.entries()].map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count);
      setStats({ total: all.length, today, week, byService });
    })();
  }, []);

  const cards = [
    { label: "Calls today", value: stats?.today ?? "—", icon: Phone },
    { label: "Calls this week", value: stats?.week ?? "—", icon: Calendar },
    { label: "All-time calls", value: stats?.total ?? "—", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Overview</h1>
        <p className="text-foreground/70 text-sm">Inbound call activity and quick links.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><c.icon className="h-5 w-5" /></div>
              <div className="text-sm text-foreground/70 font-semibold">{c.label}</div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-bold text-foreground mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Calls by department</h2>
        {!stats ? <p className="text-sm text-foreground/60">Loading…</p> : (
          <ul className="space-y-2">
            {SERVICES.map((svc) => {
              const count = stats.byService.find((b) => b.slug === svc.slug)?.count ?? 0;
              return (
                <li key={svc.slug}>
                  <Link
                    to="/admin/department/$slug"
                    params={{ slug: svc.slug }}
                    className="flex items-center justify-between bg-secondary hover:bg-muted rounded-lg px-3 py-2 transition"
                  >
                    <span className="font-semibold text-foreground">{svc.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-extrabold text-primary">{count}</span>
                      <ChevronRight className="h-4 w-4 text-foreground/50" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

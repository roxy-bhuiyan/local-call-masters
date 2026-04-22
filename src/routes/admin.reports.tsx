import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/data/site";
import { BarChart3, Calendar, Download, Loader2, Phone, TrendingUp } from "lucide-react";

interface Lead {
  id: string;
  service_slug: string | null;
  page_path: string | null;
  created_at: string;
}

type Preset = "today" | "7d" | "30d" | "90d" | "custom";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{ title: "Conversion Reports | Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ReportsPage,
});

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function isoDate(d: Date) {
  // YYYY-MM-DD in local time
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseLocalDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function ReportsPage() {
  const [preset, setPreset] = useState<Preset>("7d");
  const [from, setFrom] = useState<string>(() => isoDate(new Date(Date.now() - 6 * 86_400_000)));
  const [to, setTo] = useState<string>(() => isoDate(new Date()));
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply preset to from/to
  useEffect(() => {
    if (preset === "custom") return;
    const today = new Date();
    const days = preset === "today" ? 0 : preset === "7d" ? 6 : preset === "30d" ? 29 : 89;
    setFrom(isoDate(new Date(today.getTime() - days * 86_400_000)));
    setTo(isoDate(today));
  }, [preset]);

  // Fetch data when range changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const fromTs = startOfDay(parseLocalDate(from)).toISOString();
      const toTs = endOfDay(parseLocalDate(to)).toISOString();
      const { data, error } = await supabase
        .from("call_leads")
        .select("id,service_slug,page_path,created_at")
        .gte("created_at", fromTs)
        .lte("created_at", toTs)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (cancelled) return;
      if (error) setError(error.message);
      setLeads(data ?? []);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const stats = useMemo(() => computeStats(leads ?? [], from, to), [leads, from, to]);

  function exportCsv() {
    const rows = [
      ["Date", "Service", "Conversions"],
      ...stats.byDayService.map((r) => [r.date, r.service, String(r.count)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `call-conversions_${from}_to_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> Conversion Reports
        </h1>
        <p className="text-foreground/70 text-sm">Call-Now conversions by service and date range, sourced from tracked clicks.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-1">
          {(["today", "7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                preset === p ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {p === "today" ? "Today" : `Last ${p === "7d" ? "7" : p === "30d" ? "30" : "90"} days`}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground/60">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => { setPreset("custom"); setFrom(e.target.value); }}
              className="rounded-md border border-input bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground/60">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => { setPreset("custom"); setTo(e.target.value); }}
              className="rounded-md border border-input bg-white px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-foreground/60 inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {stats.dayCount} day{stats.dayCount === 1 ? "" : "s"}
          </span>
          <button
            onClick={exportCsv}
            disabled={!leads || leads.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-semibold text-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-3 text-sm">
          Failed to load: {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Conversions" value={stats.total} icon={<Phone className="h-4 w-4" />} />
        <StatCard label="Daily Average" value={stats.avgPerDay.toFixed(1)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Best Day" value={stats.bestDay ? `${stats.bestDay.count}` : "—"} sub={stats.bestDay?.date} />
        <StatCard label="Top Service" value={stats.topService ? prettySlug(stats.topService.service) : "—"} sub={stats.topService ? `${stats.topService.count} calls` : undefined} />
      </div>

      {loading && leads === null ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* By service */}
          <section className="bg-white border border-border rounded-xl p-4">
            <h2 className="font-extrabold text-foreground mb-3">Conversions by Service</h2>
            {stats.byService.length === 0 ? (
              <p className="text-sm text-foreground/60">No conversions in this range.</p>
            ) : (
              <div className="space-y-2">
                {stats.byService.map((row) => {
                  const pct = stats.total ? Math.round((row.count / stats.total) * 100) : 0;
                  return (
                    <div key={row.service} className="flex items-center gap-3">
                      <div className="w-36 shrink-0 text-sm font-semibold text-foreground capitalize">{prettySlug(row.service)}</div>
                      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-24 text-right text-sm font-bold tabular-nums text-foreground">
                        {row.count} <span className="text-foreground/50 font-normal">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* By day chart */}
          <section className="bg-white border border-border rounded-xl p-4">
            <h2 className="font-extrabold text-foreground mb-3">Conversions Over Time</h2>
            {stats.byDay.length === 0 ? (
              <p className="text-sm text-foreground/60">No data.</p>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {stats.byDay.map((d) => {
                  const pct = stats.maxDay ? (d.count / stats.maxDay) * 100 : 0;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group min-w-0">
                      <div className="text-[10px] text-foreground/60 tabular-nums opacity-0 group-hover:opacity-100">{d.count}</div>
                      <div className="w-full bg-primary/80 hover:bg-primary rounded-t" style={{ height: `${pct}%`, minHeight: d.count > 0 ? 2 : 0 }} title={`${d.date}: ${d.count}`} />
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-2 flex justify-between text-[10px] text-foreground/50 tabular-nums">
              <span>{stats.byDay[0]?.date}</span>
              <span>{stats.byDay[stats.byDay.length - 1]?.date}</span>
            </div>
          </section>

          {/* Day x Service pivot */}
          <section className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-4 pt-4">
              <h2 className="font-extrabold text-foreground">Daily Breakdown by Service</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-secondary text-foreground">
                  <tr>
                    <th className="text-left p-3 font-bold">Date</th>
                    {stats.serviceCols.map((s) => (
                      <th key={s} className="text-right p-3 font-bold capitalize">{prettySlug(s)}</th>
                    ))}
                    <th className="text-right p-3 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.pivot.map((row) => (
                    <tr key={row.date} className="border-t border-border">
                      <td className="p-3 font-semibold text-foreground whitespace-nowrap">{row.date}</td>
                      {stats.serviceCols.map((s) => (
                        <td key={s} className="p-3 text-right tabular-nums text-foreground/80">{row.counts[s] ?? 0}</td>
                      ))}
                      <td className="p-3 text-right tabular-nums font-extrabold text-foreground">{row.total}</td>
                    </tr>
                  ))}
                  {stats.pivot.length === 0 && (
                    <tr><td colSpan={stats.serviceCols.length + 2} className="p-6 text-center text-foreground/60">No conversions in this range.</td></tr>
                  )}
                </tbody>
                {stats.pivot.length > 0 && (
                  <tfoot className="bg-secondary/50">
                    <tr>
                      <td className="p-3 font-extrabold text-foreground">Total</td>
                      {stats.serviceCols.map((s) => (
                        <td key={s} className="p-3 text-right tabular-nums font-extrabold text-foreground">
                          {stats.byService.find((r) => r.service === s)?.count ?? 0}
                        </td>
                      ))}
                      <td className="p-3 text-right tabular-nums font-extrabold text-primary">{stats.total}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="text-[11px] uppercase tracking-wider font-bold text-foreground/60 flex items-center gap-1.5">{icon}{label}</div>
      <div className="text-2xl font-extrabold text-foreground mt-1 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-foreground/60 mt-0.5">{sub}</div>}
    </div>
  );
}

function prettySlug(slug: string) {
  if (slug === "_unknown") return "Generic / Site-wide";
  return slug.replace(/-/g, " ");
}

function computeStats(leads: Lead[], from: string, to: string) {
  const fromD = parseLocalDate(from);
  const toD = parseLocalDate(to);
  const dayCount = Math.max(1, Math.round((endOfDay(toD).getTime() - startOfDay(fromD).getTime()) / 86_400_000));

  // Build day list
  const days: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    days.push(isoDate(new Date(startOfDay(fromD).getTime() + i * 86_400_000)));
  }

  const byServiceMap = new Map<string, number>();
  const byDayMap = new Map<string, number>();
  const pivotMap = new Map<string, Record<string, number>>();
  for (const day of days) {
    byDayMap.set(day, 0);
    pivotMap.set(day, {});
  }

  for (const l of leads) {
    const service = l.service_slug || "_unknown";
    const day = isoDate(new Date(l.created_at));
    byServiceMap.set(service, (byServiceMap.get(service) ?? 0) + 1);
    if (byDayMap.has(day)) byDayMap.set(day, (byDayMap.get(day) ?? 0) + 1);
    const pivot = pivotMap.get(day);
    if (pivot) pivot[service] = (pivot[service] ?? 0) + 1;
  }

  // Service columns: known services first (for stable order), then any extras
  const knownSlugs = SERVICES.map((s) => s.slug as string);
  const extras = Array.from(byServiceMap.keys()).filter((s) => !knownSlugs.includes(s));
  const serviceCols = [...knownSlugs.filter((s) => byServiceMap.has(s)), ...extras];

  const byService = serviceCols
    .map((service) => ({ service, count: byServiceMap.get(service) ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const byDay = days.map((date) => ({ date, count: byDayMap.get(date) ?? 0 }));
  const total = leads.length;
  const maxDay = byDay.reduce((m, d) => Math.max(m, d.count), 0);
  const bestDay = byDay.reduce<{ date: string; count: number } | null>(
    (best, d) => (!best || d.count > best.count ? { date: d.date, count: d.count } : best),
    null,
  );
  const topService = byService[0] && byService[0].count > 0 ? byService[0] : null;
  const avgPerDay = total / dayCount;

  const pivot = days.map((date) => {
    const counts = pivotMap.get(date) ?? {};
    const rowTotal = Object.values(counts).reduce((a, b) => a + b, 0);
    return { date, counts, total: rowTotal };
  });

  // Flat day x service rows for CSV export
  const byDayService: { date: string; service: string; count: number }[] = [];
  for (const date of days) {
    const counts = pivotMap.get(date) ?? {};
    for (const service of serviceCols) {
      byDayService.push({ date, service, count: counts[service] ?? 0 });
    }
  }

  return {
    total,
    dayCount,
    avgPerDay,
    bestDay: bestDay && bestDay.count > 0 ? bestDay : null,
    topService,
    byService,
    byDay,
    maxDay,
    serviceCols,
    pivot,
    byDayService,
  };
}
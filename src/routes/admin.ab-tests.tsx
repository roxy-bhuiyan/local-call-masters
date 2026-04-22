import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LABEL_VARIANTS, ANIM_VARIANTS } from "@/lib/ab-test";
import { FlaskConical, Loader2, RefreshCw, Trash2, Trophy } from "lucide-react";

interface ImpressionRow {
  day: string;
  label_variant: string;
  anim_variant: string;
  count: number;
}
interface LeadRow {
  ab_label_variant: string | null;
  ab_anim_variant: string | null;
  created_at: string;
}

export const Route = createFileRoute("/admin/ab-tests")({
  head: () => ({ meta: [{ title: "A/B Tests | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AbTestsPage,
});

type Preset = "7d" | "30d" | "90d" | "all";

function AbTestsPage() {
  const [preset, setPreset] = useState<Preset>("30d");
  const [impressions, setImpressions] = useState<ImpressionRow[] | null>(null);
  const [leads, setLeads] = useState<LeadRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const sinceISO =
      preset === "all"
        ? null
        : new Date(Date.now() - (preset === "7d" ? 7 : preset === "30d" ? 30 : 90) * 86_400_000).toISOString();

    const impQ = supabase.from("ab_impressions").select("day,label_variant,anim_variant,count").order("day", { ascending: false }).limit(5000);
    if (sinceISO) impQ.gte("day", sinceISO.slice(0, 10));

    const leadQ = supabase.from("call_leads").select("ab_label_variant,ab_anim_variant,created_at").order("created_at", { ascending: false }).limit(5000);
    if (sinceISO) leadQ.gte("created_at", sinceISO);

    const [impRes, leadRes] = await Promise.all([impQ, leadQ]);
    if (impRes.error) setError(impRes.error.message);
    if (leadRes.error) setError((e) => e ?? leadRes.error!.message);
    setImpressions(impRes.data ?? []);
    setLeads(leadRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [preset]);

  const labelStats = useMemo(
    () => buildStats(impressions ?? [], leads ?? [], "label"),
    [impressions, leads],
  );
  const animStats = useMemo(
    () => buildStats(impressions ?? [], leads ?? [], "anim"),
    [impressions, leads],
  );

  async function resetMyVariant() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("ab_label_variant_v1");
    localStorage.removeItem("ab_anim_variant_v1");
    sessionStorage.removeItem("ab_impression_logged_v1");
    alert("Your local A/B variants were cleared. Refresh the public site to be re-bucketed.");
  }

  async function resetAllData() {
    if (!confirm("Reset ALL A/B impression counts? Call leads will be kept but their variant labels will be cleared. This cannot be undone.")) return;
    setResetting(true);
    const a = await supabase.from("ab_impressions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const b = await supabase.from("call_leads").update({ ab_label_variant: null, ab_anim_variant: null }).not("ab_label_variant", "is", null);
    setResetting(false);
    if (a.error || b.error) {
      alert(`Reset failed: ${a.error?.message ?? b.error?.message}`);
      return;
    }
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" /> A/B Tests
          </h1>
          <p className="text-foreground/70 text-sm">
            Live experiment on the Call Now button: button copy and animation intensity. Visitors are bucketed once and tracked across pages.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["7d", "30d", "90d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                preset === p ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {p === "all" ? "All time" : `Last ${p === "7d" ? "7" : p === "30d" ? "30" : "90"} days`}
            </button>
          ))}
          <button onClick={load} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-muted">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      {loading && impressions === null ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <>
          <ExperimentCard
            title="Test 1 — Button Label Copy"
            subtitle={`Variants: ${LABEL_VARIANTS.join(" vs ")}`}
            stats={labelStats}
          />
          <ExperimentCard
            title="Test 2 — Animation Intensity"
            subtitle={`Variants: ${ANIM_VARIANTS.join(" / ")}`}
            stats={animStats}
          />

          <section className="bg-white border border-border rounded-xl p-4 space-y-2">
            <h3 className="font-extrabold text-foreground">How it works</h3>
            <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1">
              <li>Each visitor is randomly assigned one label variant and one animation variant on first visit (sticky in localStorage).</li>
              <li>One impression per session is recorded per variant combo via a secure backend function.</li>
              <li>Every Call Now click logs the variants the visitor saw, so we can compute true conversion rate (clicks ÷ impressions).</li>
              <li>Contextual buttons with custom copy (e.g. "Call for Immediate Help") are excluded from the label test but still record animation impressions.</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={resetMyVariant} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-muted inline-flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" /> Re-bucket me
              </button>
              <button
                onClick={resetAllData}
                disabled={resetting}
                className="text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 inline-flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Reset experiment data
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

interface VariantStat {
  variant: string;
  impressions: number;
  clicks: number;
  cvr: number;
  isWinner: boolean;
  liftPct: number | null;
  significant: boolean;
}
interface BuiltStats {
  rows: VariantStat[];
  totalImpressions: number;
  totalClicks: number;
}

function buildStats(impressions: ImpressionRow[], leads: LeadRow[], dim: "label" | "anim"): BuiltStats {
  const impMap = new Map<string, number>();
  for (const i of impressions) {
    const key = dim === "label" ? i.label_variant : i.anim_variant;
    if (!key) continue;
    impMap.set(key, (impMap.get(key) ?? 0) + i.count);
  }
  const clickMap = new Map<string, number>();
  for (const l of leads) {
    const key = dim === "label" ? l.ab_label_variant : l.ab_anim_variant;
    if (!key) continue;
    clickMap.set(key, (clickMap.get(key) ?? 0) + 1);
  }
  const variants = Array.from(new Set([...impMap.keys(), ...clickMap.keys()])).sort();

  const rows: VariantStat[] = variants.map((variant) => {
    const impressions = impMap.get(variant) ?? 0;
    const clicks = clickMap.get(variant) ?? 0;
    const cvr = impressions > 0 ? clicks / impressions : 0;
    return { variant, impressions, clicks, cvr, isWinner: false, liftPct: null, significant: false };
  });

  const eligible = rows.filter((r) => r.impressions > 0);
  const winner = eligible.reduce<VariantStat | null>((best, r) => (!best || r.cvr > best.cvr ? r : best), null);
  const baseline = eligible.reduce<VariantStat | null>((b, r) => (!b || r.cvr < b.cvr ? r : b), null);

  for (const r of rows) {
    if (winner && r.variant === winner.variant && winner.clicks > 0) r.isWinner = true;
    if (baseline && r.variant !== baseline.variant && baseline.cvr > 0) {
      r.liftPct = ((r.cvr - baseline.cvr) / baseline.cvr) * 100;
    }
    // Rough two-proportion z-test vs baseline
    if (baseline && r.variant !== baseline.variant) {
      r.significant = isSignificant(r.clicks, r.impressions, baseline.clicks, baseline.impressions);
    }
  }

  return {
    rows,
    totalImpressions: rows.reduce((s, r) => s + r.impressions, 0),
    totalClicks: rows.reduce((s, r) => s + r.clicks, 0),
  };
}

// Two-proportion z-test, |z| > 1.96 ≈ 95% confidence.
function isSignificant(c1: number, n1: number, c2: number, n2: number) {
  if (n1 < 30 || n2 < 30) return false;
  const p1 = c1 / n1;
  const p2 = c2 / n2;
  const p = (c1 + c2) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
  if (se === 0) return false;
  const z = (p1 - p2) / se;
  return Math.abs(z) >= 1.96;
}

function ExperimentCard({ title, subtitle, stats }: { title: string; subtitle: string; stats: BuiltStats }) {
  const maxCvr = Math.max(0.0001, ...stats.rows.map((r) => r.cvr));
  return (
    <section className="bg-white border border-border rounded-xl p-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <div>
          <h2 className="font-extrabold text-foreground">{title}</h2>
          <p className="text-xs text-foreground/60">{subtitle}</p>
        </div>
        <div className="text-xs text-foreground/60 tabular-nums">
          {stats.totalImpressions.toLocaleString()} impressions · {stats.totalClicks.toLocaleString()} calls
        </div>
      </div>
      {stats.rows.length === 0 ? (
        <p className="text-sm text-foreground/60">No data yet. Visit the public site in a fresh browser to generate impressions.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="text-left p-3 font-bold">Variant</th>
                <th className="text-right p-3 font-bold">Impressions</th>
                <th className="text-right p-3 font-bold">Calls</th>
                <th className="text-right p-3 font-bold">CVR</th>
                <th className="text-left p-3 font-bold w-1/3">Conversion rate</th>
                <th className="text-right p-3 font-bold">Lift</th>
              </tr>
            </thead>
            <tbody>
              {stats.rows.map((r) => (
                <tr key={r.variant} className="border-t border-border">
                  <td className="p-3 font-semibold text-foreground">
                    <span className="inline-flex items-center gap-2">
                      {r.isWinner && <Trophy className="h-4 w-4 text-accent" />}
                      {r.variant}
                    </span>
                  </td>
                  <td className="p-3 text-right tabular-nums text-foreground/80">{r.impressions.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums text-foreground/80">{r.clicks.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums font-extrabold text-foreground">{(r.cvr * 100).toFixed(2)}%</td>
                  <td className="p-3">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${r.isWinner ? "bg-accent" : "bg-primary"}`} style={{ width: `${(r.cvr / maxCvr) * 100}%` }} />
                    </div>
                  </td>
                  <td className="p-3 text-right tabular-nums">
                    {r.liftPct === null ? (
                      <span className="text-foreground/40">baseline</span>
                    ) : (
                      <span className={`font-bold ${r.liftPct >= 0 ? "text-success" : "text-destructive"}`}>
                        {r.liftPct >= 0 ? "+" : ""}{r.liftPct.toFixed(1)}%
                        {r.significant && <span className="ml-1 text-[10px] uppercase tracking-wider text-success/80">sig.</span>}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
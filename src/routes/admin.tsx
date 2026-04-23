import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Phone, FileText, MessageSquareQuote, LogOut, Loader2, ShieldAlert, BarChart3, FlaskConical } from "lucide-react";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | ProShield" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="max-w-md text-center bg-white border border-border rounded-2xl p-8 shadow">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive mb-3" />
          <h1 className="text-xl font-extrabold text-foreground mb-2">Admin access required</h1>
          <p className="text-sm text-foreground/70 mb-4">
            You're signed in as <strong>{user.email}</strong>, but this account doesn't have the admin role yet.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
            className="px-4 py-2 rounded-full bg-secondary text-foreground font-semibold inline-flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/leads", label: "Call Leads", icon: Phone },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    { to: "/admin/ab-tests", label: "A/B Tests", icon: FlaskConical },
    { to: "/admin/services", label: "Phone Numbers", icon: Phone },
    { to: "/admin/faqs", label: "FAQs", icon: FileText },
    { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-2 font-extrabold text-primary">
            <div className="h-8 w-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span>{SITE.name} — Admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-foreground/70 hover:text-primary">← View site</Link>
            <span className="text-foreground/50 hidden sm:inline">{user.email}</span>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground font-semibold hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {nav.map((n) => {
              const active = n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                    active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

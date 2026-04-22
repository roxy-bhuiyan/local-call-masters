import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { LogIn, UserPlus, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Admin Login | ProShield" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in -> route them
  if (!authLoading && user) {
    if (isAdmin) navigate({ to: "/admin" });
    return (
      <div className="min-h-[60vh] grid place-items-center p-6">
        <div className="text-center space-y-3">
          <p className="text-foreground">
            Signed in as <span className="font-bold">{user.email}</span>
          </p>
          {!isAdmin && (
            <p className="text-foreground/70 max-w-md">
              Your account doesn't have admin access yet. Ask the site owner to grant you the admin role.
            </p>
          )}
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="px-4 py-2 rounded-full bg-secondary text-foreground font-semibold"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null); setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setInfo("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-10 bg-secondary">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-xl p-7">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-xl bg-hero-gradient flex items-center justify-center text-white mb-3">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Admin Access</h1>
          <p className="text-sm text-foreground/70 mt-1">
            {mode === "signin" ? "Sign in to manage leads & content" : "Create your admin account"}
          </p>
        </div>

        {error && <div className="mb-4 rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>}
        {info && <div className="mb-4 rounded-md bg-success/10 text-success text-sm p-3">{info}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-foreground"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground">Password</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-foreground"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit" disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-bold py-3 hover:brightness-110 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
          className="mt-5 w-full text-sm text-foreground/70 hover:text-primary inline-flex items-center justify-center gap-1.5"
        >
          {mode === "signin" ? <><UserPlus className="h-4 w-4" /> Create an account</> : <>Have an account? Sign in</>}
        </button>

        <Link to="/" className="block text-center text-xs text-foreground/60 hover:underline mt-4">← Back to site</Link>
      </div>
    </div>
  );
}

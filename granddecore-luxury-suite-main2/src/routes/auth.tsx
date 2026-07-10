import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — GrandDecore" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Check your email to confirm, then ask an existing admin to grant you access.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400" className="absolute inset-0 h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-10 left-10 text-background">
          <Link to="/" className="font-display text-3xl">Grand<span className="text-primary">Decore</span></Link>
          <p className="mt-4 max-w-sm opacity-80">Atelier sign-in for the GrandDecore admin team.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-10">
        <form onSubmit={submit} className="w-full max-w-sm">
          <Link to="/" className="font-display text-3xl lg:hidden">Grand<span className="text-primary">Decore</span></Link>
          <p className="eyebrow mt-8">{mode === "signin" ? "Sign in" : "Create account"}</p>
          <h1 className="font-display text-4xl mt-2">{mode === "signin" ? "Welcome back." : "Join the atelier."}</h1>

          <div className="mt-8 space-y-4">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-input bg-transparent px-4 py-4 focus:outline-none focus:border-foreground" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-input bg-transparent px-4 py-4 focus:outline-none focus:border-foreground" />
            <button disabled={loading} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary disabled:opacity-50">{loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="ml-2 link-underline text-foreground">{mode === "signin" ? "Create one" : "Sign in"}</button>
          </p>
          <p className="mt-10 text-xs text-muted-foreground">Admin access requires the <code>admin</code> role. After signing up, ask an existing admin to grant access.</p>
          <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.18em] link-underline">← Back to shop</Link>
        </form>
      </div>
    </div>
  );
}

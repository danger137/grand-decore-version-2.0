import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminLoginFn, getAdminSessionFn } from "@/lib/api";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — GrandDecore" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAdminSessionFn().then((data) => {
      if (data?.isAdmin) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLoginFn({ data: { email, password } });
      document.cookie = `admin_session=${res.token}; path=/; max-age=86400`;
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
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
          <p className="eyebrow mt-8">Sign in</p>
          <h1 className="font-display text-4xl mt-2">Welcome back.</h1>

          <div className="mt-8 space-y-4">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-input bg-transparent px-4 py-4 focus:outline-none focus:border-foreground" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-input bg-transparent px-4 py-4 focus:outline-none focus:border-foreground" />
            <button disabled={loading} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary disabled:opacity-50">{loading ? "Please wait…" : "Sign in"}</button>
          </div>
          <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.18em] link-underline">← Back to shop</Link>
        </form>
      </div>
    </div>
  );
}

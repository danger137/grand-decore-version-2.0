import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ArrowLeft, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — GrandDecore" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", Icon: Package },
  { to: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", Icon: Users },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
];

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone p-6">
        <div className="max-w-md text-center bg-background border p-10">
          <ShieldAlert className="h-10 w-10 mx-auto text-primary" />
          <p className="eyebrow justify-center mt-4">Access required</p>
          <h1 className="font-display text-3xl mt-2">Admin access not granted</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in as <b className="text-foreground">{user.email}</b> but don't have the <code>admin</code> role yet.
            An existing admin can grant you access by inserting into <code>user_roles</code> with your user id.
          </p>
          <code className="block mt-4 text-xs bg-muted p-3 text-left overflow-x-auto">
            INSERT INTO user_roles (user_id, role) VALUES ('{user.id}', 'admin');
          </code>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={signOut} className="text-xs uppercase tracking-[0.18em] border px-4 py-2">Sign out</button>
            <Link to="/" className="text-xs uppercase tracking-[0.18em] bg-foreground text-background px-4 py-2">Back to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr] bg-bone">
      <aside className="border-r bg-background flex flex-col">
        <div className="px-6 py-5 border-b">
          <Link to="/" className="font-display text-2xl">Grand<span className="text-primary">Decore</span></Link>
          <p className="eyebrow mt-1">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => {
            const active = l.exact ? path === l.to : path.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm ${active ? "bg-foreground text-background" : "hover:bg-accent"}`}>
                <l.Icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.18em] hover:bg-accent"><ArrowLeft className="h-3.5 w-3.5" /> Back to shop</Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.18em] hover:bg-accent text-left"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
        </div>
      </aside>
      <main className="p-6 lg:p-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}

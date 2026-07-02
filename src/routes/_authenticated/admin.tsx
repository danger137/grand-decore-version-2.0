import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — GrandDecore" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", Icon: Package },
  { to: "/admin/reviews", label: "Reviews", Icon: Star },
  { to: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", Icon: Users },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const signOut = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

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

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fmtPKR } from "@/lib/types";
import { Banknote, Package, ShoppingCart, Users } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [orders, products] = await Promise.all([
        supabase.from("orders").select("total, status, created_at, phone"),
        supabase.from("products").select("id"),
      ]);
      return { orders: orders.data ?? [], products: products.data ?? [] };
    },
  });

  if (stats.isLoading || !stats.data) return <p className="text-muted-foreground">Loading…</p>;
  const orders = stats.data.orders;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
  const customers = new Set(orders.map((o) => o.phone)).size;

  // monthly chart
  const months: Record<string, number> = {};
  orders.forEach((o) => {
    const k = new Date(o.created_at).toLocaleString("en", { month: "short" });
    months[k] = (months[k] ?? 0) + Number(o.total);
  });
  const chart = Object.entries(months).map(([month, revenue]) => ({ month, revenue }));

  const statusCounts = ["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  return (
    <div className="space-y-8 max-w-7xl">
      <header>
        <p className="eyebrow">Overview</p>
        <h1 className="font-display text-4xl mt-2">Dashboard</h1>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat Icon={Banknote} label="Revenue" value={fmtPKR(revenue)} />
        <Stat Icon={ShoppingCart} label="Orders" value={String(orders.length)} />
        <Stat Icon={Users} label="Customers" value={String(customers)} />
        <Stat Icon={Package} label="Products" value={String(stats.data.products.length)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-background border p-6">
          <p className="eyebrow">Monthly revenue</p>
          <h2 className="font-display text-2xl mt-1">Sales over time</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-background border p-6">
          <p className="eyebrow">Orders by status</p>
          <h2 className="font-display text-2xl mt-1">Fulfilment</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <BarChart data={statusCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="status" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-background border p-6">
        <p className="eyebrow">Recent</p>
        <h2 className="font-display text-2xl mt-1">Latest orders</h2>
        <table className="mt-4 w-full text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground text-left">
            <tr><th className="py-2">Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody className="divide-y">
            {orders.slice(0, 8).map((o, i) => (
              <tr key={i}><td className="py-3">—</td><td>—</td><td>{fmtPKR(Number(o.total))}</td><td className="capitalize">{o.status}</td><td>{new Date(o.created_at).toLocaleDateString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ Icon, label, value }: { Icon: typeof Banknote; label: string; value: string }) {
  return (
    <div className="bg-background border p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="font-display text-3xl mt-3">{value}</p>
    </div>
  );
}

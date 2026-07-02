import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAdminStatsFn } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const adminStatsQuery = queryOptions({
  queryKey: ["admin_stats"],
  queryFn: async () => getAdminStatsFn(),
});

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminStatsQuery),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useSuspenseQuery(adminStatsQuery);

  const revenue = stats.orders.filter(o => o.status !== "cancelled").reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = stats.orders.filter(o => o.status === "pending").length;

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="text-muted-foreground mt-1 mb-8">Overview of your atelier.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-background border p-6 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Revenue</p>
          <p className="font-display text-4xl mt-3">PKR {revenue.toLocaleString()}</p>
        </div>
        <div className="bg-background border p-6 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Orders</p>
          <p className="font-display text-4xl mt-3">{stats.orders.length}</p>
        </div>
        <div className="bg-background border p-6 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Pending Orders</p>
          <p className="font-display text-4xl mt-3 text-primary">{pendingOrders}</p>
        </div>
      </div>
    </div>
  );
}

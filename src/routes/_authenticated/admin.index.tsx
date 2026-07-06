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
      {/* 🟢 Nichay aik naya helpful summary paragraph add kar diya hai */}
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        Welcome to your GrandDecore admin control room. Here you can track real-time store performance,
        monitor your incoming sales revenue, and manage customer orders efficiently to ensure timely deliveries.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {/* Total Revenue Card */}
        <div className="bg-background border p-6 rounded-sm shadow-xs">
          <p className="text-xs uppercase tracking-widest  text-primary font-bold">Total Revenue</p>
          <p className="font-sans mt-3 text-black">
            <span className="text-sm font-normal tracking-wide mr-1">PKR</span>
            <span className="text-2xl font-bold">{revenue.toLocaleString()}</span>
          </p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-background border p-6 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-[red] font-bold">Total Orders</p>
          <p className="font-sans text-2xl mt-3 font-bold text-black">
            {stats.orders.length}
          </p>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-background border p-6 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Pending Orders</p>
          {/* 🟢 Pending orders ka color wapas text-primary kar diya hai */}
          <p className="font-sans text-2xl mt-3 font-bold text-primary">
            {pendingOrders}
          </p>
        </div>
      </div>
    </div>
  );
}

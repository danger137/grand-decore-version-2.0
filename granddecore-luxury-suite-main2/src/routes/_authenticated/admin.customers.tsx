import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fmtPKR } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("full_name, phone, city, total, created_at");
      const map = new Map<string, { name: string; phone: string; city: string; orders: number; total: number; last: string }>();
      (data ?? []).forEach((o) => {
        const e = map.get(o.phone) ?? { name: o.full_name, phone: o.phone, city: o.city, orders: 0, total: 0, last: o.created_at };
        e.orders += 1;
        e.total += Number(o.total);
        if (o.created_at > e.last) e.last = o.created_at;
        map.set(o.phone, e);
      });
      return Array.from(map.values()).sort((a, b) => b.total - a.total);
    },
  });

  return (
    <div className="max-w-7xl">
      <header>
        <p className="eyebrow">Customers</p>
        <h1 className="font-display text-4xl mt-2">{data?.length ?? 0} customers</h1>
      </header>
      <div className="mt-8 bg-background border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground text-left bg-bone">
            <tr><th className="px-4 py-3">Name</th><th>Phone</th><th>City</th><th>Orders</th><th>Lifetime value</th><th>Last order</th></tr>
          </thead>
          <tbody className="divide-y">
            {(data ?? []).map((c) => (
              <tr key={c.phone}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.city}</td>
                <td>{c.orders}</td>
                <td>{fmtPKR(c.total)}</td>
                <td>{new Date(c.last).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No customers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminGetCustomersFn } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const adminCustomersQuery = queryOptions({
  queryKey: ["admin_customers"],
  queryFn: async () => adminGetCustomersFn(),
});

export const Route = createFileRoute("/_authenticated/admin/customers")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminCustomersQuery),
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data: orders } = useSuspenseQuery(adminCustomersQuery);

  // Group by phone/name to simulate unique customers
  const customersMap = new Map();
  for (const o of orders) {
    const key = o.phone;
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: o.fullName,
        phone: o.phone,
        city: o.city,
        totalSpent: 0,
        orders: 0,
        lastOrder: o.created_at,
      });
    }
    const c = customersMap.get(key);
    c.totalSpent += o.total;
    c.orders += 1;
    if (new Date(o.created_at) > new Date(c.lastOrder)) c.lastOrder = o.created_at;
  }
  const customers = Array.from(customersMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div>
      <h1 className="font-display text-3xl">Customers</h1>
      <p className="text-muted-foreground mt-1 mb-8">View your clientele.</p>

      <div className="bg-background border rounded-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-widest border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Orders</th>
              <th className="px-6 py-4 font-medium">Total Spent</th>
              <th className="px-6 py-4 font-medium">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((c) => (
              <tr key={c.phone} className="hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">
                  <p>{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                </td>
                <td className="px-6 py-4">{c.city}</td>
                <td className="px-6 py-4">{c.orders}</td>
                <td className="px-6 py-4">PKR {c.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4">{new Date(c.lastOrder).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

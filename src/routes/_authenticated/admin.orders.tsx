import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminGetOrdersFn, adminUpdateOrderFn } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { useStore } from "@/lib/store";

export const adminOrdersQuery = queryOptions({
  queryKey: ["admin_orders"],
  queryFn: async () => adminGetOrdersFn(),
});

export const Route = createFileRoute("/_authenticated/admin/orders")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminOrdersQuery),
  component: AdminOrders,
});

function AdminOrders() {
  const { data: orders } = useSuspenseQuery(adminOrdersQuery);
  const qc = useQueryClient();
  const clearCart = useStore((s) => s.clear);

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, status: string }) => adminUpdateOrderFn({ data }),
    onSuccess: (_, variables) => {
      toast.success("Order status updated");
      qc.invalidateQueries({ queryKey: ["admin_orders"] });
      if (variables.status === "approved" || variables.status === "processing" || variables.status === "shipped" || variables.status === "delivered") {
        clearCart();
      }
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>
      <p className="text-muted-foreground mt-1 mb-8">Manage customer orders and dispatch status.</p>

      <div className="bg-background border rounded-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-widest border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/50">
                <td className="px-6 py-4">
                  <p className="font-medium">{o.orderNumber}</p>
                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    {Array.isArray(o.items) && o.items.map((i: any, idx: number) => (
                      <div key={idx}>• {i.quantity || 1}x {i.name}</div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p>{o.fullName}</p>
                  <p className="text-xs text-muted-foreground">{o.city}</p>
                </td>
                <td className="px-6 py-4">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">PKR {o.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateMutation.mutate({ id: o.id, status: e.target.value })}
                    disabled={updateMutation.isPending}
                    className="bg-transparent border border-input rounded-sm px-2 py-1 text-xs uppercase tracking-widest focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

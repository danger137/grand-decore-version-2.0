import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { adminGetOrdersFn, adminUpdateOrderFn } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { Save } from "lucide-react";

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

  // local state taake har order ke inputs ko alag se handle kiya ja sake
  const [courierInputs, setCourierInputs] = useState<{ [key: string]: { name: string; id: string } }>({});

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; status: string; courierName?: string; trackingNumber?: string }) =>
      adminUpdateOrderFn({ data }),
    onSuccess: (_, variables) => {
      toast.success("Order status updated successfully");
      qc.invalidateQueries({ queryKey: ["admin_orders"] });
      if (["approved", "processing", "shipped", "delivered"].includes(variables.status)) {
        clearCart();
      }
    },
    onError: (err: any) => toast.error(err.message || "Failed to update order"),
  });

  const handleInputChange = (orderId: string, field: "name" | "id", value: string) => {
    setCourierInputs((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || { name: "leopards", id: "" }),
        [field]: value,
      },
    }));
  };

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
              <th className="px-6 py-4 font-medium">Status & Tracking</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => {
              const currentInput = courierInputs[o.id] || {
                name: o.courierName || "leopards",
                id: o.trackingNumber || ""
              };
              const isShippedOrDelivered = o.status === "shipped" || o.status === "delivered";

              return (
                <tr key={o.id} className="hover:bg-muted/50 align-top">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(o.createdAt || o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">PKR {o.total.toLocaleString()}</td>
                  <td className="px-6 py-4 space-y-3 min-w-[220px]">
                    {/* Status Select Dropdown */}
                    <select
                      value={o.status}
                      onChange={(e) => updateMutation.mutate({
                        id: o.id,
                        status: e.target.value,
                        courierName: e.target.value === "shipped" ? currentInput.name : o.courierName,
                        trackingNumber: e.target.value === "shipped" ? currentInput.id : o.trackingNumber
                      })}
                      disabled={updateMutation.isPending}
                      className="w-full bg-background border border-input rounded-sm px-2 py-1.5 text-xs uppercase tracking-widest focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped 🚚</option>
                      <option value="delivered">Delivered ✅</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Dynamic Tracking Fields */}
                    {isShippedOrDelivered && (
                      <div className="pt-2 border-t border-dashed space-y-2 core-tracking-fields animate-in fade-in duration-200">
                        <div>
                          <label className="text-[10px] uppercase text-muted-foreground block mb-1">Courier</label>
                          <select
                            value={currentInput.name}
                            onChange={(e) => handleInputChange(o.id, "name", e.target.value)}
                            className="w-full bg-background border border-input rounded-sm px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="leopards">Leopards</option>
                            <option value="tcs">TCS Express</option>
                            <option value="postex">PostEx</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-muted-foreground block mb-1">Tracking Number</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="e.g. LE1234567"
                              value={currentInput.id}
                              onChange={(e) => handleInputChange(o.id, "id", e.target.value)}
                              className="flex-1 bg-background border border-input rounded-sm px-2 py-1 text-xs font-mono focus:outline-none"
                            />
                            <button
                              type="button"
                              title="Save Tracking"
                              disabled={updateMutation.isPending}
                              onClick={() => {
                                if (!currentInput.id.trim()) {
                                  toast.error("Please enter a tracking number");
                                  return;
                                }
                                updateMutation.mutate({
                                  id: o.id,
                                  status: o.status,
                                  courierName: currentInput.name,
                                  trackingNumber: currentInput.id.trim()
                                });
                              }}
                              className="bg-foreground text-background p-1.5 rounded-sm hover:bg-primary transition-colors disabled:opacity-50"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
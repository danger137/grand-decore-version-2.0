import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Package, Truck, CheckCircle2 } from "lucide-react";
import { StoreLayout } from "@/components/storefront/layout";
import { trackOrderFn } from "@/lib/api";

export const Route = createFileRoute("/track-order")({
  head: () => ({ meta: [{ title: "Track Order — GrandDecore" }] }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    const fd = new FormData(e.currentTarget);
    const orderNumber = fd.get("orderNumber") as string;
    const phone = fd.get("phone") as string;

    try {
      const res = await trackOrderFn({ data: { orderNumber, phone } });
      if (!res) throw new Error("Order not found. Please check your details.");
      setOrder(res);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />;
      case "shipped": return <Truck className="h-10 w-10 text-primary mx-auto" />;
      default: return <Package className="h-10 w-10 text-primary mx-auto" />;
    }
  };

  return (
    <StoreLayout>
      <div className="container-x py-24 lg:py-32 max-w-xl mx-auto">
        <div className="text-center">
          <p className="eyebrow">Order Status</p>
          <h1 className="font-display text-4xl mt-3">Track your piece.</h1>
          <p className="mt-4 text-muted-foreground">Enter your order number and phone number to see the current status of your delivery.</p>
        </div>

        <form onSubmit={submit} className="mt-12 space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Order Number</label>
            <input required name="orderNumber" placeholder="e.g. GD-12345" className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Phone Number</label>
            <input required name="phone" placeholder="03XXXXXXXXX" className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground" />
          </div>
          <button disabled={loading} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            <Search className="h-4 w-4" /> {loading ? "Searching…" : "Track Order"}
          </button>
        </form>

        {order && (
          <div className="mt-16 border bg-bone p-8 text-center animate-in fade-in slide-in-from-bottom-4">
            {getStatusIcon(order.status)}
            <h2 className="font-display text-2xl mt-6 capitalize">{order.status}</h2>
            <p className="text-muted-foreground mt-2">
              {order.status === "pending" && "We have received your order and are preparing it for dispatch."}
              {order.status === "processing" && "Your piece is being carefully wrapped and packed in our atelier."}
              {order.status === "shipped" && "Your order is on the way via our delivery partners."}
              {order.status === "delivered" && "Your order has been delivered. Thank you for shopping with GrandDecore."}
              {order.status === "cancelled" && "This order has been cancelled."}
            </p>
            <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Order Total</p>
                <p className="font-medium mt-1">PKR {order.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Date placed</p>
                <p className="font-medium mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}

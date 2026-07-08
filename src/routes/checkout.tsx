import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { createOrderFn } from "@/lib/api";
import { useStore, useCartTotals } from "@/lib/store";
import { fmtPKR } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — GrandDecore" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const items = useStore((s) => s.items);
  const clearCart = useStore((s) => s.clear);
  const { subtotal } = useCartTotals();

  // Updated logic: Shipping is always 0, total equals subtotal
  const shipping = 0;
  const total = subtotal;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your bag is empty. Please add items before checking out.");
      return;
    }
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    try {
      const res = await createOrderFn({
        data: {
          fullName: data.fullName,
          phone: data.phone,
          city: data.city,
          address: data.address,
          whatsapp: data.whatsapp || null,
          notes: data.notes || null,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant || null,
            image: i.image || null,
          })),
          subtotal,
          shipping,
          total,
        }
      });
      setSuccess(true);
      setOrderNumber(res.orderNumber);
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-background p-10 text-center border">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl">Order confirmed.</h1>
          <p className="mt-4 text-muted-foreground">Thank you for your order. We will reach out on WhatsApp shortly to confirm dispatch.</p>
          <div className="mt-8 p-4 bg-accent/50 border text-sm">
            <p className="text-muted-foreground">Order number</p>
            <p className="font-mono text-lg font-medium mt-1">{orderNumber}</p>
          </div>
          <Link to="/" className="mt-8 block bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary">Return to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <div className="border-b bg-background">
        <div className="container-x h-20 flex items-center justify-between">
          <Link to="/" className="font-display text-3xl">Grand<span className="text-primary">Decore</span></Link>
          <Link to="/shop" className="text-xs uppercase tracking-[0.18em] flex items-center gap-2 hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to shop</Link>
        </div>
      </div>

      <div className="container-x py-12 lg:py-24 grid lg:grid-cols-2 gap-16">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="font-display text-4xl md:text-5xl mt-3">Shipping details.</h1>

          <form onSubmit={submit} className="mt-10 space-y-6">
            {/* Form inputs remain same */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Full Name *</label>
                <input required name="fullName" className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Phone *</label>
                <input required name="phone" className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">WhatsApp (Optional)</label>
              <input name="whatsapp" className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">City *</label>
              <input required name="city" className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Complete Address *</label>
              <textarea required name="address" rows={3} className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground transition-colors resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Order Notes</label>
              <textarea name="notes" rows={2} className="w-full bg-transparent border-b border-input py-3 focus:outline-none focus:border-foreground transition-colors resize-none" />
            </div>

            <button disabled={loading} className="w-full bg-foreground text-background py-5 text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors disabled:opacity-50 mt-10">
              {loading ? "Processing…" : "Complete Order (Cash on Delivery)"}
            </button>
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4"><ShieldCheck className="h-4 w-4" /> Secure checkout. Pay only upon delivery.</p>
          </form>
        </div>

        <div className="bg-background p-8 border self-start">
          <p className="eyebrow">Summary</p>
          <h2 className="font-display text-2xl mt-2">Your Bag</h2>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm mt-6">Your bag is currently empty.</p>
          ) : (
            <>
              <ul className="divide-y my-6">
                {items.map((i) => (
                  <li key={`${i.productId}-${i.variant ?? ""}`} className="py-4 flex gap-4 items-center">
                    <img src={i.image} alt={i.name} className="w-16 h-16 object-cover bg-muted rounded-sm shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{i.name}</p>
                      {i.variant && <p className="text-xs text-muted-foreground">{i.variant}</p>}
                      <p className="text-xs text-muted-foreground mt-1">Qty: {i.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">{fmtPKR(i.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{fmtPKR(subtotal)}</span></div>
                {/* Updated UI rendering here */}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-muted-foreground">Free Shipping Across Pakistan</span>
                </div>
                <div className="flex justify-between font-inter text-lg pt-2 border-t text-foreground"><span>Total</span><span>{fmtPKR(total)}</span></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
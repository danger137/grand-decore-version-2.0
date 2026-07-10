import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, useCartTotals } from "@/lib/store";
import { fmtPKR } from "@/lib/types";
import { StoreLayout } from "@/components/storefront/layout";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Truck, Lock, Banknote } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — GrandDecore" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const items = useStore((s) => s.items);
  const clear = useStore((s) => s.clear);
  const { subtotal } = useCartTotals();
  const navigate = useNavigate();
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", whatsapp: "03238041309", city: "", address: "", notes: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your bag is empty"); return; }
    if (!form.full_name || !form.phone || !form.city || !form.address) { toast.error("Please complete all required fields"); return; }
    setLoading(true);
    const { data, error } = await supabase.from("orders").insert({
      full_name: form.full_name,
      phone: form.phone,
      whatsapp: form.whatsapp || null,
      city: form.city,
      address: form.address,
      notes: form.notes || null,
      items: items as never,
      subtotal,
      shipping,
      total,
    }).select("order_number").single();
    setLoading(false);
    if (error || !data) { toast.error("Could not place order. Please try again."); return; }
    clear();
    navigate({ to: "/order-success/$orderNumber", params: { orderNumber: data.order_number } });
  };

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="container-x py-32 text-center">
          <p className="eyebrow justify-center">Empty</p>
          <h1 className="font-display text-5xl mt-3">Your bag is empty</h1>
          <Link to="/shop" className="inline-block mt-6 bg-foreground text-background px-8 py-3 text-xs uppercase tracking-[0.18em]">Shop the edit</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container-x pt-12 pb-20">
        <p className="eyebrow">Checkout</p>
        <h1 className="font-display text-5xl mt-3">Complete your order</h1>

        <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <form onSubmit={submit} className="space-y-8">
            <div className="border p-6 space-y-5">
              <h2 className="font-display text-2xl">Delivery details</h2>
              <Field label="Full Name *" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} placeholder="As on CNIC" />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Phone Number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="03xx xxxxxxx" />
                <Field label="WhatsApp Number" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="03xx xxxxxxx" />
              </div>
              <Field label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Lahore" />
              <Field label="Complete Address *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="House, street, area" textarea />
              <Field label="Order Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="Gift wrapping, delivery instructions…" textarea />
            </div>

            <div className="border p-6 space-y-4">
              <h2 className="font-display text-2xl flex items-center gap-2"><Banknote className="h-5 w-5 text-primary" /> Cash on Delivery</h2>
              <p className="text-sm text-muted-foreground">Pay in cash when your order arrives. No card required. Our team will confirm via WhatsApp at <span className="text-foreground">03238041309</span>.</p>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                {[{ Icon: Lock, t: "Secure checkout" }, { Icon: ShieldCheck, t: "Verified COD" }, { Icon: Truck, t: "Nationwide delivery" }].map((b) => (
                  <div key={b.t} className="border p-3 flex flex-col items-center text-center"><b.Icon className="h-4 w-4 mb-2 text-primary" />{b.t}</div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-foreground text-background py-5 text-xs uppercase tracking-[0.2em] hover:bg-primary disabled:opacity-50">
              {loading ? "Placing order…" : `Place order — ${fmtPKR(total)}`}
            </button>
          </form>

          {/* Summary */}
          <aside className="border p-6 h-fit lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">Your bag</h2>
            <ul className="mt-5 divide-y">
              {items.map((i) => (
                <li key={`${i.productId}-${i.variant ?? ""}`} className="py-4 flex gap-3">
                  <img src={i.image} alt={i.name} className="w-16 h-20 object-cover bg-muted" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-tight">{i.name}</p>
                    {i.variant && <p className="text-xs text-muted-foreground">{i.variant}</p>}
                    <p className="text-xs text-muted-foreground mt-1">× {i.quantity}</p>
                  </div>
                  <p className="text-sm">{fmtPKR(i.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t space-y-2 text-sm">
              <Row label="Subtotal" value={fmtPKR(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : fmtPKR(shipping)} />
              <div className="pt-3 border-t flex justify-between">
                <span className="font-display text-xl">Total</span>
                <span className="font-display text-xl">{fmtPKR(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}

function Field({ label, value, onChange, placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-input bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-input bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
      )}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StoreLayout } from "@/components/storefront/layout";
import { supabase } from "@/integrations/supabase/client";
import { fmtPKR } from "@/lib/types";

export const Route = createFileRoute("/track-order")({
  head: () => ({ meta: [{ title: "Track Order — GrandDecore" }, { name: "description", content: "Check the status of your GrandDecore order." }] }),
  component: TrackPage,
});

type OrderRow = { order_number: string; status: string; full_name: string; city: string; total: number; created_at: string };

function TrackPage() {
  const [order, setOrder] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<OrderRow | null | "notfound">(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const { data } = await supabase.rpc("track_order", { _order_number: order, _phone: phone });
    setLoading(false);
    if (!data || (Array.isArray(data) && data.length === 0)) { setResult("notfound"); return; }
    setResult(Array.isArray(data) ? (data[0] as OrderRow) : (data as OrderRow));
  };

  return (
    <StoreLayout>
      <section className="container-x py-20 max-w-xl mx-auto">
        <p className="eyebrow">After purchase</p>
        <h1 className="font-display text-5xl mt-3">Track your order.</h1>
        <p className="mt-4 text-muted-foreground">Enter your order number and the phone number you placed it with.</p>
        <form onSubmit={submit} className="mt-10 space-y-4">
          <input value={order} onChange={(e) => setOrder(e.target.value)} placeholder="Order number (GD-…)" className="w-full border border-input bg-transparent px-4 py-4 focus:outline-none focus:border-foreground" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full border border-input bg-transparent px-4 py-4 focus:outline-none focus:border-foreground" />
          <button disabled={loading} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary disabled:opacity-50">{loading ? "Searching…" : "Track order"}</button>
        </form>

        {result === "notfound" && <p className="mt-8 text-sm text-muted-foreground">No order found with those details. Check the order number and phone, then try again.</p>}

        {result && result !== "notfound" && (
          <div className="mt-10 border p-6">
            <p className="eyebrow">Order {result.order_number}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              <span className="font-display text-2xl capitalize">{result.status}</span>
            </div>
            <ul className="mt-5 text-sm space-y-1 text-muted-foreground">
              <li><span className="text-foreground">Name:</span> {result.full_name}</li>
              <li><span className="text-foreground">City:</span> {result.city}</li>
              <li><span className="text-foreground">Total:</span> {fmtPKR(Number(result.total))}</li>
              <li><span className="text-foreground">Placed:</span> {new Date(result.created_at).toLocaleString()}</li>
            </ul>
          </div>
        )}
      </section>
    </StoreLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fmtPKR } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Status = typeof STATUSES[number];

type OrderRow = {
  id: string; order_number: string; full_name: string; phone: string; whatsapp: string | null;
  city: string; address: string; total: number; subtotal: number; shipping: number;
  status: Status; items: { name: string; quantity: number; price: number }[];
  created_at: string; notes: string | null;
};

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [open, setOpen] = useState<OrderRow | null>(null);

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => ((await supabase.from("orders").select("*").order("created_at", { ascending: false })).data ?? []) as unknown as OrderRow[],
  });

  const filtered = (orders ?? []).filter((o) => filter === "all" || o.status === filter);

  const setStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
    if (open) setOpen({ ...open, status });
  };

  return (
    <div className="max-w-7xl">
      <header>
        <p className="eyebrow">Fulfilment</p>
        <h1 className="font-display text-4xl mt-2">Orders</h1>
      </header>

      <div className="mt-6 flex gap-2 text-xs uppercase tracking-[0.18em] overflow-x-auto">
        {(["all", ...STATUSES] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 border whitespace-nowrap ${filter === s ? "bg-foreground text-background" : "hover:bg-accent"}`}>{s}</button>
        ))}
      </div>

      <div className="mt-6 bg-background border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground text-left bg-bone">
            <tr><th className="px-4 py-3">Order</th><th>Customer</th><th>City</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-accent cursor-pointer" onClick={() => setOpen(o)}>
                <td className="px-4 py-3 font-medium">{o.order_number}</td>
                <td>{o.full_name}<div className="text-xs text-muted-foreground">{o.phone}</div></td>
                <td>{o.city}</td>
                <td>{fmtPKR(Number(o.total))}</td>
                <td><span className="capitalize text-xs px-2 py-1 bg-accent">{o.status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="text-right pr-4 text-xs text-muted-foreground">view →</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No orders yet</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-stretch justify-end" onClick={() => setOpen(null)}>
          <div className="bg-background w-full max-w-2xl overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow">Order</p>
            <h2 className="font-display text-3xl mt-1">{open.order_number}</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em]">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setStatus(open.id, s)} className={`px-3 py-2 border ${open.status === s ? "bg-foreground text-background" : "hover:bg-accent"}`}>{s}</button>
              ))}
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <Card label="Customer">{open.full_name}<br /><span className="text-muted-foreground">{open.phone}</span>{open.whatsapp && <><br /><span className="text-muted-foreground">WA: {open.whatsapp}</span></>}</Card>
              <Card label="Delivery">{open.city}<br /><span className="text-muted-foreground">{open.address}</span></Card>
            </div>
            <h3 className="eyebrow mt-8">Items</h3>
            <ul className="mt-3 divide-y border-y">
              {open.items.map((it, i) => (
                <li key={i} className="py-3 flex justify-between text-sm">
                  <span>{it.name} × {it.quantity}</span><span>{fmtPKR(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-sm space-y-1">
              <Row label="Subtotal" v={fmtPKR(Number(open.subtotal))} />
              <Row label="Shipping" v={Number(open.shipping) === 0 ? "Free" : fmtPKR(Number(open.shipping))} />
              <div className="flex justify-between pt-2 border-t font-display text-xl"><span>Total</span><span>{fmtPKR(Number(open.total))}</span></div>
            </div>
            {open.notes && <p className="mt-4 text-sm border p-3 bg-bone"><b>Notes:</b> {open.notes}</p>}
            <a href={`https://wa.me/${(open.whatsapp || open.phone).replace(/\D/g, "").replace(/^0/, "92")}`} target="_blank" rel="noreferrer" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.18em]">Message on WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="border p-4"><p className="eyebrow">{label}</p><p className="mt-2">{children}</p></div>;
}
function Row({ label, v }: { label: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{v}</span></div>;
}

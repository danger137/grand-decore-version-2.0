import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["store_settings_admin"],
    queryFn: async () => (await supabase.from("store_settings").select("*").eq("id", 1).single()).data,
  });
  const [form, setForm] = useState({
    store_name: "", logo: "", whatsapp: "", email: "", phone: "",
    instagram: "", facebook: "", tiktok: "",
    shipping_fee: 0, free_shipping_over: 0,
  });

  useEffect(() => {
    if (!data) return;
    const s = data.socials as Record<string, string>;
    setForm({
      store_name: data.store_name, logo: data.logo ?? "", whatsapp: data.whatsapp ?? "",
      email: data.email ?? "", phone: data.phone ?? "",
      instagram: s?.instagram ?? "", facebook: s?.facebook ?? "", tiktok: s?.tiktok ?? "",
      shipping_fee: Number(data.shipping_fee), free_shipping_over: Number(data.free_shipping_over),
    });
  }, [data]);

  const save = async () => {
    const { error } = await supabase.from("store_settings").update({
      store_name: form.store_name, logo: form.logo || null, whatsapp: form.whatsapp,
      email: form.email, phone: form.phone,
      socials: { instagram: form.instagram, facebook: form.facebook, tiktok: form.tiktok },
      shipping_fee: form.shipping_fee, free_shipping_over: form.free_shipping_over,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["store_settings_admin"] });
  };

  return (
    <div className="max-w-3xl">
      <header><p className="eyebrow">Atelier</p><h1 className="font-display text-4xl mt-2">Settings</h1></header>
      <div className="mt-8 bg-background border p-6 space-y-5">
        <h2 className="font-display text-2xl">Store information</h2>
        <F label="Store name" v={form.store_name} on={(v) => setForm({ ...form, store_name: v })} />
        <F label="Logo URL" v={form.logo} on={(v) => setForm({ ...form, logo: v })} />
        <div className="grid sm:grid-cols-3 gap-3">
          <F label="WhatsApp" v={form.whatsapp} on={(v) => setForm({ ...form, whatsapp: v })} />
          <F label="Phone" v={form.phone} on={(v) => setForm({ ...form, phone: v })} />
          <F label="Email" v={form.email} on={(v) => setForm({ ...form, email: v })} />
        </div>
      </div>
      <div className="mt-6 bg-background border p-6 space-y-5">
        <h2 className="font-display text-2xl">Social</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <F label="Instagram" v={form.instagram} on={(v) => setForm({ ...form, instagram: v })} />
          <F label="Facebook" v={form.facebook} on={(v) => setForm({ ...form, facebook: v })} />
          <F label="TikTok" v={form.tiktok} on={(v) => setForm({ ...form, tiktok: v })} />
        </div>
      </div>
      <div className="mt-6 bg-background border p-6 space-y-5">
        <h2 className="font-display text-2xl">Shipping</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <F label="Flat shipping fee (PKR)" v={String(form.shipping_fee)} on={(v) => setForm({ ...form, shipping_fee: +v })} />
          <F label="Free shipping over (PKR)" v={String(form.free_shipping_over)} on={(v) => setForm({ ...form, free_shipping_over: +v })} />
        </div>
      </div>
      <button onClick={save} className="mt-6 bg-foreground text-background px-8 py-3 text-xs uppercase tracking-[0.18em]">Save settings</button>
    </div>
  );
}

function F({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <input value={v} onChange={(e) => on(e.target.value)} className="mt-2 w-full border border-input bg-transparent px-3 py-2 focus:outline-none focus:border-foreground" />
    </label>
  );
}

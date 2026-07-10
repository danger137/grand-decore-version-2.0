import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StoreLayout } from "@/components/storefront/layout";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — GrandDecore" }, { name: "description", content: "Reach the GrandDecore atelier. WhatsApp, email, or visit us in Lahore." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const wa = `https://wa.me/923238041309?text=${encodeURIComponent(`Hi GrandDecore, I'm ${form.name || "—"} (${form.email || "—"}). ${form.msg}`)}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.msg) { toast.error("Please add your name and message"); return; }
    window.open(wa, "_blank");
    toast.success("Opening WhatsApp…");
  };

  return (
    <StoreLayout>
      <section className="container-x py-20 grid lg:grid-cols-2 gap-16">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1 className="font-display text-5xl md:text-6xl mt-3">We'd love to hear from you.</h1>
          <p className="mt-4 text-muted-foreground max-w-md">Questions about a piece, custom commissions, trade orders — we read every message.</p>

          <ul className="mt-12 space-y-6">
            <li className="flex items-start gap-4"><MessageCircle className="h-5 w-5 mt-1 text-primary" />
              <div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</p>
                <a href="https://wa.me/923238041309" className="text-lg link-underline">+92 323 8041309</a></div>
            </li>
            <li className="flex items-start gap-4"><Phone className="h-5 w-5 mt-1 text-primary" />
              <div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Phone</p>
                <a href="tel:+923238041309" className="text-lg link-underline">+92 323 8041309</a></div>
            </li>
            <li className="flex items-start gap-4"><Mail className="h-5 w-5 mt-1 text-primary" />
              <div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</p>
                <a href="mailto:hello@granddecore.com" className="text-lg link-underline">hello@granddecore.com</a></div>
            </li>
            <li className="flex items-start gap-4"><MapPin className="h-5 w-5 mt-1 text-primary" />
              <div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Atelier</p>
                <p className="text-lg">Gulberg, Lahore — by appointment</p></div>
            </li>
          </ul>
        </div>

        <form onSubmit={submit} className="border p-8 h-fit space-y-5">
          <h2 className="font-display text-3xl">Send a message</h2>
          <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full border-b border-input bg-transparent py-3 focus:outline-none focus:border-foreground" />
          </label>
          <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full border-b border-input bg-transparent py-3 focus:outline-none focus:border-foreground" />
          </label>
          <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Message</span>
            <textarea rows={5} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className="mt-2 w-full border border-input bg-transparent p-3 focus:outline-none focus:border-foreground" />
          </label>
          <button className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary">Send via WhatsApp</button>
        </form>
      </section>
    </StoreLayout>
  );
}

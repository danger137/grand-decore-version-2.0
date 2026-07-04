import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StoreLayout } from "@/components/storefront/layout";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmailFn } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — GrandDecore" }, { name: "description", content: "Reach the GrandDecore atelier. WhatsApp, email, or visit us in Lahore." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) {
      toast.error("Please fill in your name, email, and message");
      return;
    }
    setLoading(true);
    try {
      await sendContactEmailFn({ data: form });
      toast.success("Message sent successfully! We will get back to you soon.");
      setForm({ name: "", email: "", msg: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again or contact via WhatsApp.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreLayout>
      <section className="container-x py-20 grid lg:grid-cols-2 gap-16">
        <div>
          <p className="eyebrow" style={{ color: "#4CC157" }}>Get in touch</p>
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
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full border-b border-input bg-transparent py-3 focus:outline-none focus:border-foreground" />
          </label>
          <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full border-b border-input bg-transparent py-3 focus:outline-none focus:border-foreground" />
          </label>
          <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Message</span>
            <textarea required rows={5} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className="mt-2 w-full border border-input bg-transparent p-3 focus:outline-none focus:border-foreground" />
          </label>
          <button disabled={loading} className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary disabled:opacity-50">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </StoreLayout>
  );
}


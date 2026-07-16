import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import emailjs from "@emailjs/browser";
import { createOrderFn } from "@/lib/api";
import { useStore, useCartTotals } from "@/lib/store";
import { fmtPKR } from "@/lib/types";
import logo from "@/assets/lgo.png";

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
  const total = subtotal;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    try {
      // 1. Order API Call (Agar ye fail hua to catch mein jayega)
      const res = await createOrderFn({
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          city: data.city,
          address: data.address,
          items,
          total,
        },
      });

      // 2. WhatsApp Message
      const msg = `*New Order: ${res.orderNumber}*%0A%0A` +
        `👤 Name: ${data.fullName}%0A` +
        `📞 Phone: ${data.phone}%0A` +
        `🏠 Address: ${data.address}, ${data.city}%0A` +
        `💰 Total: ${fmtPKR(total)}`;

      window.open(`https://wa.me/923238041309?text=${msg}`, "_blank");

      // 🟢 3. Har product ki text-based row (image nahi — naam, qty, price)
      const itemsTable = items
        .map(
          (i) => `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:14px;color:#333;">
            ${i.name}${i.variant ? ` <span style="color:#888;">(${i.variant})</span>` : ""}<br/>
            <span style="color:#888;font-size:12px;">Qty: ${i.quantity}</span>
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:14px;color:#333;text-align:right;white-space:nowrap;">
            ${fmtPKR(i.price * i.quantity)}
          </td>
        </tr>`
        )
        .join("");

      // 4. EmailJS (Admin & Customer)
      const templateParams = {
        order_number: res.orderNumber,
        customer_name: data.fullName,
        customer_email: data.email,
        phone: data.phone,
        address: `${data.address}, ${data.city}`,
        items_table: itemsTable,
        total: fmtPKR(total),
      };

      // 1. Admin Email (Sirf Admin ko jani chahiye)
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        "template_uief4vp", // Yahan apne Admin Template ki ID likhein
        {
          ...templateParams,
          to_email: "granddecore656@gmail.com" // Yahan hard-code karein
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 2. Customer Email (Sirf Customer ko jani chahiye)
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        "template_c5d70yk", // Yahan apne Customer Template ki ID likhein
        {
          ...templateParams,
          to_email: data.email // Customer ka email yahan jayega
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      // 5. Final Success
      setSuccess(true);
      setOrderNumber(res.orderNumber);
      clearCart();

    } catch (err: any) {
      console.error("Order process error:", err);
      toast.error("Order place nahi ho saka. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-background p-8 text-center border shadow-sm">
          <Check className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="font-display text-3xl">Order confirmed.</h1>
          <p className="mt-4 font-mono text-lg font-medium">{orderNumber}</p>
          <Link to="/" className="mt-8 block bg-foreground text-background py-4 text-xs uppercase tracking-widest">Return to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <div className="border-b bg-background">
        <div className="container-x h-20 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GrandDecore Logo" className="h-12 w-auto object-contain" />
            <h1 className="flex items-center text-[15px] font-semibold mt-4" style={{ fontFamily: "inherit", marginTop: "16px" }}>
              <span className="text-[#4CC157]">Grand</span>
              <span className="text-black">Decore</span>
            </h1>
          </Link>
        </div>
      </div>

      <div className="container-x py-8 lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <h1 className="font-display text-3xl">Shipping details.</h1>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <input required name="fullName" placeholder="Full Name *" className="w-full bg-transparent border-b border-input py-2 focus:outline-none" />
            <input required name="email" type="email" placeholder="Email Address *" className="w-full bg-transparent border-b border-input py-2 focus:outline-none" />
            <input required name="phone" placeholder="Phone *" className="w-full bg-transparent border-b border-input py-2 focus:outline-none" />
            <input required name="city" placeholder="City *" className="w-full bg-transparent border-b border-input py-2 focus:outline-none" />
            <textarea required name="address" placeholder="Complete Address *" rows={2} className="w-full bg-transparent border-b border-input py-2 focus:outline-none" />
            <button disabled={loading} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-widest hover:bg-primary disabled:opacity-50">
              {loading ? "Processing..." : "Complete Order (COD)"}
            </button>
          </form>
        </div>

        <div className="bg-background p-6 border self-start">
          <h2 className="font-display text-xl mb-4">Your Bag</h2>
          <ul className="divide-y">
            {items.map((i) => (
              <li key={`${i.productId}-${i.variant}`} className="py-3 flex gap-4 items-center">
                <img src={i.image} className="w-12 h-12 object-cover bg-muted" />
                <div className="flex-1 text-sm"><p>{i.name}</p><p className="text-xs text-muted-foreground">Qty: {i.quantity}</p></div>
                <p className="text-sm font-medium">{fmtPKR(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t text-sm font-bold flex justify-between">
            <span>Total</span><span>{fmtPKR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({ meta: [{ title: "Shipping Policy — GrandDecore" }, { name: "description", content: "Shipping rates, timelines and coverage across Pakistan." }] }),
  component: () => (
    <PolicyPage eyebrow="Policy" title="Shipping Policy" updated="June 2026">
      <h2>Rates</h2>
      <ul>
        <li>Flat rate: <strong>PKR 250</strong> nationwide</li>
        <li>Free shipping on orders over <strong>PKR 10k</strong></li>
      </ul>
      <h2>Timelines</h2>
      <ul>
        <li>Lahore, Karachi, Islamabad: <strong>2–3 business days</strong></li>
        <li>All other cities: <strong>3–5 business days</strong></li>
      </ul>
      <h2>Cash on Delivery</h2>
      <p>COD is available on every order across Pakistan. Our team will confirm via WhatsApp before dispatch.</p>
      <h2>Tracking</h2>
      <p>You can track your order anytime via the <strong>Track Order</strong> page using your order number and phone.</p>
    </PolicyPage>
  ),
});

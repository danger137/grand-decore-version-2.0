import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy — GrandDecore" }, { name: "description", content: "Our refund terms for orders placed with GrandDecore." }] }),
  component: () => (
    <PolicyPage eyebrow="Policy" title="Refund Policy" updated="June 2026">
      <p>If you're not in love with your piece, we'll make it right.</p>
      <h2>Refund window</h2>
      <p>You may request a refund within <strong>14 days</strong> of delivery. Items must be unused and in their original packaging.</p>
      <h2>Process</h2>
      <ul>
        <li>WhatsApp us at <strong>03238041309</strong> with your order number</li>
        <li>We arrange a pickup at no cost to you</li>
        <li>Refunds are processed within 5–7 business days after we receive the item</li>
      </ul>
      <h2>Non-refundable</h2>
      <ul>
        <li>Sale or final-sale pieces</li>
        <li>Custom commissions</li>
        <li>Items damaged after delivery</li>
      </ul>
    </PolicyPage>
  ),
});

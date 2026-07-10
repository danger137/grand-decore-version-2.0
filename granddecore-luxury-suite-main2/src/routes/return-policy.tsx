import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/return-policy")({
  head: () => ({ meta: [{ title: "Return Policy — GrandDecore" }, { name: "description", content: "How to return a GrandDecore order." }] }),
  component: () => (
    <PolicyPage eyebrow="Policy" title="Return Policy" updated="June 2026">
      <h2>30-day returns</h2>
      <p>Return any non-sale piece within <strong>30 days</strong> of delivery, no questions asked. The item must be unused and in its original packaging.</p>
      <h2>How to return</h2>
      <ul>
        <li>WhatsApp <strong>03238041309</strong> with your order number</li>
        <li>We arrange a free pickup from your address</li>
        <li>Refund is issued within 5–7 business days of receipt</li>
      </ul>
      <h2>Damaged on arrival</h2>
      <p>If a piece arrives damaged, send us a photo within 48 hours and we'll replace it or refund you in full — including delivery.</p>
    </PolicyPage>
  ),
});

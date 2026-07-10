import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({ meta: [{ title: "Terms & Conditions — GrandDecore" }, { name: "description", content: "The terms governing your use of granddecore.com." }] }),
  component: () => (
    <PolicyPage eyebrow="Policy" title="Terms & Conditions" updated="June 2026">
      <p>By using granddecore.com you agree to these terms.</p>
      <h2>Orders</h2>
      <p>All orders are subject to availability and confirmation of the order price. We reserve the right to cancel any order at our discretion.</p>
      <h2>Pricing</h2>
      <p>Prices are listed in PKR. We may revise prices at any time; the price at checkout is the price you pay.</p>
      <h2>Intellectual property</h2>
      <p>All photography, text and product names on this site are the intellectual property of GrandDecore.</p>
      <h2>Liability</h2>
      <p>We are not liable for any indirect or consequential loss arising from your use of the site or our products.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Islamic Republic of Pakistan.</p>
    </PolicyPage>
  ),
});

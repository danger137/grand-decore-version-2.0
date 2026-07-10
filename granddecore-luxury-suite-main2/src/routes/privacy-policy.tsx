import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — GrandDecore" }, { name: "description", content: "How GrandDecore collects, uses and protects your information." }] }),
  component: () => (
    <PolicyPage eyebrow="Policy" title="Privacy Policy" updated="June 2026">
      <p>GrandDecore (“we”, “our”, “us”) respects your privacy. This policy explains what we collect when you visit granddecore.com and place an order, and what we do with it.</p>
      <h2>Information we collect</h2>
      <ul>
        <li>Name, phone, WhatsApp, city and delivery address at checkout</li>
        <li>Order history and items purchased</li>
        <li>Anonymous browsing analytics</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To fulfil and deliver your order</li>
        <li>To send delivery updates via WhatsApp or SMS</li>
        <li>To improve the website and product range</li>
      </ul>
      <h2>Sharing</h2>
      <p>We never sell your personal data. We share it only with delivery partners required to complete your order.</p>
      <h2>Your rights</h2>
      <p>Email <strong>hello@granddecore.com</strong> to access, correct or delete your data at any time.</p>
    </PolicyPage>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({ meta: [{ title: "Cookie Policy — GrandDecore" }, { name: "description", content: "How we use cookies on granddecore.com." }] }),
  component: () => (
    <PolicyPage eyebrow="Policy" title="Cookie Policy" updated="June 2026">
      <p>We use cookies and local storage to remember your shopping bag, wishlist, and recently viewed pieces — and to understand how the site is used.</p>
      <h2>Cookies we use</h2>
      <ul>
        <li><strong>Essential</strong>: shopping bag, login session</li>
        <li><strong>Analytics</strong>: anonymous page views</li>
      </ul>
      <h2>Your choice</h2>
      <p>You can clear cookies at any time through your browser settings. Disabling essential cookies will prevent the cart from working.</p>
    </PolicyPage>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — GrandDecore" },
      { name: "description", content: "The terms governing your use of granddecore.com." },
    ],
  }),

  component: () => (
    <PolicyPage eyebrow="Policy" title="Terms & Conditions" updated="July 2026">
      <p>
        Welcome to <strong>GrandDecore</strong>. By accessing and using <strong>granddecore.com</strong>, you acknowledge that you have read, understood, and agreed to be bound by the following terms and conditions.
      </p>

      <h2>1. Orders and Acceptance</h2>
      <p>
        All orders placed through our website are subject to product availability and confirmation of the order price. While we strive to maintain accurate inventory levels, we reserve the right to cancel or limit any order at our discretion, including in instances of pricing errors or suspected fraudulent activity.
      </p>

      <h2>2. Pricing and Payments</h2>
      <p>
        All prices are listed in Pakistani Rupees (PKR). GrandDecore reserves the right to revise product pricing at any time without prior notice. The price displayed at the final checkout stage is the definitive price you are obligated to pay. All payments are processed in accordance with our shipping and COD policies.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All content present on this website, including but not limited to product photography, design descriptions, website text, logos, and product names, is the exclusive intellectual property of <strong>GrandDecore</strong>. Any unauthorized reproduction, distribution, or commercial use of our proprietary assets is strictly prohibited.
      </p>

      <h2>4. Limitation of Liability</h2>
      <p>
        GrandDecore is not liable for any indirect, incidental, or consequential losses, including loss of data or profit, arising from your use of this website or the inability to use our products. We provide our services on an "as is" basis without warranties of any kind.
      </p>

      <h2>5. Governing Law</h2>
      <p>
        These terms and conditions, and any disputes arising from your use of our website or the purchase of our products, shall be governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>.
      </p>

      <h2>6. Modifications</h2>
      <p>
        We reserve the right to update or modify these Terms & Conditions at any time to reflect changes in our business operations or legal requirements. Your continued use of the website following such changes constitutes your acceptance of the revised terms.
      </p>
    </PolicyPage>
  ),
});
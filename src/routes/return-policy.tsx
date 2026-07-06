import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/return-policy")({
  head: () => ({
    meta: [
      { title: "Return Policy — GrandDecore" },
      {
        name: "description",
        content:
          "Read GrandDecore's official 30-day return policy. Learn how to return your item with free doorstep pickup, zero hidden fees, and hassle-free processing.",
      },
    ],
  }),

  component: () => (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <PolicyPage
        eyebrow="Policy"
        title="Return Policy"
        updated="June 2026"
      >
        <p>
          At <strong>GrandDecore</strong>, our ultimate mission is to bring exquisite artistry, premium craftsmanship, and unparalleled elegance into your living spaces. We meticulously design and inspect every single home decor product to ensure it meets our strict premium quality benchmarks before it leaves our main warehouse. However, we completely understand that shopping for high-end home decor online requires absolute confidence. Sometimes, a piece might not match your room's precise dimensions, or the color tone might look slightly different under your home's unique interior lighting. If a product does not fully meet your expectations, we are firmly dedicated to resolving the issue effortlessly.
        </p>

        <p>
          We strongly believe that digital shopping should be built on an absolute foundation of trust, transparency, and consumer convenience. Our comprehensive Return Policy has been constructed to outline exactly how we handle items you wish to send back. We have removed traditional administrative red tape, hidden shipping surcharges, and complicated return merchant authorizations. This document serves as a complete, transparent guide ensuring a smooth, secure, and entirely risk-free return journey for our valued community.
        </p>

        <hr />

        <h2>1. The 30-Day "No Questions Asked" Return Window</h2>
        <p>
          We proudly extend a comprehensive <strong>30-day return window</strong> on any non-sale, standard catalog item purchased directly from our online storefront. This generous 30-day evaluation period begins the exact day the physical parcel is marked as successfully delivered to your shipping address by our logistical handlers.
        </p>
        <p>
          We want you to have sufficient time to carefully unbox your chosen piece, examine its intricate design details, and evaluate how it harmonizes with your home's existing furniture, wallpapers, and aesthetic themes. If within these 30 days you decide that the item is simply not the perfect fit, you can return it to us with no questions asked. To ensure eligibility for a complete refund or exchange, please guarantee the following standard product conditions:
        </p>
        <ul>
          <li>The decor item must be completely unused, unwashed, clean, and in its pristine original condition.</li>
          <li>The product must be housed securely within its original structural packaging, including all multi-layer bubble wraps, corner foam protectors, custom styrofoam paddings, labels, boxes, and complimentary inserts.</li>
          <li>The item must not exhibit any post-delivery structural wear, scratches, structural modifications, water damage, or product alterations.</li>
        </ul>

        <hr />

        <h2>2. Step-by-Step Return Procedure: Seamless & Stress-Free</h2>
        <p>
          We understand that your time is incredibly valuable. We deeply dislike complex digital ticket systems, hidden email threads, or robotic phone customer lines that waste your energy. To make returning an item as fast and convenient as humanly possible, we have integrated our entire return mechanism directly through WhatsApp.
        </p>
        <p>
          To safely launch a standard product return, please execute the following three simple steps:
        </p>
        <ol>
          <li>
            <strong>Initiate via WhatsApp:</strong> Simply open your WhatsApp application and send a direct text message to our dedicated client care channel at <strong>03238041309</strong>. Please state your formal order number (e.g., #GD-5012) and provide a couple of clear photographs or a short video clip demonstrating the current clean state of the product along with its original packaging box.
          </li>
          <li>
            <strong>Free Reverse Doorstep Pickup:</strong> Once our manual support representatives review your message (typically within a few operating hours), we will instantly validate your request. We will immediately book a reverse courier pickup directly from your residential address through our verified logistical shipping channels (such as TCS, Leopards, or Trax). <strong>This reverse pickup is arranged at absolutely no cost to you.</strong> GrandDecore covers 100% of the return transit fees.
          </li>
          <li>
            <strong>Inspection & Final Reversal:</strong> Once the physical package travels back to our central hub in Faisalabad, our warehouse operators will open it to verify that the standard conditions are met. Following a successful inspection, your refund is approved and formally transferred to your account within <strong>5 to 7 business days</strong>.
          </li>
        </ol>

        <hr />

        <h2>3. Financial Reversals & Payment Methods</h2>
        <p>
          Because our platform values accessibility across Pakistan, a substantial portion of our transactions are safely cleared using the traditional <strong>Cash on Delivery (COD)</strong> option. Since we do not store any sensitive digital card metrics or banking passwords on our bare servers, we issue your cash refunds back to you through safe, instantaneous digital remittance channels.
        </p>
        <p>
          During your direct text communication with our WhatsApp team, you can simply nominate your preferred digital payment channel. We can process your complete order value directly to:
        </p>
        <ul>
          <li>Direct Local Bank Transfers (to any active commercial bank operating within Pakistan)</li>
          <li>Easypaisa Mobile Wallets</li>
          <li>JazzCash Mobile Wallets</li>
        </ul>
        <p>
          We believe in complete financial fairness. We do not deduct arbitrary dynamic restocking penalties, hidden transactional handling cuts, or processing percentages. Your money is returned to you as fully fluid cash.
        </p>

        <hr />

        <h2>4. Damaged or Defective Items on Arrival</h2>
        <p>
          Transporting fragile, artisanal wall art, mirrors, and delicate decor pieces across national transits requires intense cushioning. While we implement structural multi-layered bubble wraps, thick corrugated boxing shields, and robust packing tape, accidents can rarely happen due to rough courier handling along the highway systems.
        </p>
        <p>
          If your package arrives at your home and you notice that the item inside has been fractured, cracked, dented, or compromised during shipping, please do not stress or feel anxious! We assume full legal and financial responsibility for items damaged during transit.
        </p>
        <p>
          Simply snap a quick photo of the broken piece exactly as it sits within the shipping container and send it to our WhatsApp care team at <strong>03238041309</strong> within <strong>48 hours of delivery</strong>. Once received, we will bypass all standard waiting cycles and immediately ship out a brand-new, immaculate replacement piece to you completely free of charge, or issue a full instant refund covering the complete product value and initial delivery costs.
        </p>

        <hr />

        <h2>5. Strict Exceptions and Non-Returnable Products</h2>
        <p>
          To ensure that we can continue supporting our skilled local artisans and offering premium products sustainably, we have established certain clear structural boundaries. The following types of purchases are strictly exempt from our 30-day return policy and cannot be sent back for a refund or product exchange:
        </p>
        <ul>
          <li>
            <strong>Sale and Clearance Inventory:</strong> Any items bought from our active "Clearance Sales," flash events, markdown collections, or explicitly labeled as "Final Sale" cannot be returned or refunded. These items are distributed as-is.
          </li>
          <li>
            <strong>Bespoke Custom Commissions:</strong> If you requested our design team to manufacture a highly personalized item with custom measurements, specialized color codes, or individualized text layouts, these items cannot be returned as they were built specifically for you.
          </li>
          <li>
            <strong>Post-Delivery Structural Abuse:</strong> Any item that has suffered direct drop impact, chips, scratches, chemical exposure, stains, or fractures *after* it was safely and successfully placed in your home is automatically disqualified from our return policy.
          </li>
        </ul>

        <hr />

        <h2>6. Simple Product Exchanges</h2>
        <p>
          In many cases, you might still want a beautiful GrandDecore piece, but you simply prefer an alternate colorway, a larger scale, or a completely different category of premium wall art. We are more than happy to facilitate structural product exchanges within the same 30-day operational framework.
        </p>
        <p>
          The step-by-step process for an exchange follows the exact same pattern as a return: let our team know what new catalog piece you wish to swap for on WhatsApp, and we will coordinate a seamless simultaneous delivery of the new item alongside the free reverse pickup of your old parcel. Any outstanding price differences will be settled simply via online bank transfer or via Cash on Delivery during the final swap.
        </p>

        <hr />

        <h2>7. Client Responsibilities for Return Shipping Packaging</h2>
        <p>
          To make sure that our complimentary reverse courier services proceed without any unexpected logistical rejections or transit breakage, we kindly call on our community to assist us during the final packing step:
        </p>
        <ul>
          <li>Please bundle the decor piece safely back inside its protective sheets and bubble wrap layers so it doesn't shift inside the box.</li>
          <li>Ensure that the outer cardboard box is firmly taped down on all major edges using standard packaging tape.</li>
          <li>You do not need to print any paper shipping labels or waybills. The courier driver will generate a digital consignment receipt when they arrive at your physical address.</li>
        </ul>

        <hr />

        <h2>8. Prevention of Policy Misuse</h2>
        <p>
          GrandDecore is a home-grown brand built on deep mutual respect, love for interior architecture, and consumer trust. We offer completely free return shipping and long evaluation windows because we believe in our community. However, if our transaction history logs highlight a clear pattern of policy abuse (such as buying premium items for short-term commercial use during temporary events, product photography, or staging setups, and subsequently requesting returns), we reserve the right to flag the associated accounts and decline future order fulfillments.
        </p>

        <hr />

        <h2>9. Future Policy Amendments</h2>
        <p>
          We reserve the right to periodically modify, optimize, or clarify specific operational guidelines within this text to better align with changing national courier frameworks, high-volume seasonal shipping rushes, or updated retail commerce regulations. The active text displayed here represents our live operating guidelines. Any edits take effect immediately upon publishing, though our core foundational promise of a flexible, customer-first return experience will remain permanently intact.
        </p>

        <hr />

        <h2>10. Complete Brand Support & Communication</h2>
        <p>
          If you have any specific inquiries regarding your ongoing shipment, require clarification on a return parameter, or simply want to speak with our support staff about a product fit, our communication lines are permanently open to help you:
        </p>

        <ul>
          <li>
            <strong>Brand Identity:</strong> GrandDecore
          </li>
          <li>
            <strong>Official WhatsApp Care:</strong> 03238041309 <em>(Recommended for ultra-fast support responses)</em>
          </li>
          <li>
            <strong>Direct Operations Email:</strong> granddecore656@gmail.com
          </li>
          <li>
            <strong>Headquarters & Distribution Center:</strong> Faisalabad, Punjab, Pakistan
          </li>
        </ul>

        <p>
          Thank you enormously for trusting GrandDecore to bring elegance into your home. We stand behind our curated crafts with pride, and we are honored to guarantee you this absolute worry-free 30-day return protection!
        </p>
      </PolicyPage>
    </div>
  ),
});
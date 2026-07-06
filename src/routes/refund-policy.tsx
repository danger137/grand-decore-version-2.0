import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Return Policy — GrandDecore" },
      {
        name: "description",
        content:
          "Read GrandDecore's detailed Refund Policy. Discover our hassle-free 14-day return window, free return pickups, and straightforward refund process.",
      },
    ],
  }),

  component: () => (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <PolicyPage
        eyebrow="Policy"
        title="Refund Policy"
        updated="June 2026"
      >
        <p>
          At <strong>GrandDecore</strong>, our primary goal is to help you transform your house into a beautiful, warm, and artistic home. We put immense love, dedication, and strict quality control into crafting every single piece of home decor that leaves our warehouse. However, we completely understand that shopping for interior design items online can sometimes be challenging. A piece might look slightly different in your room's specific lighting, or it might not fit the exact aesthetic you originally envisioned. If you are not deeply in love with your chosen piece, please do not worry—we are fully committed to making it right.
        </p>

        <p>
          We believe that a customer’s relationship with us does not end when a delivery rider hands over a package. In fact, that is exactly where our core commitment to customer satisfaction begins. To protect your hard-earned money and give you complete peace of mind, we have established a highly transparent, incredibly fair, and completely stress-free Refund and Return Policy. We do not hide behind complex legal jargon or unfair terms. This comprehensive document outlines exactly how we handle returns, exchanges, and reversals, ensuring a smooth and pleasant journey from start to finish.
        </p>

        <hr />

        <h2>1. The 14-Day Risk-Free Refund Window</h2>
        <p>
          We proudly offer a generous <strong>14-day return and refund window</strong> starting from the exact date your package is marked as successfully delivered by our courier partner. We want you to have ample time to unbox your order, inspect the craftsmanship, place it in your living space, and see how it complements your existing furniture and wall colors.
        </p>
        <p>
          If within those 14 days you decide that the item isn't the perfect fit for your home, you are fully eligible to initiate a return request. To qualify for a complete refund, please ensure the following basic criteria are met:
        </p>
        <ul>
          <li>The item must be completely unused, unwashed, and in the exact same pristine condition that you received it.</li>
          <li>The product must be kept inside its original packaging, including all protective bubble wraps, thermocol layers, styrofoam padding, tags, boxes, and accompanying documentation.</li>
          <li>There should be no structural alterations, scratches, paint chips, or signs of usage on the item.</li>
        </ul>

        <hr />

        <h2>2. Step-by-Step Refund Process: Simple & Straightforward</h2>
        <p>
          We strongly dislike long forms, complicated customer support portals, or automated email loops that lead nowhere. We have simplified our return mechanism so that you can complete it through a direct conversation with a real human being on your favorite messaging app.
        </p>
        <p>
          To initiate your refund request, simply follow these three easy steps:
        </p>
        <ol>
          <li>
            <strong>Reach out on WhatsApp:</strong> Open your WhatsApp app and send a direct text message to our official customer care line at <strong>+92 323 8041309</strong>. Please include your original Order Number (e.g., #GD-1024) and attach a couple of clear photos or a quick video showing the current undamaged condition of the item and its original packaging.
          </li>
          <li>
            <strong>Free Reverse Pickup Arrangement:</strong> Once our support team reviews your message (usually within a few hours), we will approve the request and personally book a reverse pickup through our premium courier partners (like TCS, Leopards, or Trax). A delivery rider will come directly to your home address to collect the parcel. <strong>This pickup service is arranged at absolute zero cost to you</strong>—GrandDecore covers 100% of the return shipping fees!
          </li>
          <li>
            <strong>Inspection & Financial Processing:</strong> As soon as the physical package arrives back at our Faisalabad warehouse, our quality assurance team will open it to verify the contents. Once cleared, your refund is approved immediately and processed securely back to you within <strong>5 to 7 business days</strong>.
          </li>
        </ol>

        <hr />

        <h2>3. How You Receive Your Money Back</h2>
        <p>
          Since the vast majority of our valued customers prefer our convenient <strong>Cash on Delivery (COD)</strong> option at checkout, your initial payment is made via physical currency to a courier agent. Therefore, when it comes to returning that money to you, we use direct digital financial channels.
        </p>
        <p>
          When you chat with us on WhatsApp to finalize your refund approval, our team will request your preferred account details. We can instantly transfer your full refund amount via:
        </p>
        <ul>
          <li>Direct Bank Transfer (to any commercial bank account within Pakistan)</li>
          <li>Easypaisa Digital Wallet</li>
          <li>JazzCash Digital Wallet</li>
        </ul>
        <p>
          We do not cut hidden processing percentages, and we do not force you to accept "store credit" vouchers unless you explicitly ask for an exchange instead. Your money is returned to you as real, spendable cash.
        </p>

        <hr />

        <h2>4. Non-Refundable Items & Strict Exceptions</h2>
        <p>
          While we try our best to be as flexible and accommodating as humanly possible, there are certain clear operational boundaries we must set to maintain a sustainable business model. The following specific items are strictly excluded from our refund policy and cannot be returned:
        </p>
        <ul>
          <li>
            <strong>Sale & Clearance Pieces:</strong> Any products purchased from our "Clearance Sale," special promotional flash events, or marked as "Final Sale" cannot be refunded or exchanged. These heavily discounted pieces are sold as-is.
          </li>
          <li>
            <strong>Custom Commissions & Personalized Orders:</strong> If you requested a bespoke, customized piece where our artisans altered the sizes, colors, dimensions, or text details specifically to fit your personal specifications, this item cannot be returned or refunded since it was uniquely built for you.
          </li>
          <li>
            <strong>Items Damaged Post-Delivery:</strong> Any decor pieces that suffer accidental structural damage, drops, cracks, exposure to water/fire, or tearing *after* the item was successfully and safely delivered to your address do not qualify for a refund.
          </li>
        </ul>

        <hr />

        <h2>5. Damaged, Defective, or Wrong Items Sent</h2>
        <p>
          Handcrafting fragile home decor pieces and shipping them across the country requires extreme care. While we use industry-grade, heavy-duty multi-layer bubble wrapping and thick corrugated boxing, there is a very rare chance that a parcel might encounter rough handling during transit by courier personnel.
        </p>
        <p>
          If you open your package and discover that the item has arrived broken, cracked, defective, or if we accidentally shipped the wrong color or product variant, please do not worry or stress! You do not even need to wait for a standard 14-day window review.
        </p>
        <p>
          Simply take a photo of the damaged piece right inside the shipping box and WhatsApp it to us at <strong>+92 323 8041309</strong> within 48 hours of delivery. We will immediately ship out a brand-new, perfect replacement piece to your home at absolute zero additional cost, or issue a full immediate refund depending entirely on what you prefer.
        </p>

        <hr />

        <h2>6. Product Exchange Options</h2>
        <p>
          Sometimes, you don't necessarily want your money back—you just want a different color, a bigger size, or a completely different style of wall art altogether! We happily welcome product exchanges within the same 14-day window.
        </p>
        <p>
          The exchange process is identical to our refund process: send us a text on WhatsApp, let us know which alternative product you would like to pick from our website, and we will coordinate the exchange dispatch along with a free pickup of the original item. If there is a price difference between the old and new piece, we will settle it easily via bank transfer or Cash on Delivery for the remaining balance.
        </p>

        <hr />

        <h2>7. Customer Responsibilities During Return Pickups</h2>
        <p>
          To make sure our free reverse pickup service goes completely smoothly without any administrative delays, we kindly request our customers to act responsibly during the re-packing phase:
        </p>
        <ul>
          <li>Please make sure the item is placed safely back inside its original protective layers so it doesn't break on its journey back to Faisalabad.</li>
          <li>Ensure the parcel is securely taped up from all sides using standard packing tape.</li>
          <li>You do not need to print any labels; the courier rider will bring a digital consignment note when they arrive at your doorstep. Just hand over the packed box safely to the designated rider.</li>
        </ul>

        <hr />

        <h2>8. Abuse of the Refund & Return Policy</h2>
        <p>
          GrandDecore is built entirely on mutual trust, respect, and deep appreciation for art and craftsmanship. We proudly offer free return shipping and instant refunds because we trust our community. However, if our data logs indicate an individual is systematically purchasing items with the clear intent of short-term usage (e.g., renting decor for a quick photoshoot or event and then requesting a refund), or repeatedly ordering and cancelling without valid reasons, we reserve the right to flag that user account and reject future order placements.
        </p>

        <hr />

        <h2>9. Policy Variations & Updates</h2>
        <p>
          We may occasionally adjust or fine-tune specific operational processes outlined in this document to adapt to newer courier regulations, seasonal holiday logistics schedules, or updated national retail frameworks. The text on this page represents our live, active policy framework. Any adjustments will take effect immediately upon being posted publicly here, though we promise to always protect the original consumer-friendly spirit of our 14-day window.
        </p>

        <hr />

        <h2>10. Need Immediate Help? Reach Our Team Directly</h2>
        <p>
          If you have a question about a return that hasn't been answered in this detailed document, or if you want to check up on the real-time status of your ongoing refund processing, please feel free to drop us a line anytime. We are local, friendly, and always ready to help:
        </p>

        <ul>
          <li>
            <strong>Brand Name:</strong> GrandDecore
          </li>
          <li>
            <strong>Official WhatsApp Support:</strong> +92 323 8041309 <em>(Highly Recommended for Instant Responses)</em>
          </li>
          <li>
            <strong>Direct Support Email:</strong> granddecore656@gmail.com
          </li>
          <li>
            <strong>Central Warehouse Location:</strong> Faisalabad, Punjab, Pakistan
          </li>
        </ul>

        <p>
          Thank you for choosing GrandDecore to add a touch of elegance to your home. We deeply value your presence, and we stand firmly behind our high-quality products with this absolute worry-free refund guarantee!
        </p>
      </PolicyPage>
    </div>
  ),
});
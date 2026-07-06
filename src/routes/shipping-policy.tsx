import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — GrandDecore" },
      {
        name: "description",
        content:
          "Read GrandDecore's official shipping rates, delivery timelines, and nationwide coverage details for orders across Pakistan.",
      },
    ],
  }),

  component: () => (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <PolicyPage
        eyebrow="Policy"
        title="Shipping Policy"
        updated="July 2026"
      >
        <p>
          At <strong>GrandDecore</strong>, we understand that the excitement of decorating your home begins the moment you click "Place Order." We are committed to ensuring that your chosen handcrafted decor reaches your doorstep safely, efficiently, and in pristine condition. We operate a highly organized nationwide distribution network that covers every corner of Pakistan, from the bustling metropolitan centers to the furthest residential towns.
        </p>

        <p>
          This Shipping Policy is designed to provide you with complete visibility into our logistical operations. We believe in total transparency regarding delivery costs, shipping durations, and the tracking journey of your parcel. Our goal is to make the wait for your beautiful new home decor as short and stress-free as possible.
        </p>

        <hr />

        <h2>1. Transparent Shipping Rates</h2>
        <p>
          We aim to keep our shipping costs as low and predictable as possible. We do not believe in complex weight-based calculations or hidden surcharges at the final checkout stage. Our pricing model is straightforward and fair:
        </p>
        <ul>
          <li><strong>Flat Nationwide Rate:</strong> For all standard orders across Pakistan, we charge a flat, affordable shipping fee of just <strong>PKR 250</strong>. This fee remains the same regardless of your city or the specific province you reside in.</li>
          <li><strong>Complimentary Free Shipping:</strong> We love rewarding our customers who choose to renovate their homes with us. Any order with a total value exceeding <strong>PKR 10,000</strong> automatically qualifies for <strong>Free Nationwide Shipping</strong>. We cover the entire transit cost, allowing you to enjoy your premium home decor without any delivery charges.</li>
        </ul>

        <hr />

        <h2>2. Delivery Timelines & Logistics</h2>
        <p>
          We partner with Pakistan's most reliable and premium courier networks (such as TCS, Leopards, Trax, and M&P) to ensure your fragile decor is handled with care. While shipping times can occasionally fluctuate due to weather conditions or public holidays, our standard service level agreements ensure the following delivery windows:
        </p>
        <ul>
          <li><strong>Metropolitan Centers:</strong> For deliveries to <strong>Lahore, Karachi, and Islamabad</strong>, you can typically expect your package to arrive within <strong>2–3 business days</strong> after the dispatch date.</li>
          <li><strong>Rest of Pakistan:</strong> For all other cities, towns, and regional areas, we ensure a reliable delivery window of <strong>3–5 business days</strong>.</li>
        </ul>
        <p>
          Please note that "business days" exclude Sundays and national public holidays observed in Pakistan. Once your order leaves our Faisalabad warehouse, we hand it over to our courier partners, who then take charge of the final leg of the journey to your residence.
        </p>

        <hr />

        <h2>3. Cash on Delivery (COD) Convenience</h2>
        <p>
          We prioritize your comfort and trust, which is why <strong>Cash on Delivery (COD)</strong> is available as a standard payment option for every single order across our entire catalog. Whether you are ordering a small wall hanging or a large handcrafted centerpiece, you have the flexibility to pay in cash only when the parcel is physically in your hands.
        </p>
        <p>
          <strong>The Order Confirmation Process:</strong> To prevent fraudulent orders and ensure your delivery goes smoothly, every single order placed on our website undergoes a quick verification step. After you checkout, our support team will reach out to you via <strong>WhatsApp</strong> at the number provided. A short, friendly confirmation message ensures that your address is accurate and that you are ready to receive the shipment. We do not dispatch any order until we have received this confirmation, ensuring our logistics resources are used efficiently.
        </p>

        <hr />

        <h2>4. Real-Time Order Tracking</h2>
        <p>
          We know that waiting for a delivery can be anxious. To provide you with constant peace of mind, we offer a dedicated <strong>Track Order</strong> portal on our website.
        </p>
        <p>
          You can check the real-time status of your parcel at any time, 24/7. Simply navigate to our "Track Order" page and enter your <strong>Order Number</strong> and your <strong>Registered Phone Number</strong>. This portal will provide you with the most up-to-date information regarding your package's transit status, dispatch details, and estimated arrival.
        </p>

        <hr />

        <h2>5. Safe Handling & Quality Packaging</h2>
        <p>
          GrandDecore products are often fragile, and we take our responsibility to protect them seriously. Our packing team utilizes high-density protective materials including multi-layer bubble wrap, heavy-duty cardboard reinforcements, and shock-absorbent fillers. We treat every parcel as if it were a fragile gift, ensuring that when it finally reaches your home, it is just as perfect as it was when it left our facility in Faisalabad.
        </p>

        <hr />

        <h2>6. Delivery Attempt Guidelines</h2>
        <p>
          Our courier partners typically make up to two attempts to deliver your package to your shipping address. If you are unavailable at the time of the first delivery attempt, the courier will leave a notification or attempt to contact you via the phone number provided on your shipping label. Please ensure that the contact number provided during checkout is active and reachable to avoid any unnecessary delays or return-to-origin scenarios.
        </p>

        <hr />

        <h2>7. Shipping Address Accuracy</h2>
        <p>
          To ensure a successful delivery, please double-check your shipping address during the checkout process. We require specific details including your house number, street name, block/sector, city, and a reachable phone number. If you realize you have made a mistake in your address after placing the order, please message our WhatsApp support immediately at <strong>03238041309</strong> so we can update our records before the parcel is handed over to the courier.
        </p>

        <hr />

        <h2>8. Policy Updates</h2>
        <p>
          As we grow, we may periodically adjust our shipping zones, courier partnerships, or delivery time estimates to maintain the highest quality of service. Any changes to our shipping policy will be published here immediately. Your continued use of our services indicates your acceptance of these operational standards.
        </p>

        <hr />

        <h2>9. Need Help with Your Delivery?</h2>
        <p>
          If you have any questions regarding your delivery timeline, or if your order hasn't arrived within the expected window, please don't hesitate to reach out. Our team is local, friendly, and always ready to assist you:
        </p>

        <ul>
          <li>
            <strong>Brand Name:</strong> GrandDecore
          </li>
          <li>
            <strong>Official WhatsApp Support:</strong> 03238041309
          </li>
          <li>
            <strong>Support Email:</strong> granddecore656@gmail.com
          </li>
          <li>
            <strong>Warehouse Location:</strong> Faisalabad, Punjab, Pakistan
          </li>
        </ul>

        <p>
          Thank you for choosing GrandDecore. We are honored to be part of your home decor journey, and we are committed to delivering excellence directly to your door!
        </p>
      </PolicyPage>
    </div>
  ),
});
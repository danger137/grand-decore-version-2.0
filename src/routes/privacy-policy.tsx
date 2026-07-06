import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/storefront/policy-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — GrandDecore" },
      {
        name: "description",
        content:
          "Read the detailed Privacy Policy of GrandDecore. Learn why and how we maintain a strict zero-tracking, zero-cookie, and minimal data collection store.",
      },
    ],
  }),

  component: () => (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <PolicyPage
        eyebrow="Policy"
        title="Privacy Policy"
        updated="July 2026"
      >
        <p>
          Welcome to <strong>GrandDecore</strong>. We extend our warmest greetings to everyone visiting our online store. This Privacy Policy has been carefully drafted to provide absolute clarity and transparency regarding how your personal space is respected on our platform. While most e-commerce websites across the internet constantly monitor, log, and analyze your digital footprint, GrandDecore operates on a fundamentally different principle: <strong>We do not collect unnecessary personal data, we do not track your IP address, and we do not use invasive tracking cookies.</strong>
        </p>

        <p>
          We firmly believe that every single customer deserves the absolute right to digital privacy. When you are browsing for beautiful home decor items or placing an order to uplift your living space, you should not have to worry about your data being harvested, analyzed, or sold. The core objective of this comprehensive policy is to give you complete peace of mind. By accessing, browsing, and interacting with our website, you acknowledge and agree to this straightforward, no-tracking philosophy. If you do not agree with our minimal data practices, you are free to discontinue using our platform, though we assure you that your privacy is safer here than anywhere else.
        </p>

        <hr />

        <h2>1. Our Ultimate Rule: Absolute Zero-Tracking & No-Spy Policy</h2>
        <p>
          In today's interconnected digital landscape, almost every website deploys invisible tracking scripts, background pixels, and sophisticated device fingerprinting tools to monitor user behavior. At GrandDecore, we have intentionally stripped away all such complex tracking mechanisms from our web architecture. We want your shopping experience to be free, authentic, and completely unmonitored.
        </p>
        <p>
          To maintain this high standard of privacy, our systems explicitly <strong>DO NOT</strong> collect, store, or process any of the following technical datasets:
        </p>
        <ul>
          <li><strong>No IP Address Logging:</strong> We do not log your Internet Protocol (IP) address. We have zero interest in tracking your precise geographical location, network provider, or regional internet routing details.</li>
          <li><strong>No Device Profiling:</strong> Our platform does not record whether you are accessing our store via a high-end smartphone, a desktop computer, a laptop, or a tablet. We do not save your operating system version or hardware specifications.</li>
          <li><strong>No Browser Fingerprinting:</strong> Whether you prefer Google Chrome, Apple Safari, Mozilla Firefox, or Microsoft Edge, your choice of browser remains entirely your own business. Our system does not keep a record of your browser type or settings.</li>
          <li><strong>No Behavioral Analytics:</strong> We do not track how long you stay on a specific product page, which item you clicked first, or your sequential navigation path through our store. Your browsing journey remains completely anonymous.</li>
        </ul>

        <hr />

        <h2>2. We Do Not Use Tracking Cookies</h2>
        <p>
          Cookies are small text files that websites quietly place into your web browser's storage to remember your identity, track your interests, and follow you around the internet to display targeted advertisements. GrandDecore strictly rejects this practice and does not deploy any tracking or advertising cookies.
        </p>
        <p>
          Because we do not track your interactions, you will never be stalked across social media or other websites by aggressive, repetitive advertisements featuring the home decor products you viewed here. You are completely free to block all cookies within your browser settings; our website does not rely on them and will continue to function flawlessly, ensuring a smooth, unrestricted shopping experience.
        </p>

        <hr />

        <h2>3. Minimal Data Collection: Only What is Mandatory for Delivery</h2>
        <p>
          A very logical question arises: If we do not track or collect anything automatically, what information do we actually collect? The answer is incredibly simple. We only request the absolute bare minimum, fundamental pieces of information without which a physical courier company cannot transport your order to your doorstep.
        </p>
        <p>
          When you find the perfect handcrafted decor piece and decide to finalize your purchase, our checkout form will ask you to manually provide only the following essential details:
        </p>
        <ul>
          <li><strong>Your Full Name:</strong> This is required so that the logistics provider and delivery rider know exactly who the parcel belongs to and who to ask for upon arrival at your destination.</li>
          <li><strong>Phone & WhatsApp Number:</strong> This is the most crucial piece of communication data. Our dedicated team uses this to confirm your order details, and the courier delivery rider will call this number to coordinate the exact drop-off timing when they reach your area.</li>
          <li><strong>Complete Shipping Address:</strong> Your precise house or apartment number, street name, block, sector, landmark, city, and province. Without an explicitly defined physical address, successful delivery is impossible.</li>
        </ul>
        <p>
          Beyond these three basic operational data points, we will never ask you personal questions, demand national identification numbers, or request any sensitive information that compromises your personal life.
        </p>

        <hr />

        <h2>4. How Your Essential Information is Utilized</h2>
        <p>
          The limited operational data (Name, Phone Number, and Address) that you explicitly provide during the checkout process is utilized strictly for direct logistical purposes. Specifically, it is processed only during the following steps:
        </p>
        <ol>
          <li>To print physical shipping labels and securely pack your chosen home decor items at our warehouse facility.</li>
          <li>To contact you directly via WhatsApp or voice call for order verification, address validation, and sharing your official tracking ID.</li>
          <li>To populate the digital booking systems of our third-party courier partners so they can accurately route the package to your city.</li>
          <li>To provide crucial updates in the rare event of a shipping delay, supply chain issue, or delivery cross-verification.</li>
        </ol>
        <p>
          We absolutely <strong>NEVER</strong> use your phone number or name for automated bulk SMS marketing, annoying promotional robocalls, unsolicited weekly newsletters, or generic spam. Your contact details are treated as a sacred trust and are never abused for promotional noise.
        </p>

        <hr />

        <h2>5. 100% Payment Security via Cash on Delivery (COD)</h2>
        <p>
          Shopping at GrandDecore is fundamentally secure because we have eliminated financial data vulnerability at the root level: We do not collect, process, or store any banking details, credit card numbers, or debit card credentials on our servers.
        </p>
        <p>
          We operate primarily through a highly secure <strong>Cash on Delivery (COD)</strong> business model. This means you never have to type your sensitive card numbers, expiration dates, or secret CVV codes into our website. You only hand over the cash payment when the physical product is delivered into your hands, and you are entirely satisfied with its craftsmanship. For rare instances involving direct bank transfers, the transaction occurs entirely within your own trusted banking app, ensuring our website never touches your financial accounts.
        </p>

        <hr />

        <h2>6. Data Sharing Restrictions: We Never Sell Your Data</h2>
        <p>
          It has unfortunately become common practice for digital companies to secretly monetize their user databases by renting or selling them to third-party marketing firms, data brokers, and advertising networks. At GrandDecore, we consider this practice an ethical violation.
        </p>
        <p>
          Your data is never sold, never rented, and never traded to anyone under any circumstances. The only external entities that ever see your shipping details are our **trusted logistics and courier partners** (such as TCS, Leopards, Trax, or M&P). These companies are given only your Name, Delivery Address, and Phone Number for the sole purpose of fulfillment. Outside of these essential transport personnel, no third party has access to your information.
        </p>

        <hr />

        <h2>7. Data Retention & Your Right to Permanent Deletion</h2>
        <p>
          We do not believe in hoarding digital data indefinitely. We retain your delivery information only for the duration required to successfully fulfill your order, manage potential courier returns, and clear our standard product exchange or warranty windows. Once the transaction cycle is entirely complete, your operational details are safely archived away from public-facing systems.
        </p>
        <p>
          Furthermore, you hold the ultimate right over your data. If you wish for us to purge your information immediately after your parcel arrives, you can exercise your right to erasure seamlessly. Simply send a short, casual message to our WhatsApp support team requesting the deletion of your order records. Our team will manually and permanently erase your name, phone number, and address from our active database without asking unnecessary questions.
        </p>

        <hr />

        <h2>8. Children's Digital Privacy Guardrails</h2>
        <p>
          GrandDecore curates high-quality, handcrafted home decor products intended exclusively for adults, homeowners, and interior design enthusiasts. Our platform is not structured for, nor aimed at, children under the age of 13. We do not knowingly or intentionally gather personal details from minors. If we discover that a child has accidentally submitted their name or phone number through our checkout form, we take immediate action to delete that record from our system, ensuring that orders are only verified and processed through an adult guardian.
        </p>

        <hr />

        <h2>9. Future Adjustments to This Privacy Document</h2>
        <p>
          As our storefront evolves, or should the digital frameworks and consumer protection laws of Pakistan undergo legal updates, we may periodically adjust certain administrative clauses within this document. Whenever an edit occurs, we will immediately reflect the changes by updating the "Revised Date" at the top of this page. While the structural phrasing might change to fit future business growth, our core foundation—the strict **Zero-Tracking, Zero-Cookie, No-Fuss Policy**—will remain permanently unchangeable.
        </p>

        <hr />

        <h2>10. Open Communication Channels (Contact Us)</h2>
        <p>
          If you have any lingering doubts, require further clarity regarding our operational stance, or wish to verify how your specific order data is being handled, our communication channels are always wide open. We welcome your inquiries with open arms and complete honesty. Please feel free to connect with us directly using the official corporate credentials provided below:
        </p>

        <ul>
          <li>
            <strong>Brand Name:</strong> GrandDecore
          </li>
          <li>
            <strong>Official Email:</strong> granddecore656@gmail.com
          </li>
          <li>
            <strong>Phone & WhatsApp Support:</strong> +92 323 8041309
          </li>
          <li>
            <strong>Headquarters Address:</strong> Faisalabad, Punjab, Pakistan
          </li>
        </ul>

        <p>
          Thank you immensely for choosing GrandDecore to beautify your home, and for taking the time to thoroughly read our Privacy Policy. We remain fully dedicated to providing you with a safe, authentic, and completely private shopping journey every single time you visit us!
        </p>
      </PolicyPage>
    </div>
  ),
});
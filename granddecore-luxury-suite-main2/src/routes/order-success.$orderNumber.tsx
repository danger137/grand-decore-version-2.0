import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/storefront/layout";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-success/$orderNumber")({
  head: () => ({ meta: [{ title: "Order Confirmed — GrandDecore" }, { name: "robots", content: "noindex" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { orderNumber } = Route.useParams();
  return (
    <StoreLayout>
      <section className="container-x py-32 text-center max-w-xl mx-auto">
        <CheckCircle2 className="h-12 w-12 mx-auto text-primary" />
        <p className="eyebrow justify-center mt-6">Order confirmed</p>
        <h1 className="font-display text-5xl mt-3">Thank you.</h1>
        <p className="mt-4 text-muted-foreground">Your order <b className="text-foreground">{orderNumber}</b> has been received. Our team will WhatsApp you shortly at 03238041309 to confirm delivery.</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/track-order" search={{ order: orderNumber } as never} className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.18em]">Track your order</Link>
          <Link to="/shop" className="border px-6 py-3 text-xs uppercase tracking-[0.18em] hover:bg-accent">Continue shopping</Link>
        </div>
      </section>
    </StoreLayout>
  );
}

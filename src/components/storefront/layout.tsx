import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";

export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    // FIX: h-[100vh] ko min-h-screen se replace kiya taake page flex limits me stretch na ho
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
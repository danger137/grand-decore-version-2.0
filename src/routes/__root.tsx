import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  redirect,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import hero1 from "@/assets/hero1.avif";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { checkIsAdminDomainFn } from "../lib/api";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="font-display mt-4 text-6xl">Lost in the gallery</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you were looking for has been moved or never existed.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-foreground px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-background transition-colors hover:bg-primary"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center">Something went wrong</p>
        <h1 className="font-display mt-4 text-4xl">Please try again</h1>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="bg-foreground px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-background hover:bg-primary">Try again</button>
          <a href="/" className="border border-input px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] hover:bg-accent">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ location }) => {
    let isAdminDomain = false;
    if (typeof window !== "undefined") {
      isAdminDomain = window.location.hostname.startsWith("admin.") || window.location.hostname.includes("admin");
    } else {
      isAdminDomain = await checkIsAdminDomainFn();
    }
    if (isAdminDomain) {
      if (!location.pathname.startsWith("/auth") && !location.pathname.startsWith("/admin")) {
        throw redirect({ to: "/auth" });
      }
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GrandDecore — Luxury Home Decor, Hand-Crafted" },
      { name: "description", content: "GrandDecore curates editorial home decor — sculptural vases, statement lighting, mirrors and textiles for the considered home." },
      { name: "author", content: "GrandDecore" },
      { property: "og:title", content: "GrandDecore — Luxury Home Decor" },
      { property: "og:description", content: "Editorial home decor for the considered home. Free shipping over All Pakistan. Cash on Delivery across Pakistan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/lgo.png" },
      { rel: "preload", as: "image", href: hero1, fetchPriority: "high" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "style", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Meta Pixel Code - Deferred for performance */}
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1374952151159954');
    fbq('track', 'PageView');
  }, 1500);
});` }} />
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1374952151159954&ev=PageView&noscript=1" alt="" />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
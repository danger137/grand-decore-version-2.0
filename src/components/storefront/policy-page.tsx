import type { ReactNode } from "react";
import { StoreLayout } from "./layout";

export function PolicyPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: ReactNode }) {
  return (
    <StoreLayout>
      <section className="container-x py-20 max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 leading-[1.05]">{title}</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Last updated {updated}</p>
        <article className="prose-policy mt-12 space-y-6 text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-2 [&_p]:text-base [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_strong]:text-foreground">
          {children}
        </article>
      </section>
    </StoreLayout>
  );
}

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fade}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow, title, subtitle, align = "left",
}: { eyebrow?: string; title: string; subtitle?: string; align?: "left" | "center" }) {
  return (
    <Reveal className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>}

      {/* ⬇️ HEADING FONT FAMILY: Yahan 'font-display' ki jagah apni marzi ki font class lagayein (e.g., font-serif) */}
      <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-[1.05]">{title}</h2>

      {subtitle && <p className="mt-4 text-muted-foreground leading-relaxed">{subtitle}</p>}
    </Reveal>
  );
}
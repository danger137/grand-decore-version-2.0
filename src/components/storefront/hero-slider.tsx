import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

// Local images ko import karein
import hero1 from "@/assets/hero1.avif";
import hero2 from "@/assets/hero2.avif";
import hero3 from "@/assets/hero3.avif";

type Slide = { image: string; eyebrow: string; title: string; subtitle: string; cta: { to: string; label: string } };

const slides: Slide[] = [
  {
    image: hero1, // Yahan import ki hui file use hogi
    eyebrow: "HAND-CRAFTED",
    title: "For The Considered\nHome",
    subtitle: "Limited-edition pieces, made slowly and shipped across Pakistan.",
    cta: { to: "/shop", label: "SHOP THE EDIT" },
  },
  {
    image: hero2,
    eyebrow: "LIGHTING COLLECTION",
    title: "Sculpted Light,\nQuiet Drama",
    subtitle: "Alabaster, brass and hand-blown glass — designed to glow.",
    cta: { to: "/shop", label: "DISCOVER LIGHTING" },
  },
  {
    image: hero3,
    eyebrow: "LIMITED DROP",
    title: "The Vessel Series\nIn Travertine",
    subtitle: "Twelve sculptural vases. Hand-carved. Numbered.",
    cta: { to: "/shop", label: "VIEW SERIES" },
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  const s = slides[i];

  return (
    <section className="relative h-[85vh] md:h-[88vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={s.image}
            alt={s.title}
            loading="eager" // Hero section hai to eager sahi hai
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full container-x flex flex-col justify-end md:justify-center pb-24 md:pb-0">
        <motion.div
          key={i}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-background"
        >
          <p className="eyebrow text-[10px] md:text-xs uppercase tracking-[0.2em]" style={{ color: "#4CC157" }}>
            {s.eyebrow}
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mt-2 leading-[1.05] tracking-tight whitespace-pre-line">
            {s.title}
          </h1>
          <p className="mt-4 text-sm md:text-lg opacity-85 max-w-sm leading-relaxed">
            {s.subtitle}
          </p>
          <Link
            to={s.cta.to}
            className="mt-6 inline-flex items-center gap-3 bg-background text-foreground px-6 py-3 text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors shadow-xl"
          >
            {s.cta.label} →
          </Link>
        </motion.div>

        <div className="absolute bottom-8 right-6 md:right-12 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-[2px] transition-all ${idx === i ? "w-10 bg-background" : "w-6 bg-background/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
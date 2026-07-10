import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

type Slide = { video: string; poster: string; eyebrow: string; title: string; subtitle: string; cta: { to: string; label: string } };

const slides: Slide[] = [
  {
    video: "https://videos.pexels.com/video-files/7515921/7515921-uhd_2560_1440_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920",
    eyebrow: "The Atelier Edit",
    title: "Hand-Crafted\nFor The Considered Home",
    subtitle: "Limited-edition pieces, made slowly and shipped across Pakistan.",
    cta: { to: "/shop", label: "Shop the Edit" },
  },
  {
    video: "https://videos.pexels.com/video-files/4783115/4783115-uhd_2560_1440_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920",
    eyebrow: "Lighting Collection",
    title: "Sculpted Light,\nQuiet Drama",
    subtitle: "Alabaster, brass and hand-blown glass — designed to glow.",
    cta: { to: "/shop", label: "Discover Lighting" },
  },
  {
    video: "https://videos.pexels.com/video-files/8068791/8068791-uhd_2560_1440_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920",
    eyebrow: "Limited Drop",
    title: "The Vessel Series\nIn Travertine",
    subtitle: "Twelve sculptural vases. Hand-carved. Numbered.",
    cta: { to: "/shop", label: "View Series" },
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
    <section className="relative h-[88vh] min-h-[620px] w-full overflow-hidden bg-foreground">
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <video
            key={s.video}
            src={s.video}
            poster={s.poster}
            autoPlay muted loop playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full container-x flex flex-col justify-end pb-20 md:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-background"
          >
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>{s.eyebrow}</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mt-6 leading-[1] whitespace-pre-line">{s.title}</h1>
            <p className="mt-6 text-base md:text-lg max-w-md opacity-85">{s.subtitle}</p>
            <Link to={s.cta.to} className="mt-10 inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors">
              {s.cta.label} →
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-8 right-6 md:right-12 flex gap-2 items-center">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
              className={`h-[2px] transition-all ${idx === i ? "w-12 bg-background" : "w-6 bg-background/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MessageSquareText, Wand2, Rocket } from "lucide-react";
import Reveal, { RevealGroup, revealChild } from "../../ui/Reveal";
import { motion } from "framer-motion";
import "./HowItWorks.css";

const STEPS = [
  {
    no: "01",
    title: "Describe",
    icon: MessageSquareText,
    text: "Tell AI what you want in plain language — your business, your tone, the pages you need. One or two sentences is enough to start.",
  },
  {
    no: "02",
    title: "Generate",
    icon: Wand2,
    text: "AI creates your website: layout, sections, real copy, images and a coherent style system, all wired together and responsive by default.",
  },
  {
    no: "03",
    title: "Customize & Publish",
    icon: Rocket,
    text: "Edit anything visually, preview across devices, then launch on a free subdomain or your own custom domain in one click.",
  },
];

export default function HowItWorks() {
  const rootRef = useRef(null);

  /* Draw the connecting line as the section scrolls through. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hiw-line-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".hiw-grid",
            start: "top 72%",
            end: "bottom 72%",
            scrub: 0.8,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section hiw" id="how-it-works" ref={rootRef}>
      <div className="glow glow-blue hiw-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">How It Works</span>
          <h2 className="h-section mt-3">
            From a sentence to a site,
            <br />
            in three steps.
          </h2>
          <p className="lead">
            No blank canvas, no template hunting. You describe it once and stay
            in control of everything that comes back.
          </p>
        </Reveal>

        <div className="hiw-grid-wrap">
          <div className="hiw-line" aria-hidden="true">
            <span className="hiw-line-fill" />
          </div>

          <RevealGroup className="hiw-grid" stagger={0.14}>
            {STEPS.map((s) => (
              <motion.article
                key={s.no}
                className="hiw-card card-ai card-hoverable"
                variants={revealChild}
              >
                <div className="hiw-top">
                  <span className="icon-chip">
                    <s.icon size={18} strokeWidth={1.9} />
                  </span>
                  <span className="hiw-no mono">{s.no}</span>
                </div>
                <h3 className="h-card hiw-title">{s.title}</h3>
                <p className="hiw-text">{s.text}</p>
              </motion.article>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

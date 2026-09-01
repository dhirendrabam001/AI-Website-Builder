import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  MessageSquareText,
  Wand2,
  Rocket,
  CheckCircle2,
  Route,
} from "lucide-react";
import Reveal, { RevealGroup, revealChild } from "../../ui/Reveal";
import { motion } from "framer-motion";
import heroBg from "../../../assets/Images/hero-bg.webp";
import "./HowItWorks.css";

const STEPS = [
  {
    no: "01",
    key: "describe",
    title: "Describe",
    icon: MessageSquareText,
    text: "Tell AI what you want in plain language — your business, your tone, the pages you need.",
  },
  {
    no: "02",
    key: "generate",
    title: "Generate",
    icon: Wand2,
    text: "AI creates your layout, sections, real copy and a coherent style system — wired up and responsive.",
  },
  {
    no: "03",
    key: "publish",
    title: "Customize & Publish",
    icon: Rocket,
    text: "Edit anything visually, preview across devices, then launch on your own domain in one click.",
  },
];

export default function HowItWorks() {
  const rootRef = useRef(null);

  /* Draw the connecting path as the section scrolls through. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hiw-wave-fill",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".hiw-stage",
            start: "top 78%",
            end: "bottom 65%",
            scrub: 0.8,
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section hiw" id="how-it-works" ref={rootRef}>
      <div className="hiw-head-bg" aria-hidden="true">
        <div
          className="hiw-head-bg-img"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="hiw-head-bg-veil" />
      </div>
      <div className="glow glow-blue hiw-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="badge-pill">
            <Route size={14} strokeWidth={2.2} />
            How It Works
          </span>
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

        <div className="hiw-stage">
          <svg
            className="hiw-wave"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="hiwWaveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4d7cff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <path
              className="hiw-wave-track"
              d="M 60 150 C 260 40 380 230 600 90 C 820 -40 940 230 1140 70"
              fill="none"
            />
            <path
              className="hiw-wave-fill"
              d="M 60 150 C 260 40 380 230 600 90 C 820 -40 940 230 1140 70"
              fill="none"
              stroke="url(#hiwWaveGrad)"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
            />
            {/* Continuously flowing dashes — a separate path so the CSS
                loop never fights GSAP's scroll-driven draw-in above,
                which animates the very same stroke-dashoffset property. */}
            <path
              className="hiw-wave-flow"
              d="M 60 150 C 260 40 380 230 600 90 C 820 -40 940 230 1140 70"
              fill="none"
              stroke="url(#hiwWaveGrad)"
              pathLength="1"
            />
          </svg>

          <RevealGroup className="hiw-track" stagger={0.14}>
            {STEPS.map((s) => (
              // The stagger offset lives on this plain wrapper, not the
              // motion element below — framer-motion writes its own
              // `transform` on the article as it animates in, which would
              // otherwise overwrite a CSS translateY on the same node.
              <div key={s.no} className={`hiw-slot hiw-slot-${s.key}`}>
                <motion.article
                  className={`hiw-card card-ai card-hoverable hiw-card-${s.key}`}
                  variants={revealChild}
                >
                  <div className="hiw-top">
                    <span className={`hiw-icon-hex hiw-icon-${s.key}`}>
                      <span className="hiw-icon-hex-inner">
                        <s.icon size={22} strokeWidth={1.9} />
                      </span>
                    </span>
                    <span className="hiw-no mono">{s.no}</span>
                  </div>
                  <h3 className="h-card hiw-title">{s.title}</h3>
                  <p className="hiw-text">{s.text}</p>

                  {s.key === "describe" && (
                    <div className="hiw-mini hiw-mini-chat">
                      <span className="hiw-mini-dot" />
                      <p className="mono">
                        “Landing page for my design studio…”
                      </p>
                    </div>
                  )}

                  {s.key === "generate" && (
                    <div className="hiw-mini hiw-mini-progress">
                      <div className="hiw-progress-track">
                        <span className="hiw-progress-fill" />
                      </div>
                      <span className="hiw-mini-label">Building sections…</span>
                    </div>
                  )}

                  {s.key === "publish" && (
                    <div className="hiw-mini hiw-mini-live">
                      <CheckCircle2 size={14} strokeWidth={2.2} />
                      <span className="mono">yoursite.app</span>
                    </div>
                  )}
                </motion.article>
              </div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

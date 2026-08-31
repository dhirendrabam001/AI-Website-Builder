import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Wand2,
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import useTypewriter from "../../../hooks/useTypewriter";
import "./Hero.css";

const PROMPT =
  "Build a landing page for my design studio with a hero, services and pricing";

const BUILD_STEPS = [
  { label: "Hero section", icon: LayoutTemplate },
  { label: "Services grid", icon: Wand2 },
  { label: "Copywriting", icon: Type },
  { label: "Imagery", icon: ImageIcon },
];

export default function Hero() {
  const rootRef = useRef(null);
  const dashRef = useRef(null);
  const [typed, typingDone, typeRef] = useTypewriter(PROMPT, {
    speed: 28,
    startDelay: 1000,
  });

  /* Entrance + parallax on the GSAP timeline Lenis drives. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-rise", {
        y: 30,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.15,
      });

      gsap.from(dashRef.current, {
        y: 70,
        opacity: 0,
        scale: 0.965,
        duration: 1.25,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.to(dashRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.utils.toArray(".hero-float").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -13 : 12,
          duration: 3.4 + i * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="grid-bg" />
      <div className="glow glow-blue hero-glow-1" />
      <div className="glow glow-violet hero-glow-2" />

      <div className="shell hero-inner">
        <div className="hero-copy">
          <div className="hero-rise">
            <span className="badge-pill">
              <Sparkles size={14} strokeWidth={2.2} />
              AI-Powered Website Creation
            </span>
          </div>

          <h1 className="display hero-rise hero-title">
            Build Your Website With AI.
            <br />
            <span className="grad-text">In Minutes.</span>
          </h1>

          <p className="lead hero-rise hero-sub">
            Describe the site you have in mind — a portfolio, a storefront, a
            launch page — and AI writes the copy, designs the sections and ships
            a production-ready, fully responsive website. No templates to
            wrestle with, no code to write.
          </p>

          <div className="hero-actions hero-rise">
            <a href="#cta" className="btn-ai btn-primary-ai">
              Start Building Free
              <ArrowRight size={17} strokeWidth={2.2} />
            </a>
            <a href="#how-it-works" className="btn-ai btn-ghost-ai">
              <PlayCircle size={17} strokeWidth={2} />
              See How It Works
            </a>
          </div>

          <p className="hero-note hero-rise">
            Free forever plan · No credit card required
          </p>
        </div>

        {/* ---------- dashboard preview ---------- */}
        <div className="hero-dash-wrap" ref={dashRef}>
          <div className="hero-dash card-ai" ref={typeRef}>
            <div className="dash-bar">
              <span className="dot dot-r" />
              <span className="dot dot-y" />
              <span className="dot dot-g" />
              <div className="dash-url mono">aibuilder.app/studio</div>
            </div>

            <div className="dash-body">
              {/* prompt side */}
              <div className="dash-prompt">
                <div className="eyebrow">AI Prompt</div>

                <div className="prompt-box">
                  <Sparkles size={13} className="prompt-icon" />
                  <p className="prompt-text mono">
                    {typed}
                    {!typingDone && <span className="caret" />}
                  </p>
                </div>

                <button className="btn-ai btn-primary-ai btn-sm-ai prompt-btn">
                  <Wand2 size={14} strokeWidth={2.1} />
                  Generate Website
                </button>

                <div className="eyebrow prompt-gen-label">Generating</div>
                <ul className="build-list">
                  {BUILD_STEPS.map((s, i) => (
                    <motion.li
                      key={s.label}
                      className="build-item"
                      initial={{ opacity: 0, x: -8 }}
                      animate={typingDone ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.25 + i * 0.28, duration: 0.4 }}
                    >
                      <span className="build-check">
                        <Check size={10} strokeWidth={3.2} />
                      </span>
                      <s.icon size={13} className="build-ico" />
                      {s.label}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* preview side */}
              <div className="dash-preview">
                <div className="prev-nav">
                  <span className="prev-logo" />
                  <span className="sk prev-navline" />
                  <span className="sk prev-navline" />
                  <span className="sk prev-navline short" />
                  <span className="sk sk-grad prev-navcta" />
                </div>

                <motion.div
                  className="prev-hero"
                  initial={{ opacity: 0, y: 12 }}
                  animate={typingDone ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45, duration: 0.55 }}
                >
                  <span className="sk prev-h1" />
                  <span className="sk prev-h1 w60" />
                  <span className="sk prev-p" />
                  <span className="sk prev-p w40" />
                  <span className="sk sk-grad prev-btn" />
                </motion.div>

                <div className="prev-grid">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="prev-card"
                      initial={{ opacity: 0, y: 14 }}
                      animate={typingDone ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.95 + i * 0.16, duration: 0.5 }}
                    >
                      <span className="prev-thumb" />
                      <span className="sk prev-line" />
                      <span className="sk prev-line short" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* floating chips */}
          <div className="hero-float float-1 card-ai">
            <span className="icon-chip sm">
              <Wand2 size={14} />
            </span>
            <div>
              <div className="float-title">Section generated</div>
              <div className="float-sub">Pricing · 0.8s</div>
            </div>
          </div>

          <div className="hero-float float-2 card-ai">
            <div className="float-title">Responsive</div>
            <div className="float-bars">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="hero-float float-3 card-ai">
            <span className="live-dot" />
            <div className="float-title">Published live</div>
          </div>
        </div>
      </div>
    </section>
  );
}

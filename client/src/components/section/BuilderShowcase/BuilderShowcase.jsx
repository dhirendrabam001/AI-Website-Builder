import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Pencil, Eye, Rocket, Sparkles, User } from "lucide-react";
import Reveal from "../../ui/Reveal";
import useTypewriter from "../../../hooks/useTypewriter";
import "./BuilderShowcase.css";

const USER_PROMPT = "Add a pricing section with three plans and a FAQ below it.";

const SECTIONS = [
  { name: "Hero", tone: "a" },
  { name: "Features", tone: "b" },
  { name: "Pricing", tone: "c" },
  { name: "FAQ", tone: "a" },
];

const ACTIONS = [
  { label: "Generate", icon: Wand2, primary: true },
  { label: "Edit", icon: Pencil },
  { label: "Preview", icon: Eye },
  { label: "Publish", icon: Rocket },
];

export default function BuilderShowcase() {
  const [typed, done, typeRef] = useTypewriter(USER_PROMPT, {
    speed: 26,
    startDelay: 500,
  });
  const [built, setBuilt] = useState(0);

  /* Once the prompt finishes typing, lay the sections in one at a time. */
  useEffect(() => {
    if (!done) return;
    const timers = SECTIONS.map((_, i) =>
      setTimeout(() => setBuilt(i + 1), 420 + i * 620)
    );
    return () => timers.forEach(clearTimeout);
  }, [done]);

  return (
    <section className="section showcase" id="showcase">
      <div className="glow glow-violet showcase-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">The Builder</span>
          <h2 className="h-section mt-3">
            Talk to it. Watch it <span className="grad-text">build</span>.
          </h2>
          <p className="lead">
            The AI keeps the full context of your site, so every follow-up
            request lands in the right place — matching the styling you already
            have.
          </p>
        </Reveal>

        <Reveal className="showcase-frame card-ai" y={30} amount={0.15}>
          <div className="dash-bar">
            <span className="dot dot-r" />
            <span className="dot dot-y" />
            <span className="dot dot-g" />
            <div className="dash-url mono">aibuilder.app/editor</div>
          </div>

          <div className="showcase-body" ref={typeRef}>
            {/* ---- left: chat ---- */}
            <div className="sc-chat">
              <div className="sc-chat-head">
                <span className="icon-chip sm">
                  <Sparkles size={13} />
                </span>
                <div>
                  <div className="sc-chat-title">AI Assistant</div>
                  <div className="sc-chat-status">
                    <span className="live-dot" /> Online
                  </div>
                </div>
              </div>

              <div className="sc-msgs">
                <div className="sc-msg sc-msg-ai">
                  <span className="sc-avatar sc-avatar-ai">
                    <Sparkles size={11} />
                  </span>
                  <p>
                    Your site is live in the preview. What should we add next?
                  </p>
                </div>

                <div className="sc-msg sc-msg-user">
                  <span className="sc-avatar sc-avatar-user">
                    <User size={11} />
                  </span>
                  <p className="mono sc-user-text">
                    {typed}
                    {!done && <span className="caret" />}
                  </p>
                </div>

                <AnimatePresence>
                  {done && (
                    <motion.div
                      className="sc-msg sc-msg-ai"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.25 }}
                    >
                      <span className="sc-avatar sc-avatar-ai">
                        <Sparkles size={11} />
                      </span>
                      <p>
                        Done — added Pricing with 3 plans and an FAQ accordion,
                        styled to match your theme.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="sc-actions">
                {ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    className={`sc-action ${a.primary ? "sc-action-primary" : ""}`}
                  >
                    <a.icon size={13} strokeWidth={2} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ---- right: live preview ---- */}
            <div className="sc-preview">
              <div className="sc-preview-label">
                <span className="eyebrow">Live Preview</span>
                <span className="sc-count mono">
                  {built}/{SECTIONS.length} sections
                </span>
              </div>

              <div className="sc-canvas">
                {SECTIONS.map((s, i) => (
                  <motion.div
                    key={s.name}
                    className={`sc-block sc-tone-${s.tone}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={built > i ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                  >
                    <span className="sc-block-tag mono">{s.name}</span>
                    <div className="sc-block-lines">
                      <span className="sk" />
                      <span className="sk" />
                      <span className="sk" />
                    </div>
                  </motion.div>
                ))}

                {built < SECTIONS.length && (
                  <div className="sc-building">
                    <span className="sc-spinner" />
                    Generating {SECTIONS[built]?.name.toLowerCase()}…
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

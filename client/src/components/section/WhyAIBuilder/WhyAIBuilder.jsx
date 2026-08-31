import { motion } from "framer-motion";
import { Zap, Code2, ShieldCheck, MonitorSmartphone, SlidersHorizontal, Check } from "lucide-react";
import Reveal, { RevealGroup, revealChild } from "../../ui/Reveal";
import "./WhyAIBuilder.css";

const REASONS = [
  {
    icon: Zap,
    title: "Faster than traditional development",
    text: "What normally takes a designer and a developer two weeks lands in the editor in under a minute.",
  },
  {
    icon: Code2,
    title: "No coding required",
    text: "Describe changes in plain language. The markup, styles and breakpoints are written for you.",
  },
  {
    icon: ShieldCheck,
    title: "Production-ready designs",
    text: "Real design-system output — consistent spacing, type scale and contrast, not a rough draft.",
  },
  {
    icon: MonitorSmartphone,
    title: "Fully responsive",
    text: "Desktop, tablet and mobile layouts are generated together and stay in sync as you edit.",
  },
  {
    icon: SlidersHorizontal,
    title: "Easy customization",
    text: "Change one token — a colour, a radius, a font — and the whole site follows immediately.",
  },
];

const COMPARE = [
  { label: "Time to first draft", old: "3–5 days", ai: "under a minute" },
  { label: "Responsive pass", old: "manual, per breakpoint", ai: "automatic" },
  { label: "Copywriting", old: "outsourced", ai: "generated on brand" },
  { label: "Deployment", old: "CI setup + DNS", ai: "one click" },
];

export default function WhyAIBuilder() {
  return (
    <section className="section why">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">Why AI Builder</span>
          <h2 className="h-section mt-3">
            The shortest path between
            <br />
            <span className="grad-text">an idea and a URL</span>.
          </h2>
        </Reveal>

        <div className="why-layout">
          <RevealGroup className="why-list" stagger={0.08}>
            {REASONS.map((r) => (
              <motion.div
                key={r.title}
                className="why-item card-ai card-hoverable"
                variants={revealChild}
              >
                <span className="icon-chip">
                  <r.icon size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="h-card">{r.title}</h3>
                  <p className="why-text">{r.text}</p>
                </div>
              </motion.div>
            ))}
          </RevealGroup>

          <Reveal className="why-compare card-ai" delay={0.1} y={28}>
            <div className="why-compare-head">
              <span className="eyebrow">The difference</span>
              <h3 className="h-card mt-2">Traditional build vs. AI Builder</h3>
            </div>

            <ul className="why-compare-list">
              {COMPARE.map((c) => (
                <li key={c.label}>
                  <span className="cmp-label">{c.label}</span>
                  <span className="cmp-old">{c.old}</span>
                  <span className="cmp-ai">
                    <Check size={12} strokeWidth={3} />
                    {c.ai}
                  </span>
                </li>
              ))}
            </ul>

            <div className="why-compare-foot">
              <div className="why-metric grad-text">92%</div>
              <p className="why-metric-note">
                less time from first prompt to a published, responsive site.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

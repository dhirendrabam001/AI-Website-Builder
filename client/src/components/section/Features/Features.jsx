import { motion } from "framer-motion";
import {
  Sparkles,
  PenLine,
  Smartphone,
  MousePointer2,
  Blocks,
  Rocket,
  Globe,
  Search,
} from "lucide-react";
import Reveal, { RevealGroup, revealChild } from "../../ui/Reveal";
import "./Features.css";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Website Generation",
    text: "A full multi-section site — structure, layout and styling — generated from a single description.",
  },
  {
    icon: PenLine,
    title: "AI Content Generation",
    text: "Headlines, body copy and calls to action written in your brand's voice, not lorem ipsum.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    text: "Every section adapts to desktop, tablet and mobile automatically. Nothing to redo per breakpoint.",
  },
  {
    icon: MousePointer2,
    title: "Drag & Drop Editor",
    text: "Reorder sections, swap images and rewrite text directly on the canvas — no panels to hunt through.",
  },
  {
    icon: Blocks,
    title: "Smart Components",
    text: "Pricing tables, FAQs, testimonials and forms that arrive pre-wired and already on-theme.",
  },
  {
    icon: Rocket,
    title: "One-Click Publishing",
    text: "Ship to a global edge network in seconds. Every publish is versioned and instantly reversible.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    text: "Connect your own domain with automatic SSL, or start free on a clean aibuilder.app subdomain.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    text: "Meta tags, semantic markup, sitemaps and fast Core Web Vitals handled for you on every page.",
  },
];

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="glow glow-blue features-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">Features</span>
          <h2 className="h-section mt-3">
            Everything you'd expect,
            <br />
            <span className="grad-text">and the parts you'd dread</span>.
          </h2>
          <p className="lead">
            The pieces that usually eat a week — responsive passes, SEO, copy,
            deployment — are already handled before you open the editor.
          </p>
        </Reveal>

        <RevealGroup className="features-grid" stagger={0.06}>
          {FEATURES.map((f) => (
            <motion.article
              key={f.title}
              className="feature-card card-ai card-hoverable"
              variants={revealChild}
            >
              <span className="icon-chip">
                <f.icon size={18} strokeWidth={1.9} />
              </span>
              <h3 className="h-card feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </motion.article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

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
import GatewayFlow from "../../ui/GatewayFlow";
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
    <section className="section features position-relative" id="features">
      <GatewayFlow density={1} speed={1} strokeWidth={1} />
      <div className="glow glow-blue features-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="badge-pill">
            <Blocks size={14} strokeWidth={2.2} />
            Features
          </span>
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
          {FEATURES.map((f, i) => (
            // The idle float/tilt lives on this plain wrapper, not the
            // motion element inside — framer-motion writes its own
            // `transform` as the card reveals, which would silently wipe
            // out a CSS animation living on the same property/element.
            <div key={f.title} className="feature-slot">
              {/* Three layers, one transform each — they'd overwrite each
                  other on a single node: the slot runs the idle float
                  (CSS animation), this inner div handles the hover
                  spread/lift, and framer-motion owns the card's own
                  transform for the reveal. */}
              <div className="feature-slot-inner">
                <motion.article
                  className="feature-card card-ai"
                  variants={revealChild}
                >
                  <span className={`feature-icon-tile feature-tile-${i % 4}`}>
                    <f.icon size={19} strokeWidth={1.9} />
                  </span>
                  <h3 className="h-card feature-title">{f.title}</h3>
                  <p className="feature-text">{f.text}</p>
                </motion.article>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

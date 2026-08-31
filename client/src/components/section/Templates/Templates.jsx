import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, ArrowRight } from "lucide-react";
import Reveal, { RevealGroup, revealChild } from "../../ui/Reveal";
import "./Templates.css";

const TEMPLATES = [
  {
    name: "Nimbus",
    category: "SaaS",
    tone: "blue",
    blurb: "Product tour, pricing and changelog",
  },
  {
    name: "Atelier",
    category: "Portfolio",
    tone: "violet",
    blurb: "Case-study grid with large imagery",
  },
  {
    name: "Northwind",
    category: "Agency",
    tone: "mixed",
    blurb: "Services, process and team",
  },
  {
    name: "Marketplace",
    category: "E-commerce",
    tone: "blue",
    blurb: "Catalog, cart and checkout flow",
  },
  {
    name: "Launchpad",
    category: "Startup",
    tone: "violet",
    blurb: "Waitlist page with social proof",
  },
];

const FILTERS = ["All", "SaaS", "Portfolio", "Agency", "E-commerce", "Startup"];

export default function Templates() {
  const [active, setActive] = useState("All");

  const shown =
    active === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === active);

  return (
    <section className="section templates" id="templates">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">Templates</span>
          <h2 className="h-section mt-3">
            Start from scratch, or from a{" "}
            <span className="grad-text">head start</span>.
          </h2>
          <p className="lead">
            Every template is a real generated site, not a static mockup. Pick
            one and keep prompting until it's yours.
          </p>
        </Reveal>

        <Reveal className="tpl-filters" delay={0.05}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`tpl-filter ${active === f ? "tpl-filter-on" : ""}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </Reveal>

        <RevealGroup className="tpl-grid" stagger={0.07} key={active}>
          {shown.map((t) => (
            <motion.article
              key={t.name}
              className="tpl-card card-ai"
              variants={revealChild}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className={`tpl-thumb tpl-${t.tone}`}>
                {/* miniature page mock */}
                <div className="tpl-mock">
                  <span className="tpl-mock-nav">
                    <i className="tpl-mock-logo" />
                    <i className="sk" />
                    <i className="sk" />
                  </span>
                  <span className="sk tpl-mock-h" />
                  <span className="sk tpl-mock-h short" />
                  <span className="sk sk-grad tpl-mock-btn" />
                  <span className="tpl-mock-row">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>

                <div className="tpl-overlay">
                  <button className="btn-ai btn-ghost-ai btn-sm-ai">
                    <Eye size={14} />
                    Preview
                  </button>
                  <button className="btn-ai btn-primary-ai btn-sm-ai">
                    Use Template
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="tpl-meta">
                <div>
                  <h3 className="h-card">{t.name}</h3>
                  <p className="tpl-blurb">{t.blurb}</p>
                </div>
                <span className="tpl-tag">{t.category}</span>
              </div>
            </motion.article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

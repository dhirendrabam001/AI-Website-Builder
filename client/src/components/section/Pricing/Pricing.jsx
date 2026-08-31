import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Reveal, { RevealGroup, revealChild } from "../../ui/Reveal";
import "./Pricing.css";

const PLANS = [
  {
    name: "Free",
    tagline: "For your first site",
    monthly: 0,
    yearly: 0,
    cta: "Start Building Free",
    features: [
      "1 AI-generated website",
      "20 AI generations / month",
      "aibuilder.app subdomain",
      "Responsive on every device",
      "Community support",
    ],
  },
  {
    name: "Pro",
    tagline: "For freelancers and makers",
    monthly: 19,
    yearly: 15,
    cta: "Start Pro Trial",
    featured: true,
    features: [
      "10 websites",
      "Unlimited AI generations",
      "Custom domains with SSL",
      "Drag & drop editor",
      "SEO optimization suite",
      "Remove AI Builder badge",
      "Priority email support",
    ],
  },
  {
    name: "Business",
    tagline: "For teams shipping often",
    monthly: 49,
    yearly: 39,
    cta: "Contact Sales",
    features: [
      "Unlimited websites",
      "5 team seats included",
      "Brand kit & design tokens",
      "Version history & rollback",
      "Analytics integrations",
      "Dedicated success manager",
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section className="section pricing" id="pricing">
      <div className="glow glow-violet pricing-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">Pricing</span>
          <h2 className="h-section mt-3">
            Simple plans,
            <span className="grad-text"> no surprises</span>.
          </h2>
          <p className="lead">
            Start free and stay free for as long as you like. Upgrade when you
            need a custom domain or more room to build.
          </p>
        </Reveal>

        <Reveal className="price-toggle-wrap" delay={0.05}>
          <div className="price-toggle" role="group" aria-label="Billing period">
            <button
              className={!yearly ? "on" : ""}
              onClick={() => setYearly(false)}
              aria-pressed={!yearly}
            >
              Monthly
            </button>
            <button
              className={yearly ? "on" : ""}
              onClick={() => setYearly(true)}
              aria-pressed={yearly}
            >
              Yearly
              <span className="price-save">−20%</span>
            </button>
          </div>
        </Reveal>

        <RevealGroup className="price-grid" stagger={0.1}>
          {PLANS.map((p) => (
            <motion.article
              key={p.name}
              className={`price-card card-ai ${p.featured ? "price-featured" : "card-hoverable"}`}
              variants={revealChild}
            >
              {p.featured && (
                <span className="price-ribbon">
                  <Sparkles size={12} strokeWidth={2.2} />
                  Recommended
                </span>
              )}

              <div className="price-head">
                <h3 className="price-name">{p.name}</h3>
                <p className="price-tagline">{p.tagline}</p>
              </div>

              <div className="price-amount">
                <span className="price-currency">$</span>
                <span className="price-value">
                  {yearly ? p.yearly : p.monthly}
                </span>
                <span className="price-period">/ month</span>
              </div>
              <p className="price-billing">
                {p.monthly === 0
                  ? "Free forever"
                  : yearly
                    ? "billed annually"
                    : "billed monthly"}
              </p>

              <a
                href="#cta"
                className={`btn-ai price-cta ${
                  p.featured ? "btn-primary-ai" : "btn-ghost-ai"
                }`}
              >
                {p.cta}
              </a>

              <ul className="price-features">
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="price-check">
                      <Check size={11} strokeWidth={3.2} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

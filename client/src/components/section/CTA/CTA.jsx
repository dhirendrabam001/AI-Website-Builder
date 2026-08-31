import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "../../ui/Reveal";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="section cta" id="cta">
      <div className="shell">
        <Reveal className="cta-panel" y={30} amount={0.2}>
          <div className="grid-bg cta-grid" />
          <div className="glow glow-blue cta-glow-1" />
          <div className="glow glow-violet cta-glow-2" />

          <div className="cta-content">
            <span className="badge-pill">
              <Sparkles size={14} strokeWidth={2.2} />
              Free to start
            </span>

            <h2 className="display cta-title">
              Your Next Website Starts
              <br />
              With <span className="grad-text">One Prompt</span>.
            </h2>

            <p className="lead cta-sub">
              Describe it once. Publish it today. No credit card, no setup, no
              waiting on anyone else.
            </p>

            <div className="cta-actions">
              <a href="#top" className="btn-ai btn-primary-ai cta-btn">
                Start Building Free
                <ArrowRight size={17} strokeWidth={2.2} />
              </a>
              <a href="#pricing" className="btn-ai btn-ghost-ai cta-btn">
                Compare Plans
              </a>
            </div>

            <p className="cta-note">
              Join 10,000+ people who shipped their site this month
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

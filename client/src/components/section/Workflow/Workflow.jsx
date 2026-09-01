import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Sparkles,
  PenLine,
  LayoutTemplate,
  Image as ImageIcon,
  Search,
  Globe,
  Server,
  ArrowRight,
} from "lucide-react";
import Reveal from "../../ui/Reveal";
import "./Workflow.css";

/* Six systems orbiting the engine. `angle` is in degrees (-90 = top) and
   `radius` is a percentage of the square map, so both nodes and rings
   scale together and the layout holds at any panel size. */
const NODES = [
  { label: "Copywriting", icon: PenLine, angle: -90, radius: 40 },
  { label: "Layout", icon: LayoutTemplate, angle: -30, radius: 30 },
  { label: "Imagery", icon: ImageIcon, angle: 30, radius: 40 },
  { label: "SEO", icon: Search, angle: 90, radius: 30 },
  { label: "Hosting", icon: Server, angle: 150, radius: 40 },
  { label: "Domains", icon: Globe, angle: 210, radius: 30 },
];

export default function Workflow() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Opacity only — the nodes carry a static centring transform and an
      // infinite float on the layer inside them, so animating transform
      // from here would fight both.
      gsap.from(".wf-node", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".wf-map", start: "top 80%", once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section workflow" ref={rootRef}>
      <div className="glow glow-violet wf-glow" />

      <div className="shell wf-split">
        {/* ---------- copy ---------- */}
        <Reveal className="wf-copy">
          <span className="badge-pill">
            <Sparkles size={14} strokeWidth={2.2} />
            The Workflow
          </span>

          <h2 className="h-section wf-title">
            Every piece of your site,
            <br />
            <span className="grad-text">wired into one engine</span>.
          </h2>

          <p className="lead wf-lead">
            Copy, layout, imagery, SEO, hosting and domains don't live in six
            different tools here. One prompt drives all of them, and every
            change routes back through the same engine.
          </p>

          <div className="wf-actions">
            <a href="#cta" className="btn-ai btn-primary-ai">
              Start Building Free
              <ArrowRight size={17} strokeWidth={2.2} />
            </a>
          </div>
        </Reveal>

        {/* ---------- orbital map ---------- */}
        <Reveal className="wf-map-panel" delay={0.1} y={28}>
          <div className="wf-map">
            <span className="wf-ring wf-ring-1" aria-hidden="true" />
            <span className="wf-ring wf-ring-2" aria-hidden="true" />
            <span className="wf-ring wf-ring-3" aria-hidden="true" />

            <div className="wf-hub">
              <span className="wf-hub-core">
                <Sparkles size={26} strokeWidth={1.8} />
              </span>
              <span className="wf-hub-label mono">AI ENGINE</span>
            </div>

            {NODES.map((n) => {
              const rad = (n.angle * Math.PI) / 180;
              return (
                <div
                  className="wf-node"
                  key={n.label}
                  style={{
                    left: `${50 + Math.cos(rad) * n.radius}%`,
                    top: `${50 + Math.sin(rad) * n.radius}%`,
                  }}
                >
                  <div className="wf-node-body">
                    <span className="wf-node-chip">
                      <n.icon size={16} strokeWidth={1.9} />
                    </span>
                    <span className="wf-node-label">{n.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Lightbulb, Sparkles, Layout, Globe } from "lucide-react";
import Reveal from "../../ui/Reveal";
import "./Workflow.css";

const NODES = [
  { label: "Idea", icon: Lightbulb, note: "One sentence" },
  { label: "AI", icon: Sparkles, note: "Structure + copy" },
  { label: "Website", icon: Layout, note: "Responsive build" },
  { label: "Publish", icon: Globe, note: "Live in seconds" },
];

export default function Workflow() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".wf-track",
          start: "top 76%",
          once: true,
        },
      });

      tl.from(".wf-node", {
        y: 26,
        opacity: 0,
        scale: 0.92,
        duration: 0.6,
        ease: "back.out(1.5)",
        stagger: 0.22,
      }).fromTo(
        ".wf-connector-fill",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power2.inOut", stagger: 0.22 },
        0.32
      );

      // pulse travelling along the connectors, forever but gently
      gsap.to(".wf-pulse", {
        xPercent: 900,
        duration: 2.6,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 1.1,
        stagger: 0.2,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section workflow" ref={rootRef}>
      <div className="glow glow-violet wf-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">The Workflow</span>
          <h2 className="h-section mt-3">
            Idea to live site,
            <br />
            <span className="grad-text">one continuous flow</span>.
          </h2>
        </Reveal>

        <div className="wf-track">
          {NODES.map((n, i) => (
            <div className="wf-step" key={n.label}>
              <div className="wf-node">
                <div className="wf-node-inner">
                  <span className="wf-icon">
                    <n.icon size={22} strokeWidth={1.8} />
                  </span>
                </div>
                <div className="wf-label">{n.label}</div>
                <div className="wf-note">{n.note}</div>
              </div>

              {i < NODES.length - 1 && (
                <div className="wf-connector" aria-hidden="true">
                  <span className="wf-connector-fill">
                    <span className="wf-pulse" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";
import "./Stats.css";

const STATS = [
  { value: 10, suffix: "K+", label: "Websites Created" },
  { value: 50, suffix: "K+", label: "Sections Generated" },
  { value: 99, suffix: "%", label: "Responsive" },
];

export default function Stats() {
  const rootRef = useRef(null);

  /* Count up once, when the row scrolls into view. */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stat-num").forEach((el) => {
        const target = Number(el.dataset.value);
        if (reduce) {
          el.textContent = target;
          return;
        }
        const counter = { n: 0 };
        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(counter.n);
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section stats-section" ref={rootRef}>
      <div className="shell">
        <div className="stats-row card-ai">
          <div className="stat stat-brand">
            <span className="icon-chip sm">
              <Sparkles size={14} strokeWidth={2.2} />
            </span>
            <span className="stat-brand-text">Built with AI</span>
          </div>

          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-value">
                <span className="stat-num grad-text" data-value={s.value}>
                  0
                </span>
                <span className="grad-text">{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

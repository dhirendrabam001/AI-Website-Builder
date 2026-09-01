import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { Rocket, Globe, Files, Zap } from "lucide-react";
import "./Stats.css";

const STATS = [
  {
    key: "sites",
    icon: Globe,
    value: 10,
    suffix: "K+",
    label: "Websites Created",
  },
  {
    key: "sections",
    icon: Files,
    value: 50,
    suffix: "K+",
    label: "Sections Generated",
  },
  {
    key: "responsive",
    icon: Zap,
    value: 99,
    suffix: "%",
    label: "Responsive",
  },
];

export default function Stats() {
  const rootRef = useRef(null);

  /* Count up once, when the row scrolls into view. */
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
          <span className="stats-corner stats-corner-l" aria-hidden="true" />
          <span className="stats-corner stats-corner-r" aria-hidden="true" />

          {/* brand block — left aligned, sets up the numbers that follow */}
          <div className="stat stat-brand">
            <span className="stat-icon-tile">
              <Rocket size={20} strokeWidth={1.9} />
            </span>
            <div className="stat-value">
              <span className="stat-num" data-value={5}>
                0
              </span>
              <span> Min</span>
            </div>
            <div className="stat-label">Average Build Time</div>
          </div>

          {STATS.map((s) => (
            <Fragment key={s.key}>
              {/* Separator is a real flex item, so `space-between` lands
                  it dead-centre between its two neighbours on its own. */}
              <span className="stat-sep" aria-hidden="true" />
              <div className={`stat stat-${s.key}`}>
                <span className="stat-icon-tile">
                  <s.icon size={20} strokeWidth={1.9} />
                </span>
                <div className="stat-value">
                  <span className="stat-num" data-value={s.value}>
                    0
                  </span>
                  <span>{s.suffix}</span>
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

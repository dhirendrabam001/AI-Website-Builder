import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";
import heroBg from "../../../assets/Images/hero-bg.webp";
import heroVideo from "../../../assets/Videos/hero-video.mp4";
import "./Hero.css";

export default function Hero() {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    /* A background video shouldn't force motion on people who asked not
       to have it — freeze on the poster frame instead of autoplaying. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
      return;
    }

    const ctx = gsap.context(() => {
      /* ---------- entrance ---------- */
      gsap.from(".hero-rise", {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });

      gsap.from(bgRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 1.6,
        ease: "power3.out",
      });

      /* ---------- scroll parallax ---------- */
      gsap.to(bgRef.current, {
        yPercent: 5,
        scale: 1.025,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef}>
      {/* ---------- animated background ---------- */}
      <div className="hero-bg-wrap">
        <div className="hero-bg" ref={bgRef}>
          <video
            className="hero-bg-video"
            ref={videoRef}
            poster={heroBg}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>
        <div className="hero-bg-veil" />
      </div>

      {/* ---------- copy ---------- */}
      <div className="shell hero-inner">
        <div className="hero-copy">
          <div className="hero-rise">
            <span className="badge-pill">
              <Sparkles size={14} strokeWidth={2.2} />
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="display hero-rise hero-title text-uppercase">
            Build Stunning Websites
            <br />
            <span className="grad-text">10x Faster</span> with AI
          </h1>

          <p className="lead hero-rise hero-sub">
            Turn your ideas into stunning, production-ready websites in minutes.
            Just describe what you want, and our AI handles the design, content,
            layout, and code — so you can build, customize, and launch without
            writing a single line of code.
          </p>

          <div className="hero-actions hero-rise">
            <a href="#cta" className="btn-ai btn-primary-ai hero-cta">
              Start Building for Free
              <ArrowRight size={17} strokeWidth={2.2} />
            </a>
            <a href="#templates" className="btn-ai btn-ghost-ai">
              <Wand2 size={17} strokeWidth={2} />
              View Examples
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

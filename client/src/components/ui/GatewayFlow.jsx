import { useEffect, useRef } from "react";
import "./GatewayFlow.css";

/**
 * Gateway Flow — dashed bezier streams that converge on the centre of the
 * section, each carrying a travelling particle. Clicking anywhere in the
 * host sends a ripple through the field that pushes particles off-course.
 *
 * Ported from the reference implementation, with three deliberate changes:
 *  - no iframe. The original renders itself into a sandboxed `srcDoc`
 *    because it ships as a standalone HTML preview; embedding it here
 *    directly avoids a second document, its own Tailwind/GSAP downloads
 *    and the postMessage control bridge.
 *  - sized to the host element via ResizeObserver rather than to
 *    `window`, so it tracks the section instead of the viewport.
 *  - palette pulled from the site's own blue → violet accent ramp.
 */
export default function GatewayFlow({
  className = "",
  density = 1,
  speed = 1,
  opacity = 1,
  strokeWidth = 1,
  interactive = true,
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let ripples = [];
    // Narrow screens get fewer streams and no per-particle shadowBlur —
    // 80 particles redrawing a blurred glow every frame is real load on a
    // low-power mobile GPU, and the wide fan pattern also just doesn't
    // need that many lines to read on a narrow, tall viewport.
    let compact = false;
    let paths = [];

    const buildPaths = (isCompact) => {
      const count = Math.max(
        8,
        Math.round(80 * density * (isCompact ? 0.55 : 1)),
      );
      return Array.from({ length: count }, (_, i) => ({
        isLeft: i % 2 === 0,
        offset: i / count,
        // blend each stream between the two brand accents
        tint: i / count,
        t: Math.random(),
        speed: 0.0014 + Math.random() * 0.0022,
      }));
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // setTransform rather than scale: scale() compounds across resizes
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextCompact = width <= 640;
      if (nextCompact !== compact || paths.length === 0) {
        compact = nextCompact;
        paths = buildPaths(compact);
      }
    };

    const bezier = (t, p0, p1, p2, p3) => {
      const u = 1 - t;
      return {
        x:
          u ** 3 * p0.x +
          3 * u ** 2 * t * p1.x +
          3 * u * t ** 2 * p2.x +
          t ** 3 * p3.x,
        y:
          u ** 3 * p0.y +
          3 * u ** 2 * t * p1.y +
          3 * u * t ** 2 * p2.y +
          t ** 3 * p3.y,
      };
    };

    // The flow layer itself is pointer-events:none, so the listener has to
    // live on the host's parent (the section) for clicks to ever reach it.
    const clickTarget = host.parentElement ?? host;

    const onClick = (event) => {
      if (reduce) return;
      const rect = host.getBoundingClientRect();
      ripples.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        radius: 0,
        life: 1,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      ripples.forEach((r) => {
        r.radius += 14;
        r.life -= 0.016;
      });
      ripples = ripples.filter((r) => r.life > 0);

      paths.forEach((path) => {
        const startY = path.offset * height * 1.4 - height * 0.2;
        const p0 = { x: path.isLeft ? 0 : width, y: startY };
        const p1 = { x: path.isLeft ? cx * 0.5 : width - cx * 0.5, y: startY };
        const p2 = { x: path.isLeft ? cx * 0.8 : width - cx * 0.8, y: cy };
        const p3 = { x: cx, y: cy };

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        // Near-white with a faint blue-violet cast: reads like the
        // reference against black, but still sits in the site's palette.
        ctx.strokeStyle = `rgba(${Math.round(
          206 + path.tint * 24,
        )}, ${Math.round(216 - path.tint * 12)}, 255, ${0.34 * opacity})`;
        ctx.lineWidth = 1 * strokeWidth;
        ctx.setLineDash([1, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (!reduce) {
          path.t += path.speed * speed;
          if (path.t > 1) path.t = 0;
        }

        const pos = bezier(path.t, p0, p1, p2, p3);

        let dx = 0;
        let dy = 0;
        ripples.forEach((r) => {
          const ox = pos.x - r.x;
          const oy = pos.y - r.y;
          const dist = Math.hypot(ox, oy) || 1;
          if (dist < r.radius + 110 && dist > r.radius - 110) {
            const force = (1 - Math.abs(dist - r.radius) / 110) * r.life;
            dx += (ox / dist) * force * 70;
            dy += (oy / dist) * force * 70;
          }
        });

        const px = pos.x + dx;
        const py = pos.y + dy;

        ctx.fillStyle = `rgba(${Math.round(
          236 + path.tint * 12,
        )}, ${Math.round(240 - path.tint * 6)}, 255, ${0.85 * opacity})`;
        if (!compact) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(150, 160, 255, 0.7)";
        }
        ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        if (!compact) ctx.shadowBlur = 0;
      });

      frame = window.requestAnimationFrame(render);
    };

    resize();
    render();

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    if (interactive) clickTarget.addEventListener("click", onClick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      if (interactive) clickTarget.removeEventListener("click", onClick);
    };
  }, [density, speed, opacity, strokeWidth, interactive]);

  return (
    <div
      ref={hostRef}
      className={`gateway-flow ${className}`.trim()}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="gateway-flow-canvas" />
      <div className="gateway-flow-veil" />
    </div>
  );
}

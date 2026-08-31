import { useEffect, useRef, useState } from "react";

/**
 * Types a string out one character at a time, but only once the element
 * is actually on screen. Returns [text, done, ref].
 */
export default function useTypewriter(full, { speed = 32, startDelay = 400 } = {}) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(full);
      setDone(true);
      return;
    }

    let i = 0;
    let typer;
    const kickoff = setTimeout(() => {
      typer = setInterval(() => {
        i += 1;
        setText(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(typer);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(kickoff);
      clearInterval(typer);
    };
  }, [started, full, speed, startDelay]);

  return [text, done, ref];
}

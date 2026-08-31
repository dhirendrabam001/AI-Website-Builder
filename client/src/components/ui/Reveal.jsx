import { motion } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1];

/**
 * Scroll-triggered reveal. Deliberately understated: ~22px of travel,
 * one easing curve everywhere, never replays.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
  as = "div",
  amount = 0.25,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.72, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/** Staggers direct children that use the `revealChild` variants below. */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
  ...rest
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const revealChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.66, ease: EASE } },
};

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "../../ui/Reveal";
import "./FAQ.css";

const FAQS = [
  {
    q: "Do I need any design or coding experience?",
    a: "None. You describe what you want in ordinary language and the AI handles layout, styling and responsiveness. If you do write code, you can export the project and take it with you.",
  },
  {
    q: "How long does it take to generate a website?",
    a: "A complete multi-section site is typically ready in under a minute. Follow-up edits — adding a pricing table, rewriting a headline — usually land in a few seconds.",
  },
  {
    q: "Can I edit what the AI generates?",
    a: "Yes, everything. Drag sections into a new order, rewrite any text inline, swap images, or just ask the AI to change it for you. Nothing is locked.",
  },
  {
    q: "Will my site actually be responsive?",
    a: "Desktop, tablet and mobile layouts are generated together rather than bolted on afterwards, so a change on one breakpoint stays consistent across the others.",
  },
  {
    q: "Can I use my own domain?",
    a: "On Pro and Business you can connect any domain you own, with SSL provisioned automatically. Free sites are published on a clean aibuilder.app subdomain.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your sites stay online through the end of the billing period, and you can export your content at any time. Downgrading to Free keeps your first site published.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2 className="h-section mt-3">Questions, answered.</h2>
        </Reveal>

        <div className="faq-list">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal
                key={item.q}
                delay={i * 0.04}
                y={16}
                className={`faq-item card-ai ${isOpen ? "faq-open" : ""}`}
              >
                <button
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">
                    <Plus size={16} strokeWidth={2.2} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-a-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.34,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                    >
                      <p className="faq-a">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Reveal, { RevealGroup, revealChild } from "../../ui/Reveal";
import "./Testimonials.css";

const REVIEWS = [
  {
    quote:
      "I described our consultancy in two sentences and had a site I was happy to send to clients before lunch. The copy needed almost no editing.",
    name: "Priya Raghavan",
    role: "Founder, Northline Consulting",
    initials: "PR",
    tone: "a",
  },
  {
    quote:
      "The responsive output is the part that surprised me. I usually spend a full day fixing mobile. Here there was nothing to fix.",
    name: "Marcus Lee",
    role: "Design Lead, Fold Studio",
    initials: "ML",
    tone: "b",
  },
  {
    quote:
      "We shipped landing pages for four campaigns in a week. Previously that was a whole sprint with a developer in the loop.",
    name: "Sofia Almeida",
    role: "Head of Growth, Kettle",
    initials: "SA",
    tone: "c",
  },
  {
    quote:
      "It understood 'make the pricing feel more premium' and actually did the right thing — spacing, weight, contrast. That sold me.",
    name: "Daniel Okafor",
    role: "Indie Maker",
    initials: "DO",
    tone: "b",
  },
  {
    quote:
      "Custom domain, SSL and SEO tags were handled before I thought to ask. My old stack took an afternoon for that alone.",
    name: "Hana Suzuki",
    role: "Freelance Designer",
    initials: "HS",
    tone: "a",
  },
  {
    quote:
      "Our whole team edits the same site now. No one has to know what a build step is.",
    name: "Tom Beckett",
    role: "Ops Manager, Verge Fitness",
    initials: "TB",
    tone: "c",
  },
];

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="glow glow-blue tm-glow" />

      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">Testimonials</span>
          <h2 className="h-section mt-3">
            Built by people who had
            <br />
            <span className="grad-text">better things to do</span>.
          </h2>
        </Reveal>

        <RevealGroup className="tm-grid" stagger={0.07}>
          {REVIEWS.map((r) => (
            <motion.figure
              key={r.name}
              className="tm-card card-ai card-hoverable"
              variants={revealChild}
            >
              <div className="tm-stars" aria-label="5 out of 5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              <blockquote className="tm-quote">{r.quote}</blockquote>

              <figcaption className="tm-person">
                <span className={`tm-avatar tm-avatar-${r.tone}`}>
                  {r.initials}
                </span>
                <span>
                  <span className="tm-name">{r.name}</span>
                  <span className="tm-role">{r.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

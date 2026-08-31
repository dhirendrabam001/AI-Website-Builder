import { ArrowUpRight, AtSign, MessageCircle, Send, Sparkles } from "lucide-react";
import "./Footer.css";

const GROUPS = [
  { title: "Product", links: ["Features", "Templates", "Pricing", "Changelog"] },
  { title: "Resources", links: ["Help Center", "Community", "Guides", "Status"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Privacy"] },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="hairline" />
      <div className="shell footer-main">
        <div className="footer-brand">
          <a href="#top" className="nav-logo" aria-label="AI Builder home">
            <span className="nav-logo-mark"><Sparkles size={16} strokeWidth={2.2} /></span>
            <span className="nav-logo-text">AI Builder</span>
          </a>
          <p>From your first thought to a live website, without the busywork in between.</p>
          <a className="footer-mail" href="mailto:hello@aibuilder.app">hello@aibuilder.app <ArrowUpRight size={14} /></a>
        </div>

        <div className="footer-groups">
          {GROUPS.map((group) => (
            <div className="footer-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => <a href="#top" key={link}>{link}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} AI Builder, Inc.</span>
        <div className="footer-socials" aria-label="Social links">
          <a href="#top" aria-label="X"><Send size={15} /></a>
          <a href="#top" aria-label="LinkedIn"><AtSign size={16} /></a>
          <a href="#top" aria-label="Instagram"><MessageCircle size={16} /></a>
        </div>
        <span>Built for ideas in motion.</span>
      </div>
    </footer>
  );
}

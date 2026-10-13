import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { USER_API_END_POINT } from "../../apis/apis";
import { setUser } from "../../redux/authSlice";
import logo from "../../assets/Images/logo.png";
import "./Header.css";

const LINKS = [
  { label: "Product", href: "#showcase" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
];

const ACCOUNT_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    desc: "Open the user's main workspace.",
    Icon: LayoutDashboard,
  },
  {
    to: "/projects",
    label: "My Projects",
    desc: "Manage saved websites, apps, and AI projects.",
    Icon: FolderOpen,
  },
  {
    to: "/profile",
    label: "Profile & Settings",
    desc: "Edit account information and preferences.",
    Icon: User,
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // close the account dropdown on outside click / Escape
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${USER_API_END_POINT}/logout`,
        {},
        { withCredentials: true },
      );
      dispatch(setUser(null));
      setMenuOpen(false);
      setOpen(false);
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className={`nav ${scrolled ? "nav-scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
    >
      <div className="shell nav-inner">
        <a href="#top" className="nav-logo" aria-label="AI Builder home">
          <span className="nav-logo-mark">
            <img src={logo} alt="" />
          </span>
          <span className="nav-logo-text">AI Builder</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="account" ref={menuRef}>
              <button
                type="button"
                className="account-btn"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="account-avatar">
                  {user.fullName?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="account-label">My Account</span>
                <ChevronDown
                  size={16}
                  className={`account-chevron ${menuOpen ? "is-open" : ""}`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="account-menu"
                    role="menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {ACCOUNT_ITEMS.map(({ to, label, desc, Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        role="menuitem"
                        className="account-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="account-icon">
                          <Icon size={18} />
                        </span>
                        <span>
                          <strong>{label}</strong>
                          <small>{desc}</small>
                        </span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      role="menuitem"
                      className="account-item account-item-danger"
                      onClick={handleLogout}
                    >
                      <span className="account-icon">
                        <LogOut size={18} />
                      </span>
                      <span>
                        <strong>Logout</strong>
                        <small>Securely sign out and return to the public website.</small>
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-ai btn-primary-ai btn-sm-ai">
              Get Started
            </Link>
          )}
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="shell nav-mobile-inner">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="nav-mobile-link"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              {user ? (
                <>
                  {ACCOUNT_ITEMS.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="nav-mobile-link"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    className="btn-ai btn-primary-ai nav-mobile-cta"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn-ai btn-primary-ai nav-mobile-cta"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

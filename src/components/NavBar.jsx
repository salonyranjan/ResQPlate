import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const NEON = "#39ff14";

const NAV_ITEMS = [
  { name: "Home",      path: "/" },
  { name: "About",     path: "/about" },
  { name: "Contact",   path: "/contact" },
  { name: "Dashboard", path: "/dashboard" },
];

/* ─── Status dot ─── */
const StatusPill = ({ full = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "5px 12px",
      borderRadius: 100,
      background: "rgba(57,255,20,0.06)",
      border: "1px solid rgba(57,255,20,0.18)",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: NEON,
      whiteSpace: "nowrap",
      width: full ? "fit-content" : undefined,
    }}
  >
    <motion.span
      style={{
        width: 6, height: 6, borderRadius: "50%",
        background: NEON,
        boxShadow: `0 0 6px ${NEON}`,
        display: "block", flexShrink: 0,
      }}
      animate={{ opacity: [1, 0.5, 1], scale: [1, 0.8, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />
    {full ? "All systems live" : "Live"}
  </div>
);

/* ─── Vertical divider ─── */
const Divider = () => (
  <div style={{
    width: 1, height: 22,
    background: "rgba(255,255,255,0.10)",
    borderRadius: 1, flexShrink: 0,
  }} />
);

/* ─── Center pill nav (desktop) ─── */
const NavPill = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 100,
    padding: 4,
  }}>
    {NAV_ITEMS.map((item) => (
      <NavLink key={item.name} to={item.path} end={item.path === "/"}>
        {({ isActive }) => (
          <span
            style={{
              display: "block",
              padding: "6px 18px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              letterSpacing: "0.01em",
              color: isActive ? "#050505" : "rgba(255,255,255,0.42)",
              background: isActive ? NEON : "transparent",
              boxShadow: isActive
                ? "0 0 14px rgba(57,255,20,0.38), 0 2px 6px rgba(57,255,20,0.18)"
                : "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.22s",
            }}
          >
            {item.name}
          </span>
        )}
      </NavLink>
    ))}
  </div>
);

/* ─── Hamburger ─── */
const Ham = ({ open }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{ background: NEON, height: 1.5, borderRadius: 2, display: "block" }}
        animate={
          open
            ? i === 0 ? { width: 17, rotate: 45,  y: 6.5, opacity: 1 }
            : i === 1 ? { width: 17, opacity: 0, scaleX: 0 }
            :           { width: 17, rotate: -45, y: -6.5, opacity: 1 }
            : { width: 17, rotate: 0, y: 0, opacity: 1, scaleX: 1 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      />
    ))}
  </div>
);

/* ─── Mobile drawer ─── */
const MobileDrawer = ({ open, onClose }) => {
  const location = useLocation();
  useEffect(() => { onClose(); }, [location.pathname]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 49,
              background: "rgba(0,0,0,0.72)",
            }}
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 290, damping: 30 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: 280,
              zIndex: 50, display: "flex", flexDirection: "column",
              background: "rgba(7,7,7,0.97)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderLeft: "1px solid rgba(57,255,20,0.12)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 24px", height: 64,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <Link to="/" onClick={onClose}><Logo neon /></Link>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: 36, height: 36, borderRadius: 10, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(57,255,20,0.2)",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                <Ham open />
              </motion.button>
            </div>

            {/* Links */}
            <nav style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_ITEMS.map((item, i) => (
                <NavLink key={item.name} to={item.path} end={item.path === "/"}>
                  {({ isActive }) => (
                    <motion.div
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055, type: "spring", stiffness: 280, damping: 24 }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "13px 16px", borderRadius: 12,
                        fontSize: 14.5, fontWeight: isActive ? 500 : 400,
                        color: isActive ? NEON : "rgba(255,255,255,0.42)",
                        background: isActive ? "rgba(57,255,20,0.05)" : "transparent",
                        border: `1px solid ${isActive ? "rgba(57,255,20,0.16)" : "transparent"}`,
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      {item.name}
                      <motion.svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        style={{ color: NEON, flexShrink: 0 }}
                        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -5 }}
                        transition={{ duration: 0.18 }}
                      >
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div style={{
              padding: "20px 16px 32px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <StatusPill full />
              <NavLink to="/login" onClick={onClose} style={{ display: "block" }}>
                <button style={{
                  width: "100%", padding: "12px 0", borderRadius: 12,
                  fontSize: 13.5, color: "rgba(255,255,255,0.65)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  cursor: "pointer", transition: "all 0.25s",
                }}>Log in</button>
              </NavLink>
              <Link to="/register" onClick={onClose} style={{ display: "block" }}>
                <motion.button
                  whileHover={{ boxShadow: "0 0 28px rgba(57,255,20,0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 12,
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#050505", background: NEON, border: "none",
                    boxShadow: "0 0 14px rgba(57,255,20,0.30)",
                    cursor: "pointer",
                  }}
                >Get Started</motion.button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ─── Main NavBar ─── */
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.08 }}
        style={{
          position: "sticky", top: 0, zIndex: 50,
          height: 64,
          background: "rgba(7,7,7,0.82)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          borderBottom: "1px solid rgba(57,255,20,0.14)",
          boxShadow: scrolled ? "0 4px 32px rgba(57,255,20,0.07)" : "none",
          transition: "box-shadow 0.4s",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        {/*
          3-column grid keeps the pill mathematically centered
          regardless of logo or button widths — no absolute positioning needed.
        */}
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 32px", height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
        }}>

          {/* Col 1 — Logo */}
          <Link to="/" style={{ justifySelf: "start" }}>
            <Logo neon />
          </Link>

          {/* Col 2 — Pill nav (desktop) */}
          <div className="hidden md:block">
            <NavPill />
          </div>

          {/* Col 3 — Right cluster */}
          <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 12 }}>

            {/* Desktop */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
              <StatusPill />
              <Divider />
              <NavLink to="/login">
                {({ isActive }) => (
                  <motion.button
                    whileHover={{
                      color: "#fff",
                      borderColor: "rgba(57,255,20,0.28)",
                      background: "rgba(57,255,20,0.04)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: "7px 18px", borderRadius: 100,
                      fontSize: 13, fontWeight: 400, letterSpacing: "0.01em",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                      background: isActive ? "rgba(57,255,20,0.05)" : "transparent",
                      border: `1px solid ${isActive ? "rgba(57,255,20,0.25)" : "rgba(255,255,255,0.12)"}`,
                      cursor: "pointer", whiteSpace: "nowrap",
                      transition: "all 0.22s",
                    }}
                  >Log in</motion.button>
                )}
              </NavLink>

              <Link to="/register">
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 0 26px rgba(57,255,20,0.55), 0 0 52px rgba(57,255,20,0.18)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "8px 22px", borderRadius: 100,
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#050505", background: NEON, border: "none",
                    boxShadow: "0 0 14px rgba(57,255,20,0.30)",
                    cursor: "pointer", whiteSpace: "nowrap",
                    transition: "box-shadow 0.3s",
                  }}
                >Get Started</motion.button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen(!open)}
              className="md:hidden"
              style={{
                width: 36, height: 36, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${open ? "rgba(57,255,20,0.30)" : "rgba(57,255,20,0.20)"}`,
                boxShadow: open ? "0 0 12px rgba(57,255,20,0.14)" : "none",
                cursor: "pointer", transition: "all 0.3s",
              }}
              aria-label="Toggle menu"
            >
              <Ham open={open} />
            </motion.button>

          </div>
        </div>
      </motion.nav>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default NavBar;
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ── Google Fonts injected once ── */
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
};

/* ── Palette ── */
const C = {
  leaf: "#1a4a2e",
  leafMid: "#2d6a4f",
  sage: "#52b788",
  mint: "#95d5b2",
  cream: "#faf7f0",
  parchment: "#f2ede0",
  amber: "#e8a838",
  gold: "#f4c542",
  ember: "#d4622a",
  charcoal: "#1c1c1c",
  muted: "#6b7a6d",
};

/* ── Reusable animated wrapper ── */
const Reveal = ({ children, delay = 0, y = 32, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Animated counter ── */
const Counter = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const n = parseInt(target.replace(/\D/g, ""));
    let start = 0;
    const step = Math.ceil(n / 60);
    const t = setInterval(() => {
      start = Math.min(start + step, n);
      setVal(start);
      if (start >= n) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ── Live ticker ── */
const ticks = [
  "🍱 Mumbai — 24 meals rescued",
  "🥗 Delhi — NGO matched in 3 min",
  "🍛 Bangalore — 80 kg saved today",
  "🫙 Pune — New volunteer joined",
  "🍲 Chennai — 12 families fed",
];
const Ticker = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ticks.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        background: C.amber,
        padding: "10px 0",
        overflow: "hidden",
        fontFamily: "'DM Mono', monospace",
        fontSize: 13,
        color: C.leaf,
        fontWeight: 500,
      }}
    >
      <motion.div
        key={idx}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: "center" }}
      >
        {ticks[idx]}
      </motion.div>
    </div>
  );
};

/* ── Leaf SVG decoration ── */
const LeafDeco = ({ style }) => (
  <svg
    viewBox="0 0 120 160"
    fill="none"
    style={{ position: "absolute", pointerEvents: "none", ...style }}
  >
    <path
      d="M60 155 C20 120 0 80 10 40 C20 0 60 5 90 35 C120 65 115 120 60 155Z"
      fill={C.sage}
      opacity="0.18"
    />
    <path
      d="M60 155 L60 60"
      stroke={C.sage}
      strokeWidth="1.5"
      opacity="0.3"
    />
  </svg>
);

/* ── Grain overlay ── */
const Grain = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 999,
      opacity: 0.025,
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
    }}
  />
);

/* ═══════════════════════════════════════════════
   SECTIONS
═══════════════════════════════════════════════ */

/* ── HERO ── */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${C.leaf} 0%, ${C.leafMid} 55%, #1e5c3a 100%)`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Parallax decorative blobs */}
      <motion.div
        style={{ y }}
        className="abs-deco"
      >
        <LeafDeco style={{ width: 320, top: -40, left: -60, transform: "rotate(-20deg)" }} />
        <LeafDeco style={{ width: 260, bottom: 60, right: -40, transform: "rotate(140deg)" }} />
        <LeafDeco style={{ width: 180, top: "30%", right: "15%", transform: "rotate(60deg)" }} />
      </motion.div>

      {/* Big circle glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.sage}22 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />

      {/* Amber arc */}
      <svg
        style={{ position: "absolute", bottom: 0, right: 0, width: 500, opacity: 0.12 }}
        viewBox="0 0 500 500"
      >
        <circle cx="500" cy="500" r="380" stroke={C.amber} strokeWidth="60" fill="none" />
      </svg>

      <motion.div
        style={{ opacity }}
        className="hero-inner"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 100,
            padding: "8px 18px",
            marginBottom: 28,
            fontSize: 13,
            color: C.mint,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber, display: "inline-block" }} />
          FOOD RESCUE PLATFORM · INDIA
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(52px, 8vw, 110px)",
            fontWeight: 900,
            lineHeight: 0.92,
            color: "#fff",
            marginBottom: 28,
            letterSpacing: "-0.02em",
          }}
        >
          Every Meal
          <br />
          <em
            style={{
              fontStyle: "italic",
              background: `linear-gradient(90deg, ${C.amber}, ${C.gold})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Matters.
          </em>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255,255,255,0.65)",
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: 44,
            fontWeight: 300,
          }}
        >
          ResQPlate bridges the gap between surplus food and hungry families — in real time, with zero friction.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <Link to="/register?role=donor">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 20px 50px ${C.amber}55` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.amber,
                color: C.leaf,
                border: "none",
                padding: "16px 34px",
                borderRadius: 100,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              Donate Food →
            </motion.button>
          </Link>
          <Link to="/register?role=ngo">
            <motion.button
              whileHover={{ background: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "16px 34px",
                borderRadius: 100,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Request Food
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {["Govt. of India Backed", "ISO 9001:2015", "2,400+ Lives Impacted"].map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke={C.sage} strokeWidth="1.2" />
                <path d="M4 7l2 2 4-4" stroke={C.sage} strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              {t}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating food card */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          right: "8%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 280,
        }}
        className="hero-card-wrap"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: 24,
            boxShadow: `0 40px 80px rgba(0,0,0,0.35)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍱</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}>New Donation Posted</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>2 min ago · Connaught Place</div>
            </div>
          </div>
          <div style={{ background: C.cream, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}>45 meals — Dal Makhani, Rice, Sabzi</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>Expires in 3h · Pickup available</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: C.leaf, color: "#fff", borderRadius: 10, padding: "8px 0", textAlign: "center", fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Accept</div>
            <div style={{ flex: 1, background: C.parchment, color: C.muted, borderRadius: 10, padding: "8px 0", textAlign: "center", fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Later</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.parchment}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }} />
            <span style={{ fontSize: 11, color: C.sage, fontFamily: "'DM Mono', monospace" }}>3 NGOs notified nearby</span>
          </div>
        </motion.div>

        {/* Second floating mini card */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute",
            bottom: -30,
            left: -40,
            background: C.amber,
            borderRadius: 16,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ fontSize: 22 }}>🌱</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.leaf, fontFamily: "'DM Sans', sans-serif" }}>500 kg CO₂ Saved</div>
            <div style={{ fontSize: 10, color: C.leafMid, fontFamily: "'DM Mono', monospace" }}>This month alone</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }}
        />
      </motion.div>
    </section>
  );
};

/* ── STATS ── */
const statsData = [
  { value: "1200", suffix: "+", label: "Meals Rescued", icon: "🍽️" },
  { value: "50", suffix: "+", label: "NGO Partners", icon: "🤝" },
  { value: "500", suffix: " kg", label: "CO₂ Reduced", icon: "🌿" },
  { value: "98", suffix: "%", label: "Satisfaction", icon: "⭐" },
];

const Stats = () => (
  <section style={{ background: C.leaf, padding: "0 24px" }}>
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        transform: "translateY(-48px)",
        background: C.cream,
        borderRadius: 28,
        boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
        padding: "48px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 24,
      }}
      className="stats-grid"
    >
      {statsData.map((s, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 40,
                fontWeight: 900,
                color: C.leaf,
                lineHeight: 1,
              }}
            >
              <Counter target={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, marginTop: 6, fontWeight: 400 }}>
              {s.label}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ── MISSION STRIP ── */
const Mission = () => (
  <section
    style={{
      background: C.cream,
      padding: "80px 24px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <LeafDeco style={{ width: 200, top: -20, right: 80, opacity: 0.6 }} />
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <Reveal>
        <div
          style={{
            display: "inline-block",
            background: C.leafMid,
            color: "#fff",
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.15em",
            padding: "6px 16px",
            borderRadius: 100,
            marginBottom: 20,
          }}
        >
          OUR MISSION
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <blockquote
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            color: C.charcoal,
            lineHeight: 1.25,
            margin: "0 0 24px",
            fontStyle: "italic",
          }}
        >
          "No plate left behind — bridging abundance and hunger, one rescue at a time."
        </blockquote>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.muted, fontSize: 16, lineHeight: 1.75, maxWidth: 580, margin: "0 auto" }}>
          We believe food waste and hunger are two sides of the same broken system. ResQPlate repairs it — with technology, community, and compassion.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ── FEATURES ── */
const featuresData = [
  {
    emoji: "⚡",
    title: "AI-Powered Matching",
    desc: "Our algorithm matches surplus food to the nearest verified NGO in under 90 seconds, factoring in distance, capacity, and food type.",
    accent: C.amber,
    tag: "NEW",
  },
  {
    emoji: "🗺️",
    title: "Live Map Tracking",
    desc: "Follow every donation from post to plate with real-time GPS tracking and push notifications for donors, NGOs, and volunteers.",
    accent: C.sage,
    tag: "",
  },
  {
    emoji: "🛡️",
    title: "Trust & Safety",
    desc: "Every NGO is background-checked, rated, and insured. Donors get full transparency with photo proof of delivery.",
    accent: C.leafMid,
    tag: "",
  },
  {
    emoji: "📊",
    title: "Impact Dashboard",
    desc: "See your personal CO₂ savings, meals rescued, and families helped — in a beautiful, shareable impact report.",
    accent: C.ember,
    tag: "NEW",
  },
  {
    emoji: "🔔",
    title: "Smart Alerts",
    desc: "WhatsApp, SMS, and app notifications ensure zero missed pickups. Set your schedule and we'll handle the coordination.",
    accent: C.gold,
    tag: "",
  },
  {
    emoji: "🏆",
    title: "Donor Rewards",
    desc: "Earn ResQPoints for every donation. Redeem for tax certificates, brand badges, and exclusive partner discounts.",
    accent: C.leafMid,
    tag: "NEW",
  },
];

const Features = () => (
  <section style={{ background: C.parchment, padding: "100px 24px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.muted, marginBottom: 12 }}>PLATFORM FEATURES</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              color: C.charcoal,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 560,
            }}
          >
            Built for <em style={{ color: C.leafMid }}>speed,</em> trust & impact.
          </h2>
        </div>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
        className="features-grid"
      >
        {featuresData.map((f, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -6, boxShadow: `0 24px 60px rgba(0,0,0,0.1)` }}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 28,
                border: `1px solid rgba(0,0,0,0.06)`,
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                transition: "box-shadow 0.3s",
              }}
            >
              {f.tag && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: C.amber,
                    color: C.leaf,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    padding: "3px 8px",
                    borderRadius: 100,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {f.tag}
                </div>
              )}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: f.accent + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 20,
                }}
              >
                {f.emoji}
              </div>
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 17,
                  color: C.charcoal,
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
              {/* accent bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: f.accent,
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
                className="feat-bar"
              />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── HOW IT WORKS ── */
const howSteps = [
  {
    num: "01",
    emoji: "📸",
    title: "Post in 60 Seconds",
    desc: "Snap a photo, add quantity and pickup window. That's it — no forms, no friction.",
    color: C.sage,
  },
  {
    num: "02",
    emoji: "🤖",
    title: "AI Finds the Match",
    desc: "Our engine notifies the best-fit NGO within seconds based on location, type, and urgency.",
    color: C.amber,
  },
  {
    num: "03",
    emoji: "🚴",
    title: "Volunteer Picks Up",
    desc: "A vetted volunteer collects the food and delivers it with live GPS updates for all parties.",
    color: C.ember,
  },
  {
    num: "04",
    emoji: "📋",
    title: "Impact Report",
    desc: "Receive a certificate with CO₂ saved, meals rescued, and families fed. Share on social.",
    color: C.leafMid,
  },
];

const HowItWorks = () => (
  <section
    style={{
      background: C.leaf,
      padding: "100px 24px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Decorative ring */}
    <svg style={{ position: "absolute", top: -100, right: -100, width: 500, opacity: 0.06 }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="160" stroke="#fff" strokeWidth="80" fill="none" />
    </svg>

    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.mint, marginBottom: 12 }}>HOW IT WORKS</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            From surplus to smiles — <em>in minutes.</em>
          </h2>
        </div>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          position: "relative",
        }}
        className="how-grid"
      >
        {/* Connecting line */}
        <div
          style={{
            position: "absolute",
            top: 52,
            left: "12%",
            right: "12%",
            height: 1,
            background: "rgba(255,255,255,0.1)",
          }}
          className="how-line"
        />

        {howSteps.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  margin: "0 auto 20px",
                  boxShadow: `0 0 0 8px ${s.color}22`,
                }}
              >
                {s.emoji}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: s.color,
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                {s.num}
              </div>
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.65,
                }}
              >
                {s.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── IMPACT MAP VISUAL ── */
const ImpactMap = () => (
  <section style={{ background: C.cream, padding: "100px 24px", overflow: "hidden" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="map-grid">
      <Reveal>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.muted, marginBottom: 12 }}>REAL-TIME IMPACT</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 50px)",
              fontWeight: 900,
              color: C.charcoal,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Rescues happening right now, across India.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 32 }}>
            Our live operations dashboard shows every active donation, pickup in progress, and delivery completed — city by city, minute by minute.
          </p>
          {[
            { city: "New Delhi", meals: 124, color: C.sage },
            { city: "Mumbai", meals: 98, color: C.amber },
            { city: "Bangalore", meals: 76, color: C.ember },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.charcoal, flex: 1 }}>{c.city}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: c.color, fontWeight: 500 }}>{c.meals} meals today</div>
              <div style={{ flex: 2, height: 4, background: C.parchment, borderRadius: 100, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(c.meals / 130) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.15 }}
                  style={{ height: "100%", background: c.color, borderRadius: 100 }}
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        {/* Abstract India map SVG */}
        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 360 440" fill="none" style={{ width: "100%", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))" }}>
            <path d="M180 30 C210 25 240 40 260 70 C290 110 295 140 280 175 C270 200 290 220 285 250 C278 285 260 310 240 335 C220 360 200 385 180 410 C160 385 140 360 120 335 C100 310 82 285 75 250 C70 220 90 200 80 175 C65 140 70 110 100 70 C120 40 150 35 180 30Z" fill={C.parchment} stroke={C.sage} strokeWidth="2" />
            {[
              { x: 155, y: 120, label: "Delhi", r: 14, color: C.sage },
              { x: 120, y: 260, label: "Mumbai", r: 11, color: C.amber },
              { x: 195, y: 285, label: "Bengaluru", r: 9, color: C.ember },
              { x: 215, y: 180, label: "Kolkata", r: 8, color: C.leafMid },
              { x: 165, y: 310, label: "Chennai", r: 7, color: C.gold },
            ].map((dot, i) => (
              <g key={i}>
                <motion.circle
                  cx={dot.x} cy={dot.y} r={dot.r + 6}
                  fill={dot.color}
                  opacity={0.2}
                  animate={{ r: [dot.r + 6, dot.r + 14, dot.r + 6] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                />
                <circle cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} />
                <text x={dot.x + dot.r + 6} y={dot.y + 4} fontSize="10" fill={C.muted} fontFamily="DM Sans, sans-serif">{dot.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ── TESTIMONIALS ── */
const testimonialsData = [
  { name: "Priya Sharma", role: "Restaurant Owner, Delhi", text: "ResQPlate turned our daily food waste into daily impact. The app is stupidly simple and the results are extraordinary.", avatar: "PS", color: C.sage },
  { name: "Rahul Gupta", role: "NGO Coordinator, Mumbai", text: "The AI matching cut our coordination time from hours to minutes. We're feeding 3× more families with the same team.", avatar: "RG", color: C.amber },
  { name: "Anita Verma", role: "Community Leader, Bangalore", text: "I've never seen a tech product that cares this much about real people. The impact dashboard made our donors cry.", avatar: "AV", color: C.ember },
];

const Testimonials = () => (
  <section style={{ background: C.parchment, padding: "100px 24px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.muted, marginBottom: 12 }}>COMMUNITY VOICES</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              color: C.charcoal,
              lineHeight: 1.1,
            }}
          >
            The people who make it <em style={{ color: C.leafMid }}>real.</em>
          </h2>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="testimonials-grid">
        {testimonialsData.map((t, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <motion.div
              whileHover={{ y: -6 }}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: C.amber, fontSize: 14 }}>★</span>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 17,
                  color: C.charcoal,
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  flex: 1,
                  marginBottom: 24,
                }}
              >
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: t.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: C.charcoal }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.muted }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── PARTNERS ── */
const Partners = () => (
  <section style={{ background: C.cream, padding: "60px 24px", borderTop: `1px solid rgba(0,0,0,0.06)` }}>
    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
      <Reveal>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.muted, marginBottom: 32 }}>TRUSTED BY</div>
      </Reveal>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
        {["Food Corp India", "Akshaya Patra", "Feeding India", "Zomato Feeding", "FSSAI"].map((name, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: C.muted,
                opacity: 0.6,
                letterSpacing: "0.02em",
              }}
            >
              {name}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── CTA ── */
const CTA = () => (
  <section
    style={{
      background: `linear-gradient(145deg, ${C.leaf} 0%, ${C.leafMid} 60%, #1b5c3b 100%)`,
      padding: "120px 24px",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}
  >
    <LeafDeco style={{ width: 280, top: -40, left: -60, opacity: 0.5, transform: "rotate(-30deg)" }} />
    <LeafDeco style={{ width: 220, bottom: -20, right: -40, opacity: 0.4, transform: "rotate(150deg)" }} />

    <svg style={{ position: "absolute", bottom: -60, right: -60, width: 400, opacity: 0.08 }} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="180" stroke={C.amber} strokeWidth="40" fill="none" />
    </svg>

    <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
      <Reveal>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.mint, marginBottom: 20 }}>JOIN THE MOVEMENT</div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.0,
            marginBottom: 20,
            letterSpacing: "-0.02em",
          }}
        >
          Ready to rescue your first meal?
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.6)", marginBottom: 44, fontWeight: 300, lineHeight: 1.7 }}>
          Join 1,200+ donors and 50 NGOs already making India's food system more human.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 24px 50px ${C.amber}55` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.amber,
                color: C.leaf,
                border: "none",
                padding: "18px 40px",
                borderRadius: 100,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Start Donating →
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button
              whileHover={{ background: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "18px 40px",
                borderRadius: 100,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Learn More
            </motion.button>
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ── FOOTER ── */
const Footer = () => (
  <footer style={{ background: C.charcoal, color: "rgba(255,255,255,0.45)", padding: "72px 24px 40px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }} className="footer-grid">
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 14 }}>
            ResQ<em style={{ color: C.amber }}>Plate</em>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.75, maxWidth: 280 }}>
            Connecting surplus food with families in need. Building a hunger-free India, one rescue at a time.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {["🐦", "📸", "💼"].map((icon, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>{icon}</div>
            ))}
          </div>
        </div>
        {[
          { title: "Platform", links: ["How it Works", "NGO Partners", "Volunteer", "Impact Map"] },
          { title: "Company", links: ["About", "Blog", "Press", "Careers"] },
          { title: "Support", links: ["Contact", "FAQ", "Privacy", "Terms"] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: "#fff", letterSpacing: "0.06em", marginBottom: 18, textTransform: "uppercase" }}>{col.title}</div>
            {col.links.map((link, j) => (
              <div key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >{link}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>© 2026 ResQPlate · Built for Social Good</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.sage }}>🌿 Carbon-neutral operations</div>
      </div>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════════════ */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; }
      a { text-decoration: none; color: inherit; }
      .hero-inner {
        position: relative; z-index: 2;
        padding: 0 5% 0 8%;
        max-width: 1200px; margin: 0 auto;
        width: 100%;
      }
      .abs-deco { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
      .hero-card-wrap { display: block; }
      @media (max-width: 900px) {
        .hero-card-wrap { display: none; }
        .hero-inner { padding: 0 24px; text-align: center; }
        .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .features-grid { grid-template-columns: 1fr !important; }
        .how-grid { grid-template-columns: 1fr 1fr !important; }
        .how-line { display: none; }
        .map-grid { grid-template-columns: 1fr !important; }
        .testimonials-grid { grid-template-columns: 1fr !important; }
        .footer-grid { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 600px) {
        .stats-grid { grid-template-columns: 1fr 1fr !important; padding: 32px 24px !important; }
        .how-grid { grid-template-columns: 1fr !important; }
        .footer-grid { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

/* ═══════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════ */
const Landing = () => (
  <>
    <FontLoader />
    <GlobalStyles />
    <Grain />
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Ticker />
      <Hero />
      <Stats />
      <Mission />
      <Features />
      <HowItWorks />
      <ImpactMap />
      <Testimonials />
      <Partners />
      <CTA />
      <Footer />
    </div>
  </>
);

export default Landing;
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineSparkles,
} from "react-icons/hi";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const contactInfo = [
  {
    icon: HiOutlineMail,
    title: "Digital Comms",
    details: ["support@resqplate.com", "logistics@resqplate.com"],
    color: "from-emerald-400 to-cyan-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: HiOutlinePhone,
    title: "Dispatch Control",
    details: ["+91 98765 43210", "24/7 Emergency Routing"],
    color: "from-cyan-400 to-blue-500",
    shadow: "shadow-cyan-500/20",
  },
  {
    icon: HiOutlineLocationMarker,
    title: "Central Hub",
    details: ["ResqPlate HQ", "Patna, Bihar - 800001"],
    color: "from-blue-400 to-indigo-500",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: HiOutlineClock,
    title: "Platform Uptime",
    details: ["System: 24/7", "Support: 9:00 AM - 8:00 PM"],
    color: "from-indigo-400 to-purple-500",
    shadow: "shadow-indigo-500/20",
  },
];

const faqs = [
  {
    q: "How quickly are drivers assigned to surplus food alerts?",
    a: "The ResqPlate algorithm typically dispatches a nearby driver within 5-10 minutes of a restaurant logging surplus inventory.",
  },
  {
    q: "How does the platform ensure food safety during transit?",
    a: "All logistics partners utilize insulated containers, and transit times are strictly monitored via our real-time tracking system to prevent spoilage.",
  },
  {
    q: "Can NGOs request specific food types?",
    a: "Yes. NGOs can update their live requirements via the dashboard, ensuring they only receive food that meets their current operational needs.",
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Restaurant Onboarding",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated API Call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setForm({ name: "", email: "", subject: "Restaurant Onboarding", message: "" });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30">
      {/* ===== HERO SECTION ===== */}
      <AnimatedSection className="relative py-24 px-6 overflow-hidden">
        {/* Ambient Mesh Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto mt-12">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md">
              <HiOutlineSparkles className="text-emerald-400" />
              ResqPlate Operations Center
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Initialize
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Connection
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Integrate with the logistics network. Partner as a restaurant, register as an NGO, or join the fleet to optimize food redistribution.
            </p>
          </motion.div>

          {/* Contact Info Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors h-full">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-6 shadow-lg ${info.shadow}`}>
                    <info.icon className="text-2xl text-slate-950" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{info.title}</h3>
                  {info.details.map((detail, j) => (
                    <p key={j} className="text-sm text-slate-400">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ===== FORM & DATA SECTION ===== */}
      <AnimatedSection className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* LEFT: System Intake Form */}
            <motion.div variants={fadeInUp} className="lg:col-span-7">
              <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50" />
                
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white mb-3">System Intake</h2>
                  <p className="text-slate-400">Transmit a secure message to the operations team.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-300">Operator Name</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Jane Doe"
                        required
                        className="w-full px-5 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl focus:bg-slate-900 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-white placeholder-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-300">Secure Comm Link (Email)</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@organization.com"
                        required
                        className="w-full px-5 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl focus:bg-slate-900 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-white placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-300">Transmission Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl focus:bg-slate-900 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-white appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-900">Restaurant Onboarding</option>
                      <option className="bg-slate-900">NGO Partnership</option>
                      <option className="bg-slate-900">Driver Fleet Application</option>
                      <option className="bg-slate-900">Report Logistics Issue</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-300">Encrypted Payload (Message)</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Detail the logistics inquiry..."
                      rows="5"
                      required
                      className="w-full px-5 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl focus:bg-slate-900 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-white resize-none placeholder-slate-600"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || isSent}
                    className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-3 border ${
                      isSent
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 hover:shadow-emerald-500/20"
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"
                      />
                    ) : isSent ? (
                      <>
                        <HiOutlineCheckCircle className="text-xl" />
                        Transmission Verified
                      </>
                    ) : (
                      <>
                        Initialize Transmission
                        <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* RIGHT: Telemetry & FAQ */}
            <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-8">
              
              {/* Telemetry Node (Map Placeholder) */}
              <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 overflow-hidden">
                <div className="h-56 bg-slate-950 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-32 h-32 bg-emerald-500/20 rounded-full blur-xl"
                  />
                  <div className="relative z-10 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                      <HiOutlineLocationMarker className="text-2xl text-emerald-400" />
                    </div>
                    <p className="font-semibold text-white tracking-wide text-sm">Node: Patna, Bihar</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Active Status</p>
                  </div>
                </div>
              </div>

              {/* Data Queries (FAQ) */}
              <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  System Queries
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <motion.div
                      key={i}
                      className={`border rounded-xl overflow-hidden transition-colors ${
                        activeFaq === i ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <button
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className="font-medium text-slate-300 text-sm pr-4">
                          {faq.q}
                        </span>
                        <motion.span
                          animate={{ rotate: activeFaq === i ? 180 : 0 }}
                          className={`flex-shrink-0 ${activeFaq === i ? "text-emerald-400" : "text-slate-600"}`}
                        >
                          <HiOutlineExclamationCircle className="text-lg" />
                        </motion.span>
                      </button>
                      <motion.div
                        initial={false}
                        animate={{
                          height: activeFaq === i ? "auto" : 0,
                          opacity: activeFaq === i ? 1 : 0,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-0">
                          <p className="text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-3">{faq.a}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Contact;
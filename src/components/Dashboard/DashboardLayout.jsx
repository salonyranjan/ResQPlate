import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiSearch,
  HiClipboardList,
  HiUser,
} from "react-icons/hi";

const TABS = [
  { name: "Home", path: "/dashboard", icon: HiHome },
  { name: "Search", path: "/dashboard/search", icon: HiSearch },
  { name: "Orders", path: "/dashboard/orders", icon: HiClipboardList },
  { name: "Profile", path: "/dashboard/profile", icon: HiUser },
];

// Animation variants
const navVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

const tabVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.85 },
  hover: { scale: 1.1 },
};

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const activeTab = TABS.find((t) => t.path === pathname);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg, #f9fafb)]">
      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <motion.nav
        aria-label="Main navigation"
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="fixed inset-x-0 bottom-0 z-50
                   bg-white/90 backdrop-blur-lg
                   border-t border-[var(--color-border,rgba(0,0,0,0.06))]
                   shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="relative flex items-stretch justify-around h-16 max-w-lg mx-auto">
          {TABS.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path;
            return (
              <NavLink
                key={name}
                to={path}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative flex flex-col items-center justify-center
                  flex-1 gap-1 py-1
                  transition-colors duration-200
                  ${isActive ? "text-[var(--color-primary,#16a34a)]" : "text-gray-400"}
                `}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-2 top-1 bottom-1 rounded-xl
                               bg-[var(--color-primary,#16a34a)]/10"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}

                <motion.span
                  whileTap="tap"
                  whileHover="hover"
                  variants={tabVariants}
                  className="relative z-10 flex flex-col items-center"
                >
                  <Icon
                    className={`text-2xl transition-colors duration-200 ${
                      isActive
                        ? "text-[var(--color-primary,#16a34a)]"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1"
                    }`}
                  >
                    {name}
                  </span>
                </motion.span>
              </NavLink>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default DashboardLayout;

import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";

const SCROLL_SECTIONS = new Set([
  "home","about","skills","projects","work","portfolio",
  "experience","education","certificates","recognition","contact",
]);
const SECTION_ALIAS = { work: "projects", portfolio: "projects" };

function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Menus already in Redux — Navbar fetches them
  const menus    = useSelector((s) => s.menu.menus);

  const getTarget = (menuPath = "") => {
    const raw = menuPath.replace(/^\//, "").toLowerCase();
    if (raw === "resume") return { type: "page", path: "/resume" };
    if (raw.startsWith("admin")) return { type: "page", path: `/${raw}` };
    if (SCROLL_SECTIONS.has(raw)) {
      return { type: "hash", section: SECTION_ALIAS[raw] || raw };
    }
    return { type: "page", path: menuPath || "/" };
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClick = (e, menuPath) => {
    e.preventDefault();
    const target = getTarget(menuPath);
    if (target.type === "hash") {
      if (location.pathname === "/") {
        scrollTo(target.section);
        navigate(`#${target.section}`, { replace: true });
      } else {
        navigate(`/#${target.section}`);
      }
    } else {
      navigate(target.path);
    }
    onToggle(); // close sidebar after click
  };

  const isActive = (menuPath) => {
    const target = getTarget(menuPath);
    if (target.type === "page") return location.pathname === target.path;
    return location.hash === `#${target.section}` && location.pathname === "/";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            className="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
          >
            <div className="sidebar-header">
              <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
                Navigation
              </span>
              <button
                onClick={onToggle}
                className="hamburger"
                aria-label="Close menu"
              >
                <HiXMark size={20} />
              </button>
            </div>

            <nav className="sidebar-nav">
              {menus.map((menu) => (
                <a
                  key={menu._id}
                  href={menu.menuPath}
                  onClick={(e) => handleClick(e, menu.menuPath)}
                  className={`sidebar-link${isActive(menu.menuPath) ? " active" : ""}`}
                >
                  {menu.menuName}
                </a>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;

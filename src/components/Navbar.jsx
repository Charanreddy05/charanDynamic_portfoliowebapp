import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toggleTheme } from "../redux/themeSlice";
import { setMenus } from "../redux/menuSlice";
import api from "../services/api";
import { HiSun, HiMoon, HiBars3, HiXMark } from "react-icons/hi2";

// Which menu paths are single-page scroll sections vs full pages
const SCROLL_SECTIONS = new Set([
  "home","about","skills","projects","work","portfolio",
  "experience","education","certificates","recognition","contact",
]);
const SECTION_ALIAS = { work: "projects", portfolio: "projects" };

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const theme      = useSelector((s) => s.theme.mode);
  const menus      = useSelector((s) => s.menu.menus);

  // Fetch menus once here — sidebar just reads from Redux
  useEffect(() => {
    api.get("/menu")
      .then((res) => dispatch(setMenus(res.data)))
      .catch(() => {});
  }, [dispatch]);

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

  const handleNavClick = (e, menuPath) => {
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
  };

  const isActive = (menuPath) => {
    const target = getTarget(menuPath);
    if (target.type === "page") return location.pathname === target.path;
    return location.hash === `#${target.section}` && location.pathname === "/";
  };

  return (
    <nav className="navbar">
      {/* Left: hamburger (mobile only) + brand */}
      <div className="flex items-center gap-2">
        <button
          className="hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          {isSidebarOpen
            ? <HiXMark size={22} />
            : <HiBars3 size={22} />
          }
        </button>
        <Link to="/" className="navbar-brand">
          Portfolio
        </Link>
      </div>

      {/* Center: desktop nav links */}
      <div className="navbar-links">
        {menus.map((menu) => (
          <a
            key={menu._id}
            href={menu.menuPath}
            onClick={(e) => handleNavClick(e, menu.menuPath)}
            className={`nav-link${isActive(menu.menuPath) ? " active" : ""}`}
          >
            {menu.menuName}
          </a>
        ))}
      </div>

      {/* Right: theme toggle */}
      <div className="navbar-right">
        <button
          className="theme-toggle"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <HiSun size={18} /> : <HiMoon size={18} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

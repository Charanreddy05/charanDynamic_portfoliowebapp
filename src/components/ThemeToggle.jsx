import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { HiSun, HiMoon } from "react-icons/hi2";

// Standalone toggle — can be used anywhere outside Navbar if needed
function ThemeToggle() {
  const dispatch = useDispatch();
  const theme    = useSelector((s) => s.theme.mode);
  return (
    <button
      className="theme-toggle"
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <HiSun size={18} /> : <HiMoon size={18} />}
    </button>
  );
}

export default ThemeToggle;

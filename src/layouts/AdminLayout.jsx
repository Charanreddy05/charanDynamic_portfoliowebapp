import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../redux/authSlice";
import {
  HiHome, HiUser, HiCodeBracket, HiBriefcase, HiAcademicCap,
  HiDocumentCheck, HiTrophy, HiListBullet, HiInbox,
  HiArrowRightOnRectangle, HiBars3, HiXMark,
  HiShieldCheck, HiArchiveBoxArrowDown, HiUsers,
} from "react-icons/hi2";
import { useState, useMemo } from "react";

const ALL_SECTIONS = [
  { key: "dashboard",     label: "Dashboard",     path: "/admin",                  icon: HiHome },
  { key: "profile",       label: "Profile",       path: "/admin/profile",          icon: HiUser },
  { key: "skills",        label: "Skills",        path: "/admin/skills",           icon: HiCodeBracket },
  { key: "projects",      label: "Projects",      path: "/admin/projects",         icon: HiCodeBracket },
  { key: "experience",    label: "Experience",    path: "/admin/experience",       icon: HiBriefcase },
  { key: "education",     label: "Education",     path: "/admin/education",        icon: HiAcademicCap },
  { key: "certificates",  label: "Certificates",  path: "/admin/certificates",     icon: HiDocumentCheck },
  { key: "recognition",   label: "Recognition",   path: "/admin/recognition",      icon: HiTrophy },
  { key: "menus",         label: "Menus",         path: "/admin/menus",            icon: HiListBullet },
  { key: "messages",      label: "Messages",      path: "/admin/messages",         icon: HiInbox },
];

const SUPER_ADMIN_SECTIONS = [
  { key: "inbox",         label: "Approval Inbox",  path: "/admin/inbox",         icon: HiArchiveBoxArrowDown },
  { key: "outbox",        label: "Approval Outbox", path: "/admin/outbox",        icon: HiShieldCheck },
  { key: "management",    label: "Admin Management",path: "/admin/management",    icon: HiUsers },
];

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";

  const navItems = useMemo(() => {
    const perms = user?.permissions || [];
    let items = [...ALL_SECTIONS];
    if (isSuperAdmin) {
      items = [...items, ...SUPER_ADMIN_SECTIONS];
    } else if (perms.length > 0) {
      items = items.filter(i => perms.includes(i.key));
    }
    return items;
  }, [isSuperAdmin, user?.permissions]);

  const handleLogout = () => { dispatch(logout()); window.location.href = "/"; };
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto flex flex-col`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200 dark:border-gray-800">
          <Link to="/admin" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              H
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>Portfolio Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" style={{ color: "var(--text-muted)" }}>
            <HiXMark size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                style={{ color: active ? undefined : "var(--text-muted)" }}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {(user?.fullName || "A")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{user?.fullName || "Admin"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${user?.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {isSuperAdmin ? "Super Admin" : user?.role || "Admin"}
                </p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ color: "#dc2626" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <HiArrowRightOnRectangle size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" style={{ color: "var(--text-muted)" }}>
            <HiBars3 size={22} />
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-sm font-medium no-underline hover:underline" style={{ color: "var(--accent)" }}>
            View Site
          </Link>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

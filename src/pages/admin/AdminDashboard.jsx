import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  HiUser, HiCodeBracket, HiBriefcase, HiAcademicCap,
  HiDocumentCheck, HiInbox, HiTrophy, HiListBullet,
} from "react-icons/hi2";

const CARDS = [
  { label: "Profile",                    path: "/admin/profile",      icon: HiUser,          color: "#2563eb", desc: "Update your info & photo"   },
  { label: "Skills",                     path: "/admin/skills",       icon: HiCodeBracket,   color: "#059669", desc: "Manage tech skills"           },
  { label: "Projects",                   path: "/admin/projects",     icon: HiCodeBracket,   color: "#0891b2", desc: "Showcase your work"           },
  { label: "Experience",                 path: "/admin/experience",   icon: HiBriefcase,     color: "#d97706", desc: "Work history"                  },
  { label: "Education",                  path: "/admin/education",    icon: HiAcademicCap,   color: "#7c3aed", desc: "Academic background"           },
  { label: "Certificates",               path: "/admin/certificates", icon: HiDocumentCheck, color: "#0284c7", desc: "Add & manage certificates"     },
  { label: "Recognition & Achievements", path: "/admin/recognition",  icon: HiTrophy,        color: "#ca8a04", desc: "Awards & honours"              },
  { label: "Navigation Menus",           path: "/admin/menus",        icon: HiListBullet,    color: "#475569", desc: "Edit navbar links"             },
  { label: "Messages",                   path: "/admin/messages",     icon: HiInbox,         color: "#64748b", desc: "Contact form submissions"      },
];

function AdminDashboard() {
  const user = useSelector((s) => s.auth.user);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
          Admin Panel
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Welcome back,{" "}
          <span className="font-semibold" style={{ color: "var(--accent)" }}>
            {user?.fullName || "Admin"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}>
              <Link to={card.path} className="pro-card flex items-center gap-4 group no-underline"
                    style={{ textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = card.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white transition-all"
                     style={{ background: card.color, boxShadow: `0 4px 14px ${card.color}40` }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight transition-colors" style={{ color: "var(--text)" }}>
                    {card.label}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default AdminDashboard;

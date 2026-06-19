import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { setSkills } from "../redux/skillSlice";
import { motion } from "framer-motion";
import { HiWrenchScrewdriver } from "react-icons/hi2";

const SKILL_COLORS = [
  "#2563eb","#7c3aed","#0891b2","#059669","#d97706",
  "#dc2626","#9333ea","#0284c7","#16a34a","#ca8a04",
];

const CATEGORY_ICONS = {
  Frontend: "</>",
  Backend: "{}",
  Database: "DB",
  DevOps: "⚙",
  Deployment: "🚀",
  "Version Control": "VC",
  Testing: "✓",
  Mobile: "📱",
  "UI/UX": "🎨",
  Tools: "🔧",
};

const CATEGORY_ORDER = [
  "Frontend", "Backend", "Database", "DevOps",
  "Deployment", "Version Control", "Testing",
  "Mobile", "UI/UX", "Tools", "Other",
];

function Skills() {
  const dispatch = useDispatch();
  const skills = useSelector((s) => s.skills.skills);

  useEffect(() => {
    api.get("/skills")
      .then((r) => dispatch(setSkills(r.data)))
      .catch(() => {});
  }, [dispatch]);

  const grouped = useMemo(() => {
    const map = {};
    for (const s of skills) {
      const cat = s.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    }
    const entries = Object.entries(map).sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a[0]);
      const ib = CATEGORY_ORDER.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return entries;
  }, [skills]);

  let globalIdx = 0;

  return (
    <section className="section-wrap">
      <div className="section-inner">

        <div className="text-center mb-14 space-y-3">
          <div className="badge badge-blue w-fit mx-auto">
            <HiWrenchScrewdriver size={14} /> Tech Stack
          </div>
          <h2 className="section-title">My Skills</h2>
          <div className="section-line" />
          <p className="max-w-xl mx-auto text-base" style={{ color: "var(--text-muted)" }}>
            Technologies and tools I work with on a regular basis.
          </p>
        </div>

        {grouped.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map(([cat, catSkills]) => {
              const icon = CATEGORY_ICONS[cat] || "•";
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                         style={{ background: "linear-gradient(135deg, var(--accent), #4f46e5)" }}>
                      {icon}
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>{cat}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {catSkills.map((skill) => {
                      const idx = globalIdx++;
                      const color = SKILL_COLORS[idx % SKILL_COLORS.length];
                      return (
                        <motion.div
                          key={skill._id}
                          className="pro-card flex flex-col items-center justify-center gap-3 py-5 text-center cursor-default"
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.02 }}
                          whileHover={{ y: -4, scale: 1.03 }}
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
                          >
                            {(skill.skillName || "?")[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm leading-tight" style={{ color: "var(--text)" }}>
                            {skill.skillName}
                          </span>
                          {skill.percentage !== undefined && (
                            <div className="w-full px-2">
                              <div className="skill-bar-track">
                                <motion.div
                                  className="skill-bar-fill"
                                  style={{ background: `linear-gradient(90deg, ${color}, ${color}bb)` }}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.percentage}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.9, ease: "easeOut" }}
                                />
                              </div>
                              <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
                                {skill.percentage}%
                              </p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;

import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { HiTrophy, HiSparkles } from "react-icons/hi2";

const ACCENT_COLORS = [
  { icon: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  { icon: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
  { icon: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  { icon: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
  { icon: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)"  },
];

function Recognition() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/recognition")
      .then((r) => setItems(r.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-wrap">
      <div className="section-inner">

        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="badge w-fit mx-auto"
               style={{ background: "rgba(245,158,11,0.1)", color: "#d97706", border: "1px solid rgba(245,158,11,0.25)" }}>
            <HiSparkles size={14} /> Honours & Milestones
          </div>
          <h2 className="section-title">Recognition &amp; Achievements</h2>
          <div className="section-line"
               style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
          <p className="max-w-xl mx-auto text-base" style={{ color: "var(--text-muted)" }}>
            Awards, highlights, and proud moments along the journey.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <HiTrophy size={48} className="mx-auto mb-4 opacity-20" />
            <p>No recognitions added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {items.map((item, idx) => {
              const c = ACCENT_COLORS[idx % ACCENT_COLORS.length];
              return (
                <motion.div
                  key={item._id}
                  className="pro-card group flex gap-4 items-start"
                  style={{ "--card-accent": c.icon }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -3, borderColor: c.border }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                       style={{ background: c.bg, color: c.icon, border: `1px solid ${c.border}` }}>
                    <HiTrophy size={22} />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="font-bold leading-tight" style={{ color: "var(--text)" }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Recognition;

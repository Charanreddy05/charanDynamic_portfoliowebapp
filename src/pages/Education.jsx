import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { HiAcademicCap, HiCalendarDays, HiBookOpen } from "react-icons/hi2";

function Education() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/education")
      .then((r) => setData(r.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-wrap">
      <div className="section-inner">

        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="badge badge-blue w-fit mx-auto">
            <HiAcademicCap size={14} /> Academic Background
          </div>
          <h2 className="section-title">Education</h2>
          <div className="section-line" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[1,2].map(i => <div key={i} className="skeleton h-44 rounded-xl" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <HiAcademicCap size={48} className="mx-auto mb-4 opacity-30" />
            <p>No education records added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {data.map((item, idx) => (
              <motion.div
                key={item._id}
                className="pro-card relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Decorative bg icon */}
                <HiAcademicCap
                  size={80}
                  className="absolute -right-4 -top-4 opacity-[0.04]"
                  style={{ color: "var(--accent)" }}
                />

                <div className="relative space-y-4">
                  {/* Top accent line */}
                  <div className="h-1 w-12 rounded-full mb-1"
                       style={{ background: "linear-gradient(90deg, var(--accent), #4f46e5)" }} />

                  <div>
                    <h3 className="text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                      {item.degree}
                    </h3>
                    <p className="text-sm font-semibold mt-1" style={{ color: "var(--accent)" }}>
                      {item.instituteName}
                    </p>
                  </div>

                  {item.fieldOfStudy && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                      <HiBookOpen size={15} /> {item.fieldOfStudy}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t"
                       style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                      <HiCalendarDays size={14} />
                      {item.startYear} — {item.endYear || "Present"}
                    </div>
                    {item.percentage && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                        {item.percentage}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Education;

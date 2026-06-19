import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { HiBriefcase, HiCalendarDays, HiMapPin } from "react-icons/hi2";

function Experience() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/experience")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-wrap">
      <div className="section-inner">

        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="badge badge-blue w-fit mx-auto">
            <HiBriefcase size={14} /> Career Journey
          </div>
          <h2 className="section-title">Work Experience</h2>
          <div className="section-line" />
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4 max-w-2xl mx-auto">
            {[1,2,3].map(i => <div key={i} className="skeleton h-36 w-full rounded-xl" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <HiBriefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p>No experience entries yet.</p>
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px"
                 style={{ background: "var(--border)" }} />

            <div className="space-y-8">
              {data.map((item, idx) => (
                <motion.div
                  key={item._id}
                  className="relative pl-14"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Dot */}
                  <div className="absolute left-0 top-5 w-10 h-10 rounded-full flex items-center justify-center text-white"
                       style={{
                         background: "linear-gradient(135deg, var(--accent), #4f46e5)",
                         boxShadow: "0 0 0 4px var(--bg), 0 0 0 6px var(--accent)",
                       }}>
                    <HiBriefcase size={18} />
                  </div>

                  {/* Card */}
                  <div className="pro-card space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                          {item.companyName}
                        </h3>
                        <p className="font-semibold text-sm" style={{ color: "var(--accent)" }}>
                          {item.designation}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                            style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
                        <HiCalendarDays size={13} />
                        {item.startDate} — {item.endDate || "Present"}
                      </span>
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                        <HiMapPin size={14} /> {item.location}
                      </div>
                    )}

                    {item.description && (
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;

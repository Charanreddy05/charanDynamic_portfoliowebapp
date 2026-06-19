import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { HiDocumentCheck, HiArrowTopRightOnSquare, HiCalendarDays } from "react-icons/hi2";

function Certificates() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/certificates")
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
            <HiDocumentCheck size={14} /> Credentials
          </div>
          <h2 className="section-title">Certificates</h2>
          <div className="section-line" />
          <p className="max-w-xl mx-auto text-base" style={{ color: "var(--text-muted)" }}>
            Professional certifications and courses I've completed.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <HiDocumentCheck size={48} className="mx-auto mb-4 opacity-30" />
            <p>No certificates added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item, idx) => (
              <motion.div
                key={item._id}
                className="pro-card group flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -3 }}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white mt-0.5"
                     style={{ background: "linear-gradient(135deg, var(--accent), #4f46e5)" }}>
                  <HiDocumentCheck size={20} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="font-bold text-sm leading-tight transition-colors group-hover:text-[var(--accent)]"
                      style={{ color: "var(--text)" }}>
                    {item.title}
                  </h3>
                  {item.issuer && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {item.issuer}
                    </p>
                  )}
                  {item.issueDate && (
                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <HiCalendarDays size={11} /> {item.issueDate}
                    </div>
                  )}
                </div>

                {/* View link */}
                {item.certificateUrl && (
                  <a
                    href={item.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "white"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    title="View Certificate"
                  >
                    <HiArrowTopRightOnSquare size={17} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Certificates;

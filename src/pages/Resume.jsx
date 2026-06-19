import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  HiArrowDownTray, HiCheck, HiDocumentText,
} from "react-icons/hi2";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TEMPLATES } from "../utils/resumeTemplates";

const strip = (url = "") => url.replace(/^https?:\/\//, "");

function Resume() {
  const [profile,      setProfile]      = useState({});
  const [skills,       setSkills]       = useState([]);
  const [experience,   setExperience]   = useState([]);
  const [education,    setEducation]    = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [recognition,  setRecognition]  = useState([]);
  const [dataLoaded,   setDataLoaded]   = useState(false);
  const [downloading,  setDownloading]  = useState(false);
  const [dlDone,       setDlDone]       = useState(false);
  const [template,     setTemplate]     = useState("classic");

  useEffect(() => {
    Promise.all([
      api.get("/profile"),
      api.get("/skills"),
      api.get("/experience"),
      api.get("/education"),
      api.get("/certificates"),
      api.get("/recognition"),
    ])
      .then(([p, sk, ex, ed, ce, re]) => {
        setProfile(p.data  || {});
        setSkills(sk.data  || []);
        setExperience(ex.data || []);
        setEducation(ed.data  || []);
        setCertificates(ce.data || []);
        setRecognition(re.data  || []);
      })
      .catch(console.error)
      .finally(() => setDataLoaded(true));
  }, []);

  const downloadPDF = async () => {
    setDownloading(true);
    setDlDone(false);
    try {
      const mod = await import("jspdf");
      const JsPDF = mod.jsPDF || mod.default;
      const doc = TEMPLATES[template].fn(JsPDF, {
        profile, skills, experience, education, certificates, recognition,
      });
      const fname = `${(profile.fullName || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
      doc.save(fname);
      setDlDone(true);
      setTimeout(() => setDlDone(false), 3000);
    } catch (err) {
      console.error("PDF error:", err);
      alert(`PDF generation failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="section-wrap">
        <div className="section-inner max-w-5xl mx-auto space-y-6">
          <div className="skeleton h-10 w-48 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)}
          </div>
          <div className="skeleton h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="section-wrap pb-20">
      <div className="section-inner max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
              Resume Builder
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Choose a template and download an ATS-friendly PDF
            </p>
          </div>

          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="pro-btn pro-btn-primary px-6 py-2.5 text-sm font-semibold flex items-center gap-2 relative"
          >
            {downloading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating…</>
            ) : dlDone ? (
              <><HiCheck size={18} /> Downloaded!</>
            ) : (
              <><HiArrowDownTray size={18} /> Download PDF</>
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        >
          {Object.entries(TEMPLATES).map(([key, tpl]) => {
            const active = template === key;
            return (
              <button
                key={key}
                onClick={() => setTemplate(key)}
                className="relative text-left p-4 rounded-xl transition-all duration-200"
                style={{
                  background: active
                    ? "linear-gradient(135deg, var(--accent), #4f46e5)"
                    : "var(--card-bg, white)",
                  border: active
                    ? "2px solid transparent"
                    : "2px solid var(--border)",
                  boxShadow: active
                    ? "0 8px 24px rgba(37,99,235,0.25)"
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  color: active ? "white" : "var(--text)",
                  cursor: "pointer",
                }}
              >
                {active && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <HiCheck size={12} className="text-white" />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    active ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/30"
                  }`}>
                    <HiDocumentText size={20} className={active ? "text-white" : "text-blue-500"} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{tpl.name}</p>
                    <p className={`text-xs mt-0.5 ${active ? "text-white/80" : ""}`} style={{ color: active ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
                      {tpl.desc}
                    </p>
                  </div>
                </div>

                <div className={`h-14 rounded-lg flex items-end px-3 py-2 mt-1 overflow-hidden ${
                  active ? "bg-white/10" : "bg-gray-50 dark:bg-gray-800/50"
                }`}>
                  {key === "classic" && (
                    <div className="w-full space-y-1.5">
                      <div className={`h-1.5 rounded-full w-3/5 ${active ? "bg-white/40" : "bg-gray-300 dark:bg-gray-600"}`} />
                      <div className={`h-1 rounded-full w-2/5 ${active ? "bg-white/25" : "bg-gray-200 dark:bg-gray-700"}`} />
                      <div className="flex gap-1.5 mt-1">
                        <div className={`h-1 rounded-full w-1/4 ${active ? "bg-white/20" : "bg-blue-200 dark:bg-blue-800"}`} />
                        <div className={`h-1 rounded-full w-1/5 ${active ? "bg-white/20" : "bg-blue-200 dark:bg-blue-800"}`} />
                        <div className={`h-1 rounded-full w-1/6 ${active ? "bg-white/20" : "bg-blue-200 dark:bg-blue-800"}`} />
                      </div>
                    </div>
                  )}
                  {key === "modern" && (
                    <div className="w-full flex gap-2">
                      <div className={`w-1/3 h-8 rounded ${active ? "bg-white/15" : "bg-gray-800/10 dark:bg-gray-700"}`} />
                      <div className="flex-1 space-y-1.5">
                        <div className={`h-1.5 rounded-full w-full ${active ? "bg-white/40" : "bg-gray-300 dark:bg-gray-600"}`} />
                        <div className={`h-1 rounded-full w-3/5 ${active ? "bg-white/25" : "bg-gray-200 dark:bg-gray-700"}`} />
                      </div>
                    </div>
                  )}
                  {key === "minimal" && (
                    <div className="w-full space-y-1.5">
                      <div className={`h-2 rounded-full w-1/2 mx-auto ${active ? "bg-white/30" : "bg-gray-300 dark:bg-gray-600"}`} />
                      <div className={`h-1 rounded-full w-2/5 mx-auto ${active ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`} />
                      <div className={`h-0.5 rounded-full w-full mt-1.5 ${active ? "bg-white/15" : "bg-gray-200 dark:bg-gray-700"}`} />
                      <div className={`h-1 rounded-full w-3/5 ${active ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            color: "#0f172a",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-3" style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
              {TEMPLATES[template].name} Template — Preview
            </span>
            <span className="text-xs" style={{ color: "#cbd5e1" }}>resume.pdf</span>
          </div>

          <div style={{ padding: "2.5rem 3rem", maxWidth: "820px", margin: "0 auto" }}>

            {template === "modern" ? (
              <ModernPreview profile={profile} skills={skills} experience={experience}
                education={education} certificates={certificates} recognition={recognition} />
            ) : template === "minimal" ? (
              <MinimalPreview profile={profile} skills={skills} experience={experience}
                education={education} certificates={certificates} recognition={recognition} />
            ) : (
              <ClassicPreview profile={profile} skills={skills} experience={experience}
                education={education} certificates={certificates} recognition={recognition} />
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ClassicPreview({ profile, skills, experience, education, certificates, recognition }) {
  return (
    <div>
      <div style={{ borderBottom: "2px solid #e2e8f0", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", margin: 0 }}>
          {profile.fullName || "—"}
        </h2>
        <p style={{ color: "#2563eb", fontWeight: 600, fontSize: "1rem", margin: "0.3rem 0 0.6rem" }}>
          {profile.designation}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "#64748b" }}>
          {profile.github && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><FaGithub size={13} /> {strip(profile.github)}</span>}
          {profile.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><FaLinkedin size={13} /> {strip(profile.linkedin)}</span>}
        </div>
      </div>

      {profile.about && (
        <PreviewSection title="Professional Summary">
          <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.9rem" }}>{profile.about}</p>
        </PreviewSection>
      )}

      {skills.length > 0 && (
        <PreviewSection title="Technical Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {skills.map(s => (
              <span key={s._id} style={{ padding: "0.2rem 0.7rem", borderRadius: "999px", background: "#eff6ff", color: "#2563eb", fontSize: "0.8rem", fontWeight: 600, border: "1px solid #bfdbfe" }}>
                {s.skillName || s.name}
              </span>
            ))}
          </div>
        </PreviewSection>
      )}

      {experience.length > 0 && (
        <PreviewSection title="Work Experience">
          {experience.map(item => (
            <div key={item._id} style={{ paddingLeft: "0.75rem", borderLeft: "3px solid #bfdbfe", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: "0.9rem" }}>{item.companyName}</p>
                  <p style={{ color: "#2563eb", fontWeight: 600, fontSize: "0.85rem", margin: "0.15rem 0 0" }}>
                    {item.designation}{item.location && <span style={{ color: "#94a3b8", fontWeight: 400 }}> · {item.location}</span>}
                  </p>
                </div>
                <span style={{ color: "#94a3b8", fontSize: "0.78rem", whiteSpace: "nowrap" }}>{item.startDate} – {item.endDate || "Present"}</span>
              </div>
              {item.description && <p style={{ color: "#64748b", fontSize: "0.84rem", lineHeight: 1.6, margin: "0.4rem 0 0" }}>{item.description}</p>}
            </div>
          ))}
        </PreviewSection>
      )}

      {education.length > 0 && (
        <PreviewSection title="Education">
          {education.map(item => (
            <div key={item._id} style={{ paddingLeft: "0.75rem", borderLeft: "3px solid #bfdbfe", marginBottom: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: "0.9rem" }}>{item.degree}</p>
                  <p style={{ color: "#475569", fontSize: "0.85rem", margin: "0.1rem 0 0" }}>
                    {item.instituteName}{item.fieldOfStudy && ` · ${item.fieldOfStudy}`}
                  </p>
                  {item.percentage && <p style={{ color: "#94a3b8", fontSize: "0.78rem", margin: "0.1rem 0 0" }}>Grade: {item.percentage}</p>}
                </div>
                <span style={{ color: "#94a3b8", fontSize: "0.78rem", whiteSpace: "nowrap" }}>{item.startYear} – {item.endYear || "Present"}</span>
              </div>
            </div>
          ))}
        </PreviewSection>
      )}

      {certificates.length > 0 && (
        <PreviewSection title="Certifications">
          {certificates.map(item => (
            <div key={item._id} style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", fontSize: "0.87rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "#2563eb", fontSize: "0.65rem", flexShrink: 0 }}>●</span>
              <span>
                <strong style={{ color: "#1e293b" }}>{item.title}</strong>
                {item.issuer && <span style={{ color: "#64748b" }}> — {item.issuer}</span>}
                {item.issueDate && <span style={{ color: "#94a3b8" }}> ({item.issueDate})</span>}
              </span>
            </div>
          ))}
        </PreviewSection>
      )}

      {recognition.length > 0 && (
        <PreviewSection title="Recognition & Achievements">
          {recognition.map(item => (
            <div key={item._id} style={{ marginBottom: "0.6rem" }}>
              <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: "0.88rem" }}>🏆 {item.title}</p>
              {item.description && <p style={{ color: "#64748b", fontSize: "0.84rem", margin: "0.2rem 0 0", lineHeight: 1.6 }}>{item.description}</p>}
            </div>
          ))}
        </PreviewSection>
      )}
    </div>
  );
}

function ModernPreview({ profile, skills, experience, education, certificates, recognition }) {
  return (
    <div style={{ display: "flex", gap: 0, margin: "-2.5rem -3rem" }}>
      <div style={{ width: "35%", background: "#1e293b", color: "white", padding: "2.5rem 1.5rem", flexShrink: 0 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 0.25rem", color: "white" }}>{profile.fullName || "—"}</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0 0 1.25rem" }}>{profile.designation}</p>

        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", color: "#64748b", margin: "0 0 0.5rem" }}>CONTACT</p>
        <div style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.8, marginBottom: "1.25rem" }}>
          {profile.email && <div>{profile.email}</div>}
          {profile.mobile && <div>{profile.mobile}</div>}
          {profile.github && <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>github: {strip(profile.github)}</div>}
          {profile.linkedin && <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>linkedin: {strip(profile.linkedin)}</div>}
        </div>

        {skills.length > 0 && (
          <>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", color: "#64748b", margin: "0 0 0.5rem" }}>SKILLS</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1.25rem" }}>
              {skills.map(s => (
                <span key={s._id} style={{ padding: "0.15rem 0.5rem", borderRadius: "4px", background: "rgba(255,255,255,0.08)", color: "#cbd5e1", fontSize: "0.75rem" }}>
                  {s.skillName || s.name}
                </span>
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", color: "#64748b", margin: "0 0 0.5rem" }}>EDUCATION</p>
            {education.map(item => (
              <div key={item._id} style={{ marginBottom: "0.6rem" }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "white", margin: 0 }}>{item.degree}</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.1rem 0 0" }}>{item.instituteName}</p>
                <p style={{ fontSize: "0.7rem", color: "#64748b", margin: 0 }}>{item.startYear} – {item.endYear || "Present"}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ flex: 1, padding: "2.5rem 2rem" }}>
        {profile.about && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>PROFESSIONAL SUMMARY</p>
            <div style={{ width: "30px", height: "2px", background: "#2563eb", marginBottom: "0.6rem" }} />
            <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.65, margin: 0 }}>{profile.about}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>EXPERIENCE</p>
            <div style={{ width: "30px", height: "2px", background: "#2563eb", marginBottom: "0.6rem" }} />
            {experience.map(item => (
              <div key={item._id} style={{ marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: "0.88rem" }}>{item.companyName}</p>
                  <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{item.startDate} – {item.endDate || "Present"}</span>
                </div>
                <p style={{ color: "#2563eb", fontSize: "0.8rem", fontWeight: 600, margin: "0.1rem 0 0" }}>{item.designation}</p>
                {item.description && <p style={{ color: "#64748b", fontSize: "0.82rem", lineHeight: 1.55, margin: "0.3rem 0 0" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}

        {certificates.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>CERTIFICATIONS</p>
            <div style={{ width: "30px", height: "2px", background: "#2563eb", marginBottom: "0.6rem" }} />
            {certificates.map(item => (
              <p key={item._id} style={{ color: "#475569", fontSize: "0.82rem", margin: "0 0 0.3rem" }}>
                • <strong style={{ color: "#1e293b" }}>{item.title}</strong>
                {item.issuer && <span style={{ color: "#64748b" }}> — {item.issuer}</span>}
              </p>
            ))}
          </div>
        )}

        {recognition.length > 0 && (
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>RECOGNITION</p>
            <div style={{ width: "30px", height: "2px", background: "#2563eb", marginBottom: "0.6rem" }} />
            {recognition.map(item => (
              <div key={item._id} style={{ marginBottom: "0.5rem" }}>
                <p style={{ fontWeight: 600, color: "#0f172a", margin: 0, fontSize: "0.85rem" }}>• {item.title}</p>
                {item.description && <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "0.15rem 0 0", lineHeight: 1.55 }}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalPreview({ profile, skills, experience, education, certificates, recognition }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 300, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
          {profile.fullName || "—"}
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem", margin: "0.4rem 0 0.6rem" }}>{profile.designation}</p>
        <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          {[profile.email, profile.mobile, profile.github && strip(profile.github), profile.linkedin && strip(profile.linkedin)].filter(Boolean).join("  |  ")}
        </div>
      </div>

      <div style={{ height: "1px", background: "#e2e8f0", marginBottom: "1.25rem" }} />

      {profile.about && (
        <MinimalSection title="About">
          <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{profile.about}</p>
        </MinimalSection>
      )}

      {skills.length > 0 && (
        <MinimalSection title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {skills.map(s => (
              <span key={s._id} style={{ color: "#475569", fontSize: "0.85rem" }}>
                {s.skillName || s.name}
              </span>
            ))}
          </div>
        </MinimalSection>
      )}

      {experience.length > 0 && (
        <MinimalSection title="Experience">
          {experience.map((item, i) => (
            <div key={item._id} style={{ marginBottom: i < experience.length - 1 ? "0.8rem" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 600, color: "#0f172a", margin: 0, fontSize: "0.9rem" }}>{item.companyName}</p>
                <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{item.startDate} – {item.endDate || "Present"}</span>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.83rem", margin: "0.1rem 0 0" }}>{item.designation}</p>
              {item.description && <p style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.55, margin: "0.3rem 0 0" }}>{item.description}</p>}
              {i < experience.length - 1 && <div style={{ height: "1px", background: "#f1f5f9", marginTop: "0.8rem" }} />}
            </div>
          ))}
        </MinimalSection>
      )}

      {education.length > 0 && (
        <MinimalSection title="Education">
          {education.map((item, i) => (
            <div key={item._id} style={{ marginBottom: i < education.length - 1 ? "0.6rem" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 600, color: "#0f172a", margin: 0, fontSize: "0.88rem" }}>{item.degree}</p>
                <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{item.startYear} – {item.endYear || "Present"}</span>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.83rem", margin: "0.1rem 0 0" }}>
                {item.instituteName}{item.fieldOfStudy && ` · ${item.fieldOfStudy}`}
                {item.percentage && <span style={{ color: "#94a3b8" }}> · Score: {item.percentage}</span>}
              </p>
            </div>
          ))}
        </MinimalSection>
      )}

      {certificates.length > 0 && (
        <MinimalSection title="Certificates">
          {certificates.map(item => (
            <p key={item._id} style={{ color: "#475569", fontSize: "0.84rem", margin: "0 0 0.3rem" }}>
              {item.title}{item.issuer && <span style={{ color: "#94a3b8" }}> — {item.issuer}</span>}
            </p>
          ))}
        </MinimalSection>
      )}

      {recognition.length > 0 && (
        <MinimalSection title="Recognition">
          {recognition.map(item => (
            <div key={item._id} style={{ marginBottom: "0.4rem" }}>
              <p style={{ fontWeight: 600, color: "#0f172a", margin: 0, fontSize: "0.85rem" }}>{item.title}</p>
              {item.description && <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "0.15rem 0 0", lineHeight: 1.55 }}>{item.description}</p>}
            </div>
          ))}
        </MinimalSection>
      )}
    </div>
  );
}

function PreviewSection({ title, children }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.7rem", paddingBottom: "0.35rem", borderBottom: "2px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2563eb", margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function MinimalSection({ title, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", margin: "0 0 0.5rem" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default Resume;

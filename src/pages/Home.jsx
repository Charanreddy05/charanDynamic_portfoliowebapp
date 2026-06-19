import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { setProfile } from "../redux/profileSlice";
import { motion } from "framer-motion";
import { HiArrowDownTray, HiEnvelope, HiArrowRight } from "react-icons/hi2";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Home() {
  const dispatch = useDispatch();
  const profile  = useSelector((s) => s.profile.profile);

  useEffect(() => {
    api.get("/profile")
      .then((res) => dispatch(setProfile(res.data)))
      .catch(() => {});
  }, [dispatch]);

  const scrollToContact = (e) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-wrap" style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center" }}>
      <div className="section-inner w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Photo column */}
          <motion.div
            className="lg:col-span-4 flex justify-center lg:justify-end order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-full"
                style={{ background: "linear-gradient(135deg, var(--accent), #4f46e5)", opacity: 0.15, filter: "blur(16px)" }} />
              <img
                src={profile?.profileImage || "https://ui-avatars.com/api/?name=Developer&size=320&background=2563eb&color=fff"}
                alt={profile?.fullName || "Profile"}
                className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full object-cover"
                style={{
                  border: "4px solid var(--surface)",
                  boxShadow: "0 20px 60px rgba(37,99,235,0.25), 0 4px 16px rgba(0,0,0,0.1)"
                }}
              />
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            className="lg:col-span-8 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="space-y-3">
              <p className="badge badge-blue w-fit mx-auto lg:mx-0">
                Available for opportunities
              </p>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1]"
                  style={{ color: "var(--text)" }}>
                Hi, I'm{" "}
                <span style={{ color: "var(--accent)" }}>
                  {profile?.fullName || "—"}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium" style={{ color: "var(--text-muted)" }}>
                {profile?.designation || "Developer"}
              </p>
            </div>

            <p className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
               style={{ color: "var(--text-muted)" }}>
              {profile?.about}
            </p>

            {/* Social links */}
            {(profile?.github || profile?.linkedin) && (
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                     style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                     onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accent-glow)"; }}
                     onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--surface-2)"; }}>
                    <FaGithub size={18} /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                     style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                     onMouseEnter={e => { e.currentTarget.style.color = "#0077b5"; e.currentTarget.style.background = "rgba(0,119,181,0.1)"; }}
                     onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--surface-2)"; }}>
                    <FaLinkedin size={18} /> LinkedIn
                  </a>
                )}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                   className="pro-btn pro-btn-primary px-7 py-3 text-base">
                  <HiArrowDownTray size={20} /> Download CV
                </a>
              )}
              <a href="#contact" onClick={scrollToContact}
                 className="pro-btn pro-btn-outline px-7 py-3 text-base">
                <HiEnvelope size={20} /> Hire Me <HiArrowRight size={16} />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Home;

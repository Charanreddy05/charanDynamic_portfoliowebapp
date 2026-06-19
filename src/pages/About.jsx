import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { setProfile } from "../redux/profileSlice";
import { motion } from "framer-motion";
import { HiCodeBracket, HiLightBulb, HiRocketLaunch, HiHeart } from "react-icons/hi2";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const cards = [
  {
    icon: <HiCodeBracket size={22} />,
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
    title: "Clean Code",
    body: "I write readable, maintainable code following industry best practices — because the next developer (or future me) will thank you.",
  },
  {
    icon: <HiLightBulb size={22} />,
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    title: "Problem Solver",
    body: "Complex challenges are my playground. I break them down, iterate, and always look for the elegant solution.",
  },
  {
    icon: <HiRocketLaunch size={22} />,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    title: "Fast Learner",
    body: "Technology evolves fast. I stay current by continuously learning new tools, frameworks, and methodologies.",
  },
  {
    icon: <HiHeart size={22} />,
    color: "#e11d48",
    bg: "rgba(225,29,72,0.08)",
    title: "User-Focused",
    body: "Great software starts with empathy. I always design with the end-user's experience and needs at the forefront.",
  },
];

function About() {
  const dispatch = useDispatch();
  const profile  = useSelector((s) => s.profile.profile);

  useEffect(() => {
    if (!profile?.fullName) {
      api.get("/profile")
        .then((r) => dispatch(setProfile(r.data)))
        .catch(() => {});
    }
  }, [dispatch, profile]);

  return (
    <section className="section-wrap">
      <div className="section-inner">

        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <h2 className="section-title">About Me</h2>
          <div className="section-line" />
        </div>

        {/* Bio + photo row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h3 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Hi, I'm{" "}
              <span style={{ color: "var(--accent)" }}>{profile?.fullName || "—"}</span>
            </h3>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {profile?.about ||
                "A passionate software engineer dedicated to building scalable, efficient, and user-centric digital experiences."}
            </p>

            {/* Social */}
            <div className="flex gap-3 flex-wrap">
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                   style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                   onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accent-glow)"; }}
                   onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--surface-2)"; }}>
                  <FaGithub size={18} /> GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                   style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                   onMouseEnter={e => { e.currentTarget.style.color = "#0077b5"; e.currentTarget.style.background = "rgba(0,119,181,0.08)"; }}
                   onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--surface-2)"; }}>
                  <FaLinkedin size={18} /> LinkedIn
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-3xl rotate-6 opacity-20"
                   style={{ background: "linear-gradient(135deg, var(--accent), #4f46e5)" }} />
              <img
                src={profile?.profileImage || "https://ui-avatars.com/api/?name=Dev&size=288&background=2563eb&color=fff"}
                alt={profile?.fullName || "Profile"}
                className="relative w-full h-full object-cover rounded-3xl"
                style={{ boxShadow: "var(--shadow-lg)" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Trait cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              className="pro-card space-y-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                   style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <h4 className="font-bold" style={{ color: "var(--text)" }}>{card.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;

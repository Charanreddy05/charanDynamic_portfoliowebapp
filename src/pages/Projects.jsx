import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { setProjects } from "../redux/projectSlice";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { HiArrowTopRightOnSquare, HiCodeBracket } from "react-icons/hi2";

function Projects() {
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.projects.projects);

  useEffect(() => {
    api.get("/projects")
      .then((r) => dispatch(setProjects(r.data)))
      .catch(() => {});
  }, [dispatch]);

  return (
    <section className="section-wrap">
      <div className="section-inner">

        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="badge badge-blue w-fit mx-auto">
            <HiCodeBracket size={14} /> Portfolio
          </div>
          <h2 className="section-title">Projects</h2>
          <div className="section-line" />
          <p className="max-w-xl mx-auto text-base" style={{ color: "var(--text-muted)" }}>
            A selection of things I've built and shipped.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="skeleton h-64 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                className="pro-card overflow-hidden flex flex-col group p-0"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                         style={{ color: "var(--text-muted)", opacity: 0.3 }}>
                      <HiCodeBracket size={56} />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h3 className="text-lg font-bold leading-tight transition-colors group-hover:text-[var(--accent)]"
                      style={{ color: "var(--text)" }}>
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t) => (
                        <span key={t} className="text-xs font-medium px-2 py-0.5 rounded-md"
                              style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2 pt-2 mt-auto">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                         className="pro-btn pro-btn-outline flex-1 py-2 text-sm gap-1.5">
                        <FaGithub size={16} /> GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                         className="pro-btn pro-btn-primary flex-1 py-2 text-sm gap-1.5">
                        <HiArrowTopRightOnSquare size={16} /> Live
                      </a>
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

export default Projects;

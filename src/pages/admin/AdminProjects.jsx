import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiPlus, HiCodeBracket, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import getTableStyles from "../../utils/tableStyles";

const EMPTY = { title: "", description: "", githubUrl: "", liveUrl: "", technologies: "", image: "" };

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [file, setFile]         = useState(null);
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading]   = useState(false);

  const fetchProjects = async () => {
    try { const r = await api.get("/projects"); setProjects(r.data); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { fetchProjects(); }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const addProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;
      if (file) {
        const fd = new FormData();
        fd.append("profileImage", file);   // reuse profile upload endpoint
        const res = await api.post("/upload/profile", fd);
        imageUrl = res.data.imageUrl;
      }
      // Convert comma-separated technologies string to array
      const technologies = formData.technologies
        ? formData.technologies.split(",").map(t => t.trim()).filter(Boolean)
        : [];
      await api.post("/projects", { ...formData, image: imageUrl, technologies });
      setFormData(EMPTY);
      setFile(null);
      fetchProjects();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try { await api.delete(`/projects/${id}`); fetchProjects(); }
    catch (e) { console.error(e); }
  };

  const Label = ({ children }) => (
    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>{children}</label>
  );

  const columns = [
    { name: "Title",       selector: r => r.title, sortable: true, grow: 2 },
    {
      name: "GitHub",
      cell: r => r.githubUrl
        ? <a href={r.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm"
             style={{ color: "var(--accent)" }}><FaGithub size={14} /> Link</a>
        : <span style={{ color: "var(--text-muted)" }}>—</span>,
      width: "90px",
    },
    {
      name: "Live",
      cell: r => r.liveUrl
        ? <a href={r.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm"
             style={{ color: "var(--accent)" }}><HiArrowTopRightOnSquare size={14} /> Link</a>
        : <span style={{ color: "var(--text-muted)" }}>—</span>,
      width: "90px",
    },
    {
      name: "Action",
      cell: r => <button className="btn-danger" onClick={() => deleteProject(r._id)}><HiTrash size={15} /> Delete</button>,
      width: "120px",
    },
  ];

  return (
    <div className="admin-page">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
               style={{ background: "linear-gradient(135deg, #0891b2, #2563eb)" }}>
            <HiCodeBracket size={20} />
          </div>
          <h1 className="admin-section-title">Manage Projects</h1>
        </div>

        <div className="pro-card space-y-5">
          <p className="admin-subsection-title">Add New Project</p>
          <form onSubmit={addProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Project Title</Label>
              <input className="form-input" name="title" value={formData.title} onChange={handleChange} placeholder="My Awesome Project" required />
            </div>
            <div>
              <Label>Technologies <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>(comma separated)</span></Label>
              <input className="form-input" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <input className="form-input" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/…" />
            </div>
            <div>
              <Label>Live URL (optional)</Label>
              <input className="form-input" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://myproject.vercel.app" />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                        className="admin-textarea" placeholder="What does this project do? What problem does it solve?" required />
            </div>
            <div>
              <Label>Project Image URL (optional)</Label>
              <input className="form-input" name="image" value={formData.image} onChange={handleChange} placeholder="https://…/screenshot.png" />
            </div>
            <div>
              <Label>Or Upload Image</Label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}
                     className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer"
                     style={{
                       color: "var(--text-muted)",
                       // file pseudo-element styles via inline is not possible — done via global CSS below
                     }} />
              {file && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{file.name}</p>}
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={loading} className="pro-btn pro-btn-primary px-8 h-[46px] flex items-center gap-2">
                <HiPlus size={18} /> {loading ? "Adding…" : "Add Project"}
              </button>
            </div>
          </form>
        </div>

        <div className="pro-card p-0 overflow-hidden">
          <DataTable columns={columns} data={projects} pagination highlightOnHover responsive
            noDataComponent={<div style={{ color: "var(--text-muted)", padding: "2rem", textAlign: "center" }}>No projects yet.</div>}
            customStyles={getTableStyles()} />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminProjects;

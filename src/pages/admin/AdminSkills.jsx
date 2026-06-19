import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiPlus, HiWrenchScrewdriver, HiPencilSquare } from "react-icons/hi2";
import getTableStyles from "../../utils/tableStyles";

const CATEGORIES = [
  "Frontend", "Backend", "Database", "DevOps",
  "Deployment", "Version Control", "Testing",
  "Mobile", "UI/UX", "Tools", "Other",
];

const CATEGORY_COLORS = {
  Frontend: "#2563eb",
  Backend: "#059669",
  Database: "#d97706",
  DevOps: "#7c3aed",
  Deployment: "#0891b2",
  "Version Control": "#dc2626",
  Testing: "#16a34a",
  Mobile: "#9333ea",
  "UI/UX": "#ca8a04",
  Tools: "#0284c7",
  Other: "#6b7280",
};

function AdminSkills() {
  const [skillName, setSkillName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchSkills = async () => {
    try { const res = await api.get("/skills"); setSkills(res.data); }
    catch (err) { console.error(err); }
  };
  useEffect(() => { fetchSkills(); }, []);

  const resetForm = () => {
    setSkillName(""); setPercentage(""); setCategory(CATEGORIES[0]); setCustomCategory(""); setEditId(null);
  };

  const getEffectiveCategory = () => category === "Other" ? customCategory.trim() || "Other" : category;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setLoading(true);
    try {
      const payload = { skillName, category: getEffectiveCategory(), ...(percentage ? { percentage: Number(percentage) } : {}) };
      if (editId) {
        await api.put(`/skills/${editId}`, payload);
      } else {
        await api.post("/skills", payload);
      }
      resetForm();
      fetchSkills();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const editSkill = (skill) => {
    setSkillName(skill.skillName);
    setPercentage(skill.percentage ?? "");
    const cat = skill.category || "Other";
    if (CATEGORIES.includes(cat)) {
      setCategory(cat);
      setCustomCategory("");
    } else {
      setCategory("Other");
      setCustomCategory(cat);
    }
    setEditId(skill._id);
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try { await api.delete(`/skills/${id}`); fetchSkills(); }
    catch (err) { console.error(err); }
  };

  const columns = [
    { name: "Skill", selector: (r) => r.skillName, sortable: true, grow: 2 },
    {
      name: "Category",
      selector: (r) => r.category || "Other",
      sortable: true,
      width: "150px",
      cell: (r) => {
        const cat = r.category || "Other";
        const bg = CATEGORY_COLORS[cat] || "#6b7280";
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                style={{ background: bg }}>
            {cat}
          </span>
        );
      },
    },
    {
      name: "Level",
      cell: (r) => r.percentage != null
        ? <div className="w-28 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--surface-2)" }}>
              <div style={{ width: `${r.percentage}%`, height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, var(--accent), #4f46e5)" }} />
            </div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{r.percentage}%</span>
          </div>
        : <span style={{ color: "var(--text-muted)" }}>—</span>,
      width: "160px",
    },
    {
      name: "Action",
      cell: (r) => (
        <div className="flex gap-2">
          <button className="btn-ghost p-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                  onClick={() => editSkill(r)} title="Edit">
            <HiPencilSquare size={15} style={{ color: "var(--text-muted)" }} />
          </button>
          <button className="btn-danger" onClick={() => deleteSkill(r._id)}>
            <HiTrash size={15} /> Delete
          </button>
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="admin-page">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
               style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
            <HiWrenchScrewdriver size={20} />
          </div>
          <h1 className="admin-section-title">Manage Skills</h1>
        </div>

        <div className="pro-card space-y-5">
          <p className="admin-subsection-title">{editId ? "Edit Skill" : "Add New Skill"}</p>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px] space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Skill Name</label>
              <input className="form-input" value={skillName} onChange={e => setSkillName(e.target.value)}
                     placeholder="e.g. React, Node.js" required />
            </div>
            <div className="w-44 space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Category</label>
              <select className="form-input" value={category} onChange={e => { setCategory(e.target.value); if (e.target.value !== "Other") setCustomCategory(""); }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {category === "Other" && (
                <input className="form-input mt-2" value={customCategory}
                       onChange={e => setCustomCategory(e.target.value)}
                       placeholder="Enter custom category name" required />
              )}
            </div>
            <div className="w-32 space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Level % (optional)</label>
              <input className="form-input" type="number" min="0" max="100" value={percentage}
                     onChange={e => setPercentage(e.target.value)} placeholder="e.g. 85" />
            </div>
            <div className="flex gap-2">
              {editId && (
                <button type="button" onClick={resetForm}
                        className="pro-btn h-[46px] px-4" style={{ border: "1px solid var(--border)" }}>
                  Cancel
                </button>
              )}
              <button type="submit" disabled={loading}
                      className="pro-btn pro-btn-primary h-[46px] px-6 flex items-center gap-2">
                <HiPlus size={18} /> {loading ? "Saving…" : editId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>

        <div className="pro-card p-0 overflow-hidden">
          <DataTable columns={columns} data={skills} pagination highlightOnHover responsive
            defaultSortFieldId={1}
            noDataComponent={<div style={{ color: "var(--text-muted)", padding: "2rem", textAlign: "center" }}>No skills yet.</div>}
            customStyles={getTableStyles()} />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminSkills;

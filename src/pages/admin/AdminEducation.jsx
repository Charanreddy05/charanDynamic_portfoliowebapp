import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiPlus, HiAcademicCap } from "react-icons/hi2";
import getTableStyles from "../../utils/tableStyles";

const EMPTY = { degree: "", instituteName: "", fieldOfStudy: "", startYear: "", endYear: "", percentage: "" };

function AdminEducation() {
  const [education, setEducation] = useState([]);
  const [formData, setFormData]   = useState(EMPTY);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    api.get("/education").then(r => setEducation(r.data)).catch(console.error);
  }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const addEducation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post("/education", formData); setFormData(EMPTY); api.get("/education").then(r => setEducation(r.data)).catch(console.error); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteEducation = async (id) => {
    if (!window.confirm("Delete this education record?")) return;
    try { await api.delete(`/education/${id}`); api.get("/education").then(r => setEducation(r.data)).catch(console.error); }
    catch (e) { console.error(e); }
  };

  const columns = [
    { name: "Degree",    selector: r => r.degree,        sortable: true, grow: 1 },
    { name: "Institute", selector: r => r.instituteName, sortable: true, grow: 2 },
    { name: "Field",     selector: r => r.fieldOfStudy || "—", grow: 1 },
    { name: "Period",    cell: r => <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{r.startYear} — {r.endYear || "Present"}</span>, width: "150px" },
    {
      name: "Action",
      cell: r => <button className="btn-danger" onClick={() => deleteEducation(r._id)}><HiTrash size={15} /> Delete</button>,
      width: "120px",
    },
  ];

  return (
    <div className="admin-page">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
               style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
            <HiAcademicCap size={20} />
          </div>
          <h1 className="admin-section-title">Manage Education</h1>
        </div>

        <div className="pro-card space-y-5">
          <p className="admin-subsection-title">Add New Qualification</p>
          <form onSubmit={addEducation} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Degree</Label>
              <input className="form-input" name="degree" value={formData.degree} onChange={handleChange} placeholder="B.Tech / MCA / MBA…" required />
            </div>
            <div>
              <Label>Institute</Label>
              <input className="form-input" name="instituteName" value={formData.instituteName} onChange={handleChange} placeholder="University / College name" required />
            </div>
            <div>
              <Label>Field of Study</Label>
              <input className="form-input" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} placeholder="Computer Science" />
            </div>
            <div>
              <Label>Grade / Percentage (optional)</Label>
              <input className="form-input" name="percentage" value={formData.percentage} onChange={handleChange} placeholder="e.g. 8.5 CGPA / 88%" />
            </div>
            <div>
              <Label>Start Year</Label>
              <input className="form-input" name="startYear" type="number" value={formData.startYear} onChange={handleChange} placeholder="2020" required />
            </div>
            <div>
              <Label>End Year <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>(leave empty if current)</span></Label>
              <input className="form-input" name="endYear" type="number" value={formData.endYear} onChange={handleChange} placeholder="2024" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={loading} className="pro-btn pro-btn-primary px-8 h-[46px] flex items-center gap-2">
                <HiPlus size={18} /> {loading ? "Adding…" : "Add Education"}
              </button>
            </div>
          </form>
        </div>

        <div className="pro-card p-0 overflow-hidden">
          <DataTable columns={columns} data={education} pagination highlightOnHover responsive
            noDataComponent={<div style={{ color: "var(--text-muted)", padding: "2rem", textAlign: "center" }}>No education records yet.</div>}
            customStyles={getTableStyles()} />
        </div>
      </motion.div>
    </div>
  );
}

const Label = ({ children }) => (
  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>{children}</label>
);

export default AdminEducation;

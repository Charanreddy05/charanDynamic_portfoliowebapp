import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiPlus, HiBriefcase } from "react-icons/hi2";
import getTableStyles from "../../utils/tableStyles";

const EMPTY = { companyName: "", designation: "", startDate: "", endDate: "", location: "", description: "" };


  const Label = ({ children }) => (
    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>{children}</label>
  );
  const Input = (props) => <input {...props} className="form-input" />;


function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData]       = useState(EMPTY);
  const [loading, setLoading]         = useState(false);

  const fetchExperiences = async () => {
    try { const r = await api.get("/experience"); setExperiences(r.data); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { fetchExperiences(); }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const addExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post("/experience", formData); setFormData(EMPTY); fetchExperiences(); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try { await api.delete(`/experience/${id}`); fetchExperiences(); }
    catch (e) { console.error(e); }
  };

  const columns = [
    { name: "Company",    selector: r => r.companyName, sortable: true, grow: 1 },
    { name: "Role",       selector: r => r.designation, sortable: true, grow: 1 },
    { name: "Period",     cell: r => <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{r.startDate} — {r.endDate || "Present"}</span>, grow: 1 },
    {
      name: "Action",
      cell: r => <button className="btn-danger" onClick={() => deleteExperience(r._id)}><HiTrash size={15} /> Delete</button>,
      width: "120px",
    },
  ];

  return (
    <div className="admin-page">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
               style={{ background: "linear-gradient(135deg, #d97706, #ea580c)" }}>
            <HiBriefcase size={20} />
          </div>
          <h1 className="admin-section-title">Manage Experience</h1>
        </div>

        <div className="pro-card space-y-5">
          <p className="admin-subsection-title">Add New Experience</p>
          <form onSubmit={addExperience} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-0">
              <Label>Company Name</Label>
              <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Google, Microsoft…" required />
            </div>
            <div>
              <Label>Designation</Label>
              <Input name="designation" value={formData.designation} onChange={handleChange} placeholder="Software Engineer" required />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div>
              <Label>End Date <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>(leave empty if current)</span></Label>
              <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </div>
            <div>
              <Label>Location (optional)</Label>
              <Input name="location" value={formData.location} onChange={handleChange} placeholder="Hyderabad, India" />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                        className="admin-textarea" placeholder="Key responsibilities and achievements…" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={loading} className="pro-btn pro-btn-primary px-8 h-[46px] flex items-center gap-2">
                <HiPlus size={18} /> {loading ? "Adding…" : "Add Experience"}
              </button>
            </div>
          </form>
        </div>

        <div className="pro-card p-0 overflow-hidden">
          <DataTable columns={columns} data={experiences} pagination highlightOnHover responsive
            noDataComponent={<div style={{ color: "var(--text-muted)", padding: "2rem", textAlign: "center" }}>No experience entries yet.</div>}
            customStyles={getTableStyles()} />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminExperience;

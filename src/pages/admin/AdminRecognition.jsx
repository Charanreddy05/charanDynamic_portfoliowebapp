import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiPlus, HiTrophy } from "react-icons/hi2";
import FormInput from "../../components/FormInput";

function AdminRecognition() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [formData, setFormData]   = useState({ title: "", description: "", image: "" });

  const fetchItems = async () => {
    try {
      const res = await api.get("/recognition");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching recognition:", error);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addItem = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    setLoading(true);
    try {
      await api.post("/recognition", formData);
      setFormData({ title: "", description: "", image: "" });
      await fetchItems();
    } catch (error) {
      console.error(error);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this recognition / achievement?")) return;
    try {
      await api.delete(`/recognition/${id}`);
      await fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      grow: 2,
    },
    {
      name: "Description",
      selector: (row) => row.description ? row.description.slice(0, 60) + (row.description.length > 60 ? "…" : "") : "—",
      grow: 3,
    },
    {
      name: "Action",
      cell: (row) => (
        <button onClick={() => deleteItem(row._id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-600 hover:text-white transition-all text-sm font-medium">
          <HiTrash size={16} /> Delete
        </button>
      ),
      width: "140px",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
            <HiTrophy size={22} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-main)]">Recognition & Achievements</h1>
        </div>

        <div className="pro-card space-y-6">
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-400">Add New Entry</h2>
          <form onSubmit={addItem} className="grid grid-cols-1 gap-4">
            <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Best Innovation Award 2024" required />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent text-[var(--text-main)] focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[100px] resize-none"
                placeholder="Brief description of this recognition or achievement..." />
            </div>

            <FormInput label="Image URL (optional)" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/award-image.jpg" />

            <div>
              <button type="submit" disabled={loading}
                className="pro-btn pro-btn-primary px-8 h-[50px] flex items-center gap-2">
                <HiPlus size={20} /> {loading ? "Adding..." : "Add Entry"}
              </button>
            </div>
          </form>
        </div>

        <div className="pro-card overflow-hidden">
          <DataTable columns={columns} data={items} pagination highlightHdr responsive
            noDataComponent={<div className="p-6 text-center text-slate-500">No recognitions or achievements yet.</div>}
            customStyles={{
              headRow: { style: { backgroundColor: "var(--border-color)", color: "var(--text-main)" } },
              row: { style: { borderBottomColor: "var(--border-color)" } },
            }} />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminRecognition;

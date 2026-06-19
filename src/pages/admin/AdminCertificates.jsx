import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiPlus, HiArrowTopRightOnSquare } from "react-icons/hi2";
import FormInput from "../../components/FormInput";

function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [file, setFile]                 = useState(null);
  const [loading, setLoading]           = useState(false);
  const [formData, setFormData]         = useState({ title: "", issuer: "", issueDate: "", certificateUrl: "" });

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates");
      setCertificates(res.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  useEffect(() => { fetchCertificates(); }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addCertificate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    setLoading(true);
    try {
      let certUrl = formData.certificateUrl;
      if (file) {
        const uploadData = new FormData();
        uploadData.append("certificate", file);
        const uploadRes = await api.post("/upload/certificate", uploadData);
        certUrl = uploadRes.data.certificateUrl;
      }
      await api.post("/certificates", { ...formData, certificateUrl: certUrl });
      setFormData({ title: "", issuer: "", issueDate: "", certificateUrl: "" });
      setFile(null);
      await fetchCertificates();
    } catch (error) {
      console.error(error);
      alert("Failed to add certificate");
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await api.delete(`/certificates/${id}`);
      await fetchCertificates();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { name: "Title",  selector: (row) => row.title,  sortable: true, grow: 2 },
    { name: "Issuer", selector: (row) => row.issuer || "—", sortable: true },
    { name: "Date",   selector: (row) => row.issueDate || "—", width: "120px" },
    {
      name: "Link",
      cell: (row) =>
        row.certificateUrl ? (
          <a href={row.certificateUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
            <HiArrowTopRightOnSquare size={14} /> View
          </a>
        ) : <span className="text-slate-400 text-sm">—</span>,
      width: "90px",
    },
    {
      name: "Action",
      cell: (row) => (
        <button onClick={() => deleteCertificate(row._id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-600 hover:text-white transition-all text-sm font-medium">
          <HiTrash size={16} /> Delete
        </button>
      ),
      width: "130px",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[var(--text-main)]">Manage Certificates</h1>

        <div className="pro-card space-y-6">
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-400">Add New Certificate</h2>
          <form onSubmit={addCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Title"   name="title"      value={formData.title}      onChange={handleChange} placeholder="e.g. AWS Certified Developer" required />
            <FormInput label="Issuer"  name="issuer"     value={formData.issuer}     onChange={handleChange} placeholder="e.g. Amazon Web Services" />
            <FormInput label="Date"    name="issueDate"  value={formData.issueDate}  onChange={handleChange} placeholder="e.g. Jan 2024" />
            <FormInput label="Certificate URL (or upload below)" name="certificateUrl" value={formData.certificateUrl} onChange={handleChange} placeholder="https://..." />

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload Certificate File (optional)</label>
              <input type="file" accept=".pdf,image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-slate-700 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 transition-all" />
              {file && <span className="text-xs text-blue-600">{file.name}</span>}
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={loading}
                className="pro-btn pro-btn-primary px-8 h-[50px] flex items-center gap-2">
                <HiPlus size={20} /> {loading ? "Adding..." : "Add Certificate"}
              </button>
            </div>
          </form>
        </div>

        <div className="pro-card overflow-hidden">
          <DataTable columns={columns} data={certificates} pagination highlightHdr responsive
            noDataComponent={<div className="p-6 text-center text-slate-500">No certificates found.</div>}
            customStyles={{
              headRow: { style: { backgroundColor: "var(--surface-2)", color: "var(--text)" } },
              row: { style: { borderBottomColor: "var(--border-color)" } },
            }} />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminCertificates;

import { useState, useEffect } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { HiPhoto, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import FormInput from "../../components/FormInput";

function AdminProfile() {
  const [formData, setFormData] = useState({
    fullName: "", designation: "", about: "",
    profileImage: "", resumeUrl: "", github: "", linkedin: "",
  });
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: true });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data) setFormData(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", ok: true });

    try {
      let imageUrl = formData.profileImage;

      if (file) {
        const uploadData = new FormData();
        uploadData.append("profileImage", file);
        const uploadRes = await api.post("/upload/profile", uploadData);
        imageUrl = uploadRes.data.imageUrl;
      }

      // BUG FIX: PUT /profile (no ID) — backend finds the single user automatically
      await api.put("/profile", { ...formData, profileImage: imageUrl });
      setMessage({ text: "Profile updated successfully!", ok: true });
      setFile(null);
      setPreview(null);
      fetchProfile();
    } catch {
      setMessage({ text: "Failed to update profile. Please try again.", ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[var(--text-main)]">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400">Update your public portfolio information</p>
        </div>

        <div className="pro-card space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <img
                src={preview || formData.profileImage || "https://ui-avatars.com/api/?name=Admin&size=128"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-md">
                <HiPhoto size={20} />
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
            {file && <span className="text-sm text-blue-600 font-medium">{file.name}</span>}
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name"    name="fullName"    value={formData.fullName}    onChange={handleChange} placeholder="Your Name"                   required />
            <FormInput label="Designation"  name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Full Stack Developer"    required />
            <FormInput label="GitHub URL"   name="github"      value={formData.github || ""} onChange={handleChange} placeholder="https://github.com/username" />
            <FormInput label="LinkedIn URL" name="linkedin"    value={formData.linkedin || ""} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            <FormInput label="Resume URL"   name="resumeUrl"   value={formData.resumeUrl || ""} onChange={handleChange} placeholder="https://example.com/resume.pdf" />

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent text-[var(--text-main)] focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[120px] resize-none"
                placeholder="Describe yourself..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="pro-btn pro-btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
                ) : "Save Profile"}
              </button>
            </div>
          </form>

          {message.text && (
            <div className={`flex items-center gap-3 p-4 rounded-xl font-medium ${
              message.ok ? "bg-green-50 dark:bg-green-900/20 text-green-700" : "bg-red-50 dark:bg-red-900/20 text-red-600"
            }`}>
              {message.ok ? <HiCheckCircle size={20} /> : <HiXCircle size={20} />}
              {message.text}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminProfile;

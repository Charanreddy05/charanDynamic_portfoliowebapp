import { useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { HiEnvelope, HiUser, HiPhone, HiChatBubbleLeftRight, HiPaperAirplane, HiCheckCircle } from "react-icons/hi2";

function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", mobile: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/contact", form);
      setSent(true);
      setForm({ name: "", email: "", mobile: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-wrap" id="contact">
      <div className="section-inner">

        {/* Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="badge badge-blue w-fit mx-auto">
            <HiEnvelope size={14} /> Get in touch
          </div>
          <h2 className="section-title">Contact Me</h2>
          <div className="section-line" />
          <p className="max-w-lg mx-auto text-base" style={{ color: "var(--text-muted)" }}>
            Have a project in mind or just want to say hi? Send me a message and I'll get back to you soon.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pro-card text-center py-14 space-y-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white"
                   style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                <HiCheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>Message Sent!</h3>
              <p style={{ color: "var(--text-muted)" }}>
                Thanks for reaching out. I'll get back to you as soon as possible.
              </p>
              <button className="pro-btn pro-btn-outline mt-4" onClick={() => setSent(false)}>
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pro-card space-y-5"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field icon={<HiUser size={14} />}  label="Full Name"  name="name"    required placeholder="John Doe" form={form} onChange={handleChange} />
                  <Field icon={<HiPhone size={14} />}  label="Mobile"     name="mobile"  placeholder="+91 9876543210" form={form} onChange={handleChange} />
                </div>
                <Field icon={<HiEnvelope size={14} />} label="Email Address" name="email" type="email" required placeholder="john@example.com" form={form} onChange={handleChange} />
                <Field icon={<HiChatBubbleLeftRight size={14} />} label="Message" name="message" required placeholder="Tell me about your project or inquiry…" multiline form={form} onChange={handleChange} />

                {error && (
                  <div className="p-3 rounded-lg text-sm text-center font-medium"
                       style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.18)" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="pro-btn pro-btn-primary w-full py-3 text-base">
                  {loading
                    ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                    : <><HiPaperAirplane size={18} /> Send Message</>
                  }
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

const Field = ({ icon, label, name, type = "text", required, placeholder, multiline, form, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text)" }}>
      <span style={{ color: "var(--text-muted)" }}>{icon}</span> {label}
    </label>
    {multiline ? (
      <textarea name={name} value={form[name]} onChange={onChange} required={required}
                className="admin-textarea" style={{ minHeight: "130px" }} placeholder={placeholder} />
    ) : (
      <input type={type} name={name} value={form[name]} onChange={onChange} required={required}
             className="form-input" placeholder={placeholder} />
    )}
  </div>
);

export default Contact;

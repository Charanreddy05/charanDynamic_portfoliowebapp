import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiUserPlus, HiUser, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiCheckBadge } from "react-icons/hi2";
import api from "../services/api";

function Signup() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState("");

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      setSuccess(res.data.message || "Account created! Waiting for admin approval.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="pro-card p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                 style={{ background: "rgba(5,150,105,0.1)" }}>
              <HiCheckBadge size={36} style={{ color: "#059669" }} />
            </div>
            <h1 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>Account Created!</h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {success}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              You'll be able to sign in once an admin approves your account.
            </p>
            <Link to="/login" className="pro-btn pro-btn-primary inline-block px-8 py-2.5 text-sm font-medium no-underline">
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="pro-card p-8 space-y-7">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                 style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              <HiUserPlus size={26} />
            </div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Create Account</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Register as an administrator</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Full Name</label>
              <div className="relative">
                <HiUser size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                       className="form-input pl-9" placeholder="John Doe" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Email Address</label>
              <div className="relative">
                <HiEnvelope size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                       className="form-input pl-9" placeholder="admin@portfolio.com" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Password</label>
              <div className="relative">
                <HiLockClosed size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type={showPw ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                       className="form-input pl-9 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {showPw ? <HiEyeSlash size={17} /> : <HiEye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm text-center font-medium"
                   style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.18)" }}>
                {error}
              </div>
            )}

            <div className="p-3 rounded-lg text-xs leading-relaxed"
                 style={{ background: "rgba(37,99,235,0.06)", color: "var(--text-muted)", border: "1px solid rgba(37,99,235,0.12)" }}>
              After signing up, an admin needs to approve your account before you can sign in.
            </div>

            <button type="submit" disabled={loading} className="pro-btn pro-btn-primary w-full py-3 text-base">
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold" style={{ color: "var(--accent)" }}>Login here</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";
import api from "../services/api";
import { motion } from "framer-motion";
import { HiLockClosed, HiEnvelope, HiEye, HiEyeSlash, HiExclamationTriangle } from "react-icons/hi2";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, authReady } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authReady && isLoggedIn) {
      navigate("/admin", { replace: true });
    }
  }, [authReady, isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="pro-card p-8 space-y-7">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                 style={{ background: "linear-gradient(135deg, var(--accent), #4f46e5)" }}>
              <HiLockClosed size={26} />
            </div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Admin Login</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Email Address</label>
              <div className="relative">
                <HiEnvelope size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                       className="form-input pl-9" placeholder="admin@portfolio.com" required autoComplete="email" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Password</label>
              <div className="relative">
                <HiLockClosed size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type={showPw ? "text" : "password"} value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="form-input pl-9 pr-10" placeholder="••••••••" required autoComplete="current-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => setShowPw((v) => !v)}>
                  {showPw ? <HiEyeSlash size={17} /> : <HiEye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm text-center font-medium flex items-center gap-2 justify-center"
                   style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.18)" }}>
                <HiExclamationTriangle size={16} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="pro-btn pro-btn-primary w-full py-3 text-base">
              {loading
                ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                : "Sign In"
              }
            </button>

            <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold" style={{ color: "var(--accent)" }}>Create one</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;

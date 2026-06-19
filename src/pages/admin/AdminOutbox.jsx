import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { HiShieldCheck, HiCheckBadge, HiXCircle } from "react-icons/hi2";

function AdminOutbox() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOutbox = () => {
    setLoading(true);
    api.get("/admin/approval/outbox")
      .then(res => setRequests(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOutbox(); }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
          Approval Outbox
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          History of approved and rejected admin accounts
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="pro-card p-12 text-center space-y-3">
          <HiShieldCheck size={40} className="mx-auto" style={{ color: "var(--text-muted)" }} />
          <p className="font-medium" style={{ color: "var(--text)" }}>No history yet</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Approved and rejected accounts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req._id} className="pro-card flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  req.status === "approved" ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"
                }`}>
                  {(req.adminId?.fullName || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{req.adminId?.fullName}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{req.adminId?.email}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Resolved {new Date(req.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {req.status === "approved" ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
                    <HiCheckBadge size={14} /> Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
                    <HiXCircle size={14} /> Rejected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default AdminOutbox;

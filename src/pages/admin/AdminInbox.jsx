import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { HiArchiveBoxArrowDown, HiCheck, HiXMark } from "react-icons/hi2";

function AdminInbox() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = () => {
    setLoading(true);
    api.get("/admin/approval/inbox")
      .then(res => setRequests(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInbox(); }, []);

  const handleApprove = (id) => {
    api.put(`/admin/approval/${id}/approve`)
      .then(() => fetchInbox())
      .catch(() => {});
  };

  const handleReject = (id) => {
    api.put(`/admin/approval/${id}/reject`)
      .then(() => fetchInbox())
      .catch(() => {});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
          Approval Inbox
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Pending admin account approvals
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="pro-card p-12 text-center space-y-3">
          <HiArchiveBoxArrowDown size={40} className="mx-auto" style={{ color: "var(--text-muted)" }} />
          <p className="font-medium" style={{ color: "var(--text)" }}>No pending approvals</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>All admin accounts have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req._id} className="pro-card flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {(req.adminId?.fullName || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{req.adminId?.fullName}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{req.adminId?.email}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Requested {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleApprove(req.adminId?._id)}
                  className="pro-btn flex items-center gap-1.5 text-sm px-3 py-2"
                  style={{ background: "rgba(5,150,105,0.1)", color: "#059669", border: "1px solid rgba(5,150,105,0.2)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(5,150,105,0.1)"; e.currentTarget.style.color = "#059669"; }}>
                  <HiCheck size={16} /> Approve
                </button>
                <button onClick={() => handleReject(req.adminId?._id)}
                  className="pro-btn flex items-center gap-1.5 text-sm px-3 py-2"
                  style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.18)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.08)"; e.currentTarget.style.color = "#dc2626"; }}>
                  <HiXMark size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default AdminInbox;

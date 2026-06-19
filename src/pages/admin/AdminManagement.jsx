import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { HiUsers, HiTrash, HiLockClosed, HiLockOpen, HiCog6Tooth, HiCheck } from "react-icons/hi2";

const ALL_PERMISSIONS = [
  { key: "profile", label: "Profile" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "certificates", label: "Certificates" },
  { key: "recognition", label: "Recognition" },
  { key: "menus", label: "Menus" },
  { key: "messages", label: "Messages" },
];

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPerms, setEditPerms] = useState(null);

  const fetchAdmins = () => {
    setLoading(true);
    api.get("/admin/admins")
      .then(res => setAdmins(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const toggleBlock = (id) => {
    api.put(`/admin/admins/${id}/block`)
      .then(() => fetchAdmins())
      .catch(() => {});
  };

  const deleteAdmin = (id, name) => {
    if (!window.confirm(`Delete admin "${name}"? This cannot be undone.`)) return;
    api.delete(`/admin/admins/${id}`)
      .then(() => fetchAdmins())
      .catch(() => {});
  };

  const savePermissions = (id) => {
    api.put(`/admin/admins/${id}/permissions`, { permissions: editPerms.permissions })
      .then(() => { setEditPerms(null); fetchAdmins(); })
      .catch(() => {});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
          Admin Management
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Manage admin accounts, permissions, and access
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : admins.length === 0 ? (
        <div className="pro-card p-12 text-center space-y-3">
          <HiUsers size={40} className="mx-auto" style={{ color: "var(--text-muted)" }} />
          <p className="font-medium" style={{ color: "var(--text)" }}>No admins yet</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Admins will appear here after approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => {
            const isPending = admin.status === "pending";
            const isBlocked = admin.status === "blocked";

            return (
              <div key={admin._id} className="pro-card overflow-hidden">
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isPending ? "bg-gradient-to-br from-yellow-500 to-orange-500" :
                      isBlocked ? "bg-gradient-to-br from-red-500 to-rose-600" :
                      "bg-gradient-to-br from-blue-500 to-indigo-600"
                    }`}>
                      {(admin.fullName || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{admin.fullName}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{admin.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isPending ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" :
                          isBlocked ? "text-red-600 bg-red-50 dark:bg-red-900/20" :
                          "text-green-600 bg-green-50 dark:bg-green-900/20"
                        }`}>
                          {isPending ? "Pending" : isBlocked ? "Blocked" : "Active"}
                        </span>
                        {admin.permissions?.length > 0 && (
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {admin.permissions.length} section{admin.permissions.length > 1 ? "s" : ""} allowed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setEditPerms({
                      id: admin._id,
                      name: admin.fullName,
                      permissions: [...(admin.permissions || [])],
                    })}
                      className="pro-btn flex items-center gap-1.5 text-sm px-3 py-2"
                      style={{ border: "1px solid var(--border)" }}
                      title="Manage permissions">
                      <HiCog6Tooth size={15} /> Permissions
                    </button>
                    <button onClick={() => toggleBlock(admin._id)}
                      className="pro-btn flex items-center gap-1.5 text-sm px-3 py-2"
                      style={{
                        background: isBlocked ? "rgba(5,150,105,0.1)" : "rgba(220,38,38,0.08)",
                        color: isBlocked ? "#059669" : "#dc2626",
                        border: `1px solid ${isBlocked ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.18)"}`,
                      }}>
                      {isBlocked ? <HiLockOpen size={15} /> : <HiLockClosed size={15} />}
                      {isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button onClick={() => deleteAdmin(admin._id, admin.fullName)}
                      className="pro-btn flex items-center gap-1.5 text-sm px-3 py-2"
                      style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.18)" }}>
                      <HiTrash size={15} /> Delete
                    </button>
                  </div>
                </div>

                {editPerms?.id === admin._id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4" style={{ background: "var(--surface-2)" }}>
                    <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>
                      Permissions for {editPerms.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_PERMISSIONS.map((perm) => {
                        const isSelected = editPerms.permissions.includes(perm.key);
                        return (
                          <button key={perm.key} onClick={() => {
                            const perms = editPerms.permissions.includes(perm.key)
                              ? editPerms.permissions.filter(p => p !== perm.key)
                              : [...editPerms.permissions, perm.key];
                            setEditPerms({ ...editPerms, permissions: perms });
                          }}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                              isSelected
                                ? "text-white"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                            style={{
                              background: isSelected ? "var(--accent)" : "transparent",
                              border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                              color: isSelected ? "white" : "var(--text-muted)",
                            }}>
                            {perm.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => savePermissions(admin._id)}
                        className="pro-btn pro-btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                        <HiCheck size={14} /> Save Permissions
                      </button>
                      <button onClick={() => setEditPerms(null)}
                        className="pro-btn text-xs px-4 py-1.5" style={{ border: "1px solid var(--border)" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default AdminManagement;

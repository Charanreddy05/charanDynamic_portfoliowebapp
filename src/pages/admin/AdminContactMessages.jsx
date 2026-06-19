import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiInbox, HiEnvelope, HiPhone, HiUser } from "react-icons/hi2";
import getTableStyles from "../../utils/tableStyles";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try { const r = await api.get("/contact"); setMessages(r.data); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { fetchMessages(); }, []);

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try { await api.delete(`/contact/${id}`); fetchMessages(); }
    catch (e) { console.error(e); }
  };

  const columns = [
    { name: "Name",    selector: r => r.name,  sortable: true, grow: 1,
      cell: r => <span className="flex items-center gap-1.5" style={{ color: "var(--text)" }}><HiUser size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />{r.name}</span> },
    { name: "Email",   selector: r => r.email, sortable: true, grow: 1,
      cell: r => <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--accent)" }}><HiEnvelope size={13} />{r.email}</a> },
    { name: "Mobile",  selector: r => r.mobile || "—", width: "130px",
      cell: r => r.mobile ? <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-muted)" }}><HiPhone size={13} />{r.mobile}</span> : <span style={{ color: "var(--text-muted)" }}>—</span> },
    { name: "Message", selector: r => r.message, grow: 3,
      cell: r => <span className="text-sm py-2 leading-relaxed" style={{ color: "var(--text-muted)", whiteSpace: "normal" }}>{r.message}</span> },
    {
      name: "Action",
      cell: r => <button className="btn-danger" onClick={() => deleteMessage(r._id)}><HiTrash size={15} /> Delete</button>,
      width: "110px",
    },
  ];

  return (
    <div className="admin-page">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                 style={{ background: "linear-gradient(135deg, #0891b2, #0284c7)" }}>
              <HiInbox size={20} />
            </div>
            <h1 className="admin-section-title">Contact Messages</h1>
          </div>
          {messages.length > 0 && (
            <span className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="pro-card p-0 overflow-hidden">
          <DataTable columns={columns} data={messages} pagination highlightOnHover responsive
            noDataComponent={
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <HiInbox size={40} style={{ color: "var(--text-muted)", opacity: 0.3, margin: "0 auto 1rem" }} />
                <p style={{ color: "var(--text-muted)" }}>No contact messages yet.</p>
              </div>
            }
            customStyles={getTableStyles()} />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminContactMessages;

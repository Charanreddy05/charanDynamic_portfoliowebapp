import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { setMenus } from "../../redux/menuSlice";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import { HiTrash, HiPlus, HiListBullet } from "react-icons/hi2";
import getTableStyles from "../../utils/tableStyles";

const EMPTY = { menuName: "", menuPath: "", order: "" };

function AdminMenus() {
  const dispatch = useDispatch();
  const menus    = useSelector((s) => s.menu.menus);
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading]   = useState(false);

  const fetchMenus = async () => {
    try { const r = await api.get("/menu"); dispatch(setMenus(r.data)); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { fetchMenus(); }, [dispatch]);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const addMenu = async (e) => {
    e.preventDefault();
    if (!formData.menuName.trim() || !formData.menuPath.trim()) return;
    setLoading(true);
    try {
      await api.post("/menu", {
        ...formData,
        order: formData.order ? Number(formData.order) : menus.length,
      });
      setFormData(EMPTY);
      fetchMenus();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteMenu = async (id) => {
    if (!window.confirm("Remove this menu item?")) return;
    try { await api.delete(`/menu/${id}`); fetchMenus(); }
    catch (e) { console.error(e); }
  };

  const Label = ({ children }) => (
    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>{children}</label>
  );

  const columns = [
    { name: "#",    selector: r => r.order ?? "—", width: "60px", style: { color: "var(--text-muted)" } },
    { name: "Name", selector: r => r.menuName, sortable: true, grow: 1 },
    { name: "Path", selector: r => r.menuPath, grow: 1,
      cell: r => <code className="text-sm px-2 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>{r.menuPath}</code> },
    {
      name: "Action",
      cell: r => <button className="btn-danger" onClick={() => deleteMenu(r._id)}><HiTrash size={15} /> Remove</button>,
      width: "120px",
    },
  ];

  const EXAMPLES = [
    { name: "Home",        path: "/home"        },
    { name: "About",       path: "/about"       },
    { name: "Skills",      path: "/skills"      },
    { name: "Projects",    path: "/projects"    },
    { name: "Experience",  path: "/experience"  },
    { name: "Education",   path: "/education"   },
    { name: "Certificates",path: "/certificates"},
    { name: "Recognition", path: "/recognition" },
    { name: "Contact",     path: "/contact"     },
    { name: "Resume",      path: "/resume"      },
  ];

  return (
    <div className="admin-page">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
               style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
            <HiListBullet size={20} />
          </div>
          <h1 className="admin-section-title">Navigation Menus</h1>
        </div>

        {/* Quick add from presets */}
        <div className="pro-card space-y-4">
          <p className="admin-subsection-title">Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button key={ex.path}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                onClick={() => setFormData({ menuName: ex.name, menuPath: ex.path, order: "" })}>
                + {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Manual form */}
        <div className="pro-card space-y-5">
          <p className="admin-subsection-title">Add Custom Menu Item</p>
          <form onSubmit={addMenu} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Display Name</Label>
              <input className="form-input" name="menuName" value={formData.menuName}
                     onChange={handleChange} placeholder="e.g. Portfolio" required />
            </div>
            <div>
              <Label>Path</Label>
              <input className="form-input" name="menuPath" value={formData.menuPath}
                     onChange={handleChange} placeholder="e.g. /projects" required />
            </div>
            <div>
              <Label>Order (optional)</Label>
              <input className="form-input" name="order" type="number" value={formData.order}
                     onChange={handleChange} placeholder="1, 2, 3…" />
            </div>
            <div className="sm:col-span-3">
              <button type="submit" disabled={loading} className="pro-btn pro-btn-primary px-8 h-[46px] flex items-center gap-2">
                <HiPlus size={18} /> {loading ? "Adding…" : "Add Menu Item"}
              </button>
            </div>
          </form>
        </div>

        <div className="pro-card p-0 overflow-hidden">
          <DataTable columns={columns} data={menus} highlightOnHover responsive
            noDataComponent={<div style={{ color: "var(--text-muted)", padding: "2rem", textAlign: "center" }}>No menu items. Add some above.</div>}
            customStyles={getTableStyles()} />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminMenus;

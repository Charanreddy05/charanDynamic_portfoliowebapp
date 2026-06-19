import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout   from "../layouts/MainLayout";
import AdminLayout  from "../layouts/AdminLayout";
import SinglePage   from "../pages/SinglePage";
import ProtectedRoute from "../components/ProtectedRoute";
import Login        from "../pages/Login";
import Signup       from "../pages/Signup";
import Resume       from "../pages/Resume";

// Admin
import AdminDashboard        from "../pages/admin/AdminDashboard";
import AdminProfile          from "../pages/admin/AdminProfile";
import AdminSkills           from "../pages/admin/AdminSkills";
import AdminProjects         from "../pages/admin/AdminProjects";
import AdminExperience       from "../pages/admin/AdminExperience";
import AdminEducation        from "../pages/admin/AdminEducation";
import AdminCertificates     from "../pages/admin/AdminCertificates";
import AdminRecognition      from "../pages/admin/AdminRecognition";
import AdminContactMessages  from "../pages/admin/AdminContactMessages";
import AdminMenus            from "../pages/admin/AdminMenus";
import AdminInbox            from "../pages/admin/AdminInbox";
import AdminOutbox           from "../pages/admin/AdminOutbox";
import AdminManagement       from "../pages/admin/AdminManagement";

const AR = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<MainLayout><SinglePage /></MainLayout>} />
      <Route path="/resume"  element={<MainLayout><Resume /></MainLayout>} />

      {/* Auth */}
      <Route path="/login"   element={<Login />} />
      <Route path="/signup"  element={<Signup />} />

      {/* Hash-section redirects */}
      <Route path="/home"         element={<Navigate to="/#home"         replace />} />
      <Route path="/about"        element={<Navigate to="/#about"        replace />} />
      <Route path="/skills"       element={<Navigate to="/#skills"       replace />} />
      <Route path="/projects"     element={<Navigate to="/#projects"     replace />} />
      <Route path="/experience"   element={<Navigate to="/#experience"   replace />} />
      <Route path="/education"    element={<Navigate to="/#education"    replace />} />
      <Route path="/certificates" element={<Navigate to="/#certificates" replace />} />
      <Route path="/recognition"  element={<Navigate to="/#recognition"  replace />} />
      <Route path="/contact"      element={<Navigate to="/#contact"      replace />} />

      {/* Admin — all protected */}
      <Route path="/admin"                element={<AR><AdminDashboard /></AR>} />
      <Route path="/admin/profile"        element={<AR><AdminProfile /></AR>} />
      <Route path="/admin/skills"         element={<AR><AdminSkills /></AR>} />
      <Route path="/admin/projects"       element={<AR><AdminProjects /></AR>} />
      <Route path="/admin/experience"     element={<AR><AdminExperience /></AR>} />
      <Route path="/admin/education"      element={<AR><AdminEducation /></AR>} />
      <Route path="/admin/certificates"   element={<AR><AdminCertificates /></AR>} />
      <Route path="/admin/recognition"    element={<AR><AdminRecognition /></AR>} />
      <Route path="/admin/messages"       element={<AR><AdminContactMessages /></AR>} />
      <Route path="/admin/menus"          element={<AR><AdminMenus /></AR>} />
      <Route path="/admin/inbox"          element={<AR><AdminInbox /></AR>} />
      <Route path="/admin/outbox"         element={<AR><AdminOutbox /></AR>} />
      <Route path="/admin/management"     element={<AR><AdminManagement /></AR>} />
    </Routes>
  );
}

export default AppRoutes;

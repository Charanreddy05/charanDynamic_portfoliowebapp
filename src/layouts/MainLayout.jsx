import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-slate-950 min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        isSidebarOpen={sidebarOpen}
      />

      {/* Mobile-only sidebar drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      {/* Main content — pushed below fixed navbar */}
      <div className="page-wrapper">
        <main className="page-content">
          {children}
        </main>
        <Footer />
      </div>

      {/* ChatBot component */}
      <ChatBot />
    </div>
  );
}

export default MainLayout;

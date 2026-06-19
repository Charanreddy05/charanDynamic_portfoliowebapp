import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authReady, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.status === "pending") {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  if (user?.status === "blocked") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
        <div className="pro-card p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
               style={{ background: "rgba(220,38,38,0.1)" }}>
            <svg className="w-8 h-8" style={{ color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>Account Blocked</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Your account has been blocked. Please contact the super admin for more information.
          </p>
          <a href="/login" className="pro-btn pro-btn-primary inline-block px-6 py-2.5 text-sm font-medium no-underline">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

import { useSelector } from "react-redux";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiEnvelope } from "react-icons/hi2";

function Footer() {
  const profile = useSelector((s) => s.profile?.profile);
  const year    = new Date().getFullYear();

  const links = [
    profile?.github   && { href: profile.github,   icon: <FaGithub size={18} />,   label: "GitHub"   },
    profile?.linkedin && { href: profile.linkedin,  icon: <FaLinkedin size={18} />, label: "LinkedIn" },
  ].filter(Boolean);

  return (
    <footer className="footer" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="section-inner">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">

          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
              {profile?.fullName || "Portfolio"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {profile?.designation || "Developer"}
            </p>
          </div>

          {/* Social icons */}
          {links.length > 0 && (
            <div className="flex items-center gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accent-glow)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--surface-2)"; }}
                >
                  {l.icon}
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {year} {profile?.fullName || "Portfolio"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

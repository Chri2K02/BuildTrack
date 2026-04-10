import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, Users, Briefcase, FileText } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/invoices", label: "Invoices", icon: FileText },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user } = useUser();

  return (
    <div className="min-h-screen flex bg-[#f4f5f7]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d1117] flex flex-col shrink-0 fixed h-full z-10">
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">BuildTrack</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded text-sm transition-all",
                location.pathname === to
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              )}
            >
              <Icon size={16} className={location.pathname === to ? "text-orange-400" : ""} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <UserButton afterSignOutUrl="/" />
            <div className="min-w-0">
              <p className="text-gray-300 text-xs font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-600 text-xs truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Page */}
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <main className="flex-1 p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

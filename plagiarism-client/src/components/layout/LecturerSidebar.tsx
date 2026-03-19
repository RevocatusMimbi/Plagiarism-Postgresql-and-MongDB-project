import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Home, BookOpen, Users, FileSearch, FileText, User, LogOut, ChevronLeft,
} from "lucide-react";

const navItems = [
  { heading: "Dashboard" },
  { label: "My Dashboard", icon: Home, path: "/lecturer" },
  { heading: "Courses" },
  { label: "My Courses", icon: BookOpen, path: "/lecturer/courses" },
  { label: "My Students", icon: Users, path: "/lecturer/students" },
  { heading: "Plagiarism" },
  { label: "Check Similarity", icon: FileSearch, path: "/lecturer/similarity" },
  { label: "Reports", icon: FileText, path: "/lecturer/reports" },
  { heading: "Account" },
  { label: "My Profile", icon: User, path: "/lecturer/profile" },
];

export function LecturerSidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <span className="font-display text-lg font-bold tracking-widest text-sidebar-primary-foreground">
            R O A P C
          </span>
        )}
        <button
          onClick={toggleCollapsed}
          className="rounded-md p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="mt-2 flex flex-col justify-between overflow-y-auto px-3" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="space-y-0.5">
          {navItems.map((item, i) => {
            if ("heading" in item && !("label" in item)) {
              if (collapsed) return null;
              return (
                <p key={i} className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-heading">
                  {item.heading}
                </p>
              );
            }
            if (!("label" in item)) return null;
            const isActive = location.pathname === item.path;
            const Icon = item.icon!;
            return (
              <Link
                key={i}
                to={item.path!}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mb-4">
          {!collapsed && user && (
            <div className="mb-3 rounded-lg bg-sidebar-accent/30 px-3 py-2">
              <p className="text-xs font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/50">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}

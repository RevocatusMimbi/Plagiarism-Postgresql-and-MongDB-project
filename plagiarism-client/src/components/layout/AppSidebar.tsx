import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserPlus,
  Users,
  Network,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  FileSearch,
  BookOpen,
  FileText,
  Shield,
  LayoutDashboard,
} from "lucide-react";

export type UserRole = "admin" | "lecturer" | "student";

interface NavItem {
  heading?: string;
  label?: string;
  icon?: React.ElementType;
  path?: string;
}

// Admin navigation items
const adminNavItems: NavItem[] = [
  { heading: "Main" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { heading: "Management" },
  { label: "Faculties", icon: Network, path: "/admin/faculties" },
  { label: "Departments", icon: BookOpen, path: "/admin/departments" },
  { label: "Lecturers", icon: UserPlus, path: "/admin/lecturers" },
  { label: "Students", icon: Users, path: "/admin/students" },
  { heading: "Plagiarism" },
  { label: "Check Similarity", icon: FileSearch, path: "/admin/plagiarism" },
  { label: "Submissions", icon: FileText, path: "/admin/submissions" },
  { heading: "System" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
  { heading: "Account" },
  { label: "Profile", icon: User, path: "/admin/profile" },
  { label: "Logout", icon: LogOut, path: "/logout" },
];

// Lecturer navigation items
const lecturerNavItems: NavItem[] = [
  { heading: "Main" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/lecturer/dashboard" },
  { heading: "Courses" },
  { label: "My Courses", icon: BookOpen, path: "/lecturer/courses" },
  { label: "Assignments", icon: FileText, path: "/lecturer/assignments" },
  { heading: "Plagiarism" },
  { label: "Check Similarity", icon: FileSearch, path: "/lecturer/plagiarism" },
  { label: "Submissions", icon: FileText, path: "/lecturer/submissions" },
  { heading: "Account" },
  { label: "Profile", icon: User, path: "/lecturer/profile" },
  { label: "Logout", icon: LogOut, path: "/logout" },
];

// Student navigation items
const studentNavItems: NavItem[] = [
  { heading: "Main" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { heading: "Courses" },
  { label: "My Courses", icon: BookOpen, path: "/student/courses" },
  { heading: "Assignments" },
  { label: "Submit Work", icon: FileText, path: "/student/submit" },
  { label: "My Submissions", icon: FileText, path: "/student/submissions" },
  { heading: "Plagiarism" },
  { label: "Check My Work", icon: FileSearch, path: "/student/check" },
  { heading: "Account" },
  { label: "Profile", icon: User, path: "/student/profile" },
  { label: "Logout", icon: LogOut, path: "/logout" },
];

interface AppSidebarProps {
  role: UserRole;
  userName: string;
}

export function AppSidebar({ role, userName }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Get navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return adminNavItems;
      case "lecturer":
        return lecturerNavItems;
      case "student":
        return studentNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  // Get role display name and color
  const getRoleInfo = () => {
    switch (role) {
      case "admin":
        return { label: "Administrator", color: "text-red-400", bgColor: "bg-red-500/10" };
      case "lecturer":
        return { label: "Lecturer", color: "text-blue-400", bgColor: "bg-blue-500/10" };
      case "student":
        return { label: "Student", color: "text-green-400", bgColor: "bg-green-500/10" };
      default:
        return { label: "User", color: "text-gray-400", bgColor: "bg-gray-500/10" };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-900/50 px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-wider text-white">
                ROAPC
              </span>
              <p className="text-[10px] tracking-widest text-slate-400">
                Plagiarism Checker
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-700/50 hover:text-white"
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="border-b border-slate-700/50 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleInfo.bgColor} ${roleInfo.color}`}
              >
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className="mt-2 space-y-1 overflow-y-auto px-3 py-2"
        style={{ height: "calc(100vh - 12rem)" }}
      >
        {navItems.map((item, i) => {
          if ("heading" in item && !("label" in item)) {
            if (collapsed) return null;
            return (
              <p
                key={i}
                className="mb-2 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
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
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border-l-4 border-indigo-500"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`h-[20px] w-[20px] shrink-0 transition-colors ${
                  isActive
                    ? "text-indigo-400"
                    : "text-slate-400 group-hover:text-indigo-300"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 bg-slate-900/50 p-4">
        {!collapsed ? (
          <p className="text-center text-xs text-slate-500">
            ROAPC v1.0 • © {new Date().getFullYear()}
          </p>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}

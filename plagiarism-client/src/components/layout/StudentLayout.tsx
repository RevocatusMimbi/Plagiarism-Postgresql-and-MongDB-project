import { StudentSidebar } from "./StudentSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { collapsed } = useSidebar();
  const initials = user ? user.name.split(" ").map((n) => n[0]).join("") : "ST";

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-[3px] border-accent bg-header-bg px-6">
          <span className="font-display text-base font-semibold tracking-wide text-header-fg">
            Student Portal
          </span>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-header-fg/60 transition-colors hover:bg-sidebar-accent hover:text-header-fg">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-header-fg">{user?.name}</p>
                <p className="text-xs text-header-fg/50">{user?.regNo}</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-accent/30">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
        <footer className="border-t border-border bg-card px-6 py-3">
          <p className="text-right text-xs text-muted-foreground">
            ROAPC | Copyright © {new Date().getFullYear()} All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

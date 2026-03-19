import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-[3px] border-accent bg-header-bg px-6">
      <div className="flex items-center gap-3">
        <span className="font-display text-base font-semibold tracking-wide text-header-fg">
          RUCU Offline Assignments Plagiarism Checker
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="rounded-lg p-2 text-header-fg/60 transition-colors hover:bg-sidebar-accent hover:text-header-fg">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-header-fg/60 transition-colors hover:bg-sidebar-accent hover:text-header-fg">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-header-fg">Admin User</p>
            <p className="text-xs text-header-fg/50">Admin of the system</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-accent/30">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              AU
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

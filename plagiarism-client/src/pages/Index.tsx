import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Network, Users, GraduationCap, Home } from "lucide-react";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Index = () => {
  const isLoading = usePageLoading();

  useEffect(() => {
    if (!isLoading) {
      toast({ title: "Dashboard Loaded", description: "Welcome to the admin dashboard." });
    }
  }, [isLoading]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <Home className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Overview of the system</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatCard title="Faculties" subtitle="Total Number of Faculties" value={12} icon={Network} gradient="midnight" link="/faculty" />
            <StatCard title="Students" subtitle="Total Registered Students" value={348} icon={Users} gradient="asteroid" link="/students" />
            <StatCard title="Lectures" subtitle="Total Registered Lectures" value={45} icon={GraduationCap} gradient="royal" link="/lectures" />
          </div>

          <div className="mt-8 rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Recent Plagiarism Checks</h2>
            <div className="space-y-3">
              {[
                { student: "John Doe", course: "Database Systems", similarity: 23, status: "Pass" },
                { student: "Jane Smith", course: "Software Engineering", similarity: 67, status: "Flag" },
                { student: "Mike Johnson", course: "Data Structures", similarity: 12, status: "Pass" },
                { student: "Sarah Wilson", course: "Computer Networks", similarity: 89, status: "Fail" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.student}</p>
                    <p className="text-xs text-muted-foreground">{item.course}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-foreground">{item.similarity}%</p>
                      <p className="text-xs text-muted-foreground">similarity</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Pass" ? "bg-emerald-100 text-emerald-700"
                        : item.status === "Flag" ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Index;

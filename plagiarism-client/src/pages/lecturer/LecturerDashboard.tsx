import { LecturerLayout } from "@/components/layout/LecturerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileSearch, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const LecturerDashboard = () => {
  const { user } = useAuth();
  const isLoading = usePageLoading();

  useEffect(() => {
    if (!isLoading) {
      toast({ title: "Dashboard Ready", description: `Welcome back, ${user?.name}!` });
    }
  }, [isLoading]);

  const stats = [
    { label: "My Courses", value: 4, icon: BookOpen, color: "gradient-midnight", link: "/lecturer/courses" },
    { label: "My Students", value: 86, icon: Users, color: "gradient-asteroid", link: "/lecturer/students" },
    { label: "Checks Run", value: 23, icon: FileSearch, color: "gradient-royal", link: "/lecturer/similarity" },
    { label: "Reports", value: 18, icon: FileText, color: "gradient-love-kiss", link: "/lecturer/reports" },
  ];

  const recentChecks = [
    { student: "Alice Mwanga", course: "Database Systems", similarity: 15, status: "Pass" },
    { student: "Bob Kamau", course: "Database Systems", similarity: 42, status: "Flag" },
    { student: "Carol Lyimo", course: "Software Engineering", similarity: 89, status: "Fail" },
    { student: "David Masika", course: "Data Structures", similarity: 8, status: "Pass" },
  ];

  return (
    <LecturerLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Welcome, {user?.name}</h1>
              <p className="text-sm text-muted-foreground">Lecturer Dashboard — Overview of your courses and checks</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {stats.map((s) => (
              <Link key={s.label} to={s.link} className={`${s.color} block overflow-hidden rounded-xl shadow-elevated transition-transform hover:scale-[1.02]`}>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <s.icon className="h-5 w-5 text-accent" />
                    <p className="mt-2 text-xs text-primary-foreground/60">{s.label}</p>
                  </div>
                  <span className="font-display text-3xl font-bold text-primary-foreground">{s.value}</span>
                </div>
              </Link>
            ))}
          </div>

          <Card className="mt-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardHeader><CardTitle className="font-display text-lg">Recent Plagiarism Checks</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentChecks.map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.student}</p>
                      <p className="text-xs text-muted-foreground">{r.course}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg font-bold text-foreground">{r.similarity}%</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        r.status === "Pass" ? "bg-emerald-100 text-emerald-700"
                        : r.status === "Flag" ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                      }`}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </LecturerLayout>
  );
};

export default LecturerDashboard;

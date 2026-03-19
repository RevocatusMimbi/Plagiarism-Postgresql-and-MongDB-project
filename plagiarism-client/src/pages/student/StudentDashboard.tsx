import { StudentLayout } from "@/components/layout/StudentLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const isLoading = usePageLoading();

  useEffect(() => {
    if (!isLoading) {
      toast({ title: "Dashboard Ready", description: `Welcome back, ${user?.name}!` });
    }
  }, [isLoading]);

  const stats = [
    { label: "Submissions", value: 5, icon: Upload, color: "gradient-midnight" },
    { label: "Checked", value: 3, icon: CheckCircle, color: "gradient-asteroid" },
    { label: "Pending", value: 2, icon: Clock, color: "gradient-royal" },
  ];

  const recentResults = [
    { course: "Database Systems", date: "2026-03-10", similarity: 15, status: "Pass" },
    { course: "Software Engineering", date: "2026-03-08", similarity: 42, status: "Flag" },
    { course: "Data Structures", date: "2026-03-05", similarity: 8, status: "Pass" },
  ];

  return (
    <StudentLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Welcome, {user?.name}</h1>
              <p className="text-sm text-muted-foreground">Registration: {user?.regNo} — Here's your assignment overview</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {stats.map((s) => (
              <div key={s.label} className={`${s.color} overflow-hidden rounded-xl shadow-elevated`}>
                <div className="flex items-center justify-between p-6">
                  <div>
                    <s.icon className="h-6 w-6 text-accent" />
                    <p className="mt-2 text-xs text-primary-foreground/60">{s.label}</p>
                  </div>
                  <span className="font-display text-4xl font-bold text-primary-foreground">{s.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 animate-in fade-in duration-700">
            <Link to="/student/submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-elevated transition-colors hover:bg-primary/90">
              <Upload className="h-4 w-4" /> Submit New Assignment
            </Link>
          </div>

          <Card className="mt-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardHeader><CardTitle className="font-display text-lg">Recent Results</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.course}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
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
    </StudentLayout>
  );
};

export default StudentDashboard;

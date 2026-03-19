import { StudentLayout } from "@/components/layout/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { TableLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const results = [
  { id: 1, course: "Database Systems", title: "Normalization Report", date: "2026-03-10", similarity: 15, status: "Pass" },
  { id: 2, course: "Software Engineering", title: "Agile Methodology Essay", date: "2026-03-08", similarity: 42, status: "Flag" },
  { id: 3, course: "Data Structures", title: "Binary Trees Assignment", date: "2026-03-05", similarity: 8, status: "Pass" },
  { id: 4, course: "Computer Networks", title: "TCP/IP Protocol Analysis", date: "2026-02-28", similarity: 72, status: "Fail" },
  { id: 5, course: "Operating Systems", title: "Process Scheduling", date: "2026-02-20", similarity: 5, status: "Pass" },
];

const StudentResults = () => {
  const isLoading = usePageLoading();

  return (
    <StudentLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">My Results</h1>
          <p className="text-sm text-muted-foreground">View your plagiarism check results</p>
        </div>
      </div>

      {isLoading ? <TableLoader /> : (
        <Card className="shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader><CardTitle className="font-display text-lg">All Results</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assignment</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Similarity</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{r.course}</td>
                      <td className="px-4 py-3 text-foreground">{r.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                      <td className="px-4 py-3 text-center font-display font-bold text-foreground">{r.similarity}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          r.status === "Pass" ? "bg-emerald-100 text-emerald-700"
                            : r.status === "Flag" ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </StudentLayout>
  );
};

export default StudentResults;

import { LecturerLayout } from "@/components/layout/LecturerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download } from "lucide-react";
import { useState } from "react";
import { TableLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";
import { toast } from "@/hooks/use-toast";

const reportData = [
  { id: 1, student: "Alice Mwanga", regNo: "283/BSC.SE/T/2018", course: "Database Systems", similarity: 15, status: "Pass", date: "2026-03-10" },
  { id: 2, student: "Bob Kamau", regNo: "102/BSC.CS/T/2019", course: "Database Systems", similarity: 42, status: "Flag", date: "2026-03-08" },
  { id: 3, student: "Carol Lyimo", regNo: "045/BSC.IT/T/2020", course: "Software Engineering", similarity: 89, status: "Fail", date: "2026-03-05" },
  { id: 4, student: "David Masika", regNo: "120/BSC.SE/T/2019", course: "Data Structures", similarity: 8, status: "Pass", date: "2026-02-28" },
  { id: 5, student: "Eve Mushi", regNo: "089/BSC.CS/T/2020", course: "Software Engineering", similarity: 55, status: "Flag", date: "2026-02-20" },
];

const LecturerReports = () => {
  const [search, setSearch] = useState("");
  const isLoading = usePageLoading();

  const filtered = reportData.filter(
    (r) => r.student.toLowerCase().includes(search.toLowerCase()) || r.regNo.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = (data: typeof reportData) => {
    const header = "Student,Reg No,Course,Similarity,Status,Date";
    const rows = data.map((r) => `${r.student},${r.regNo},${r.course},${r.similarity}%,${r.status},${r.date}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plagiarism-reports.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "CSV downloaded successfully." });
  };

  return (
    <LecturerLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Plagiarism check reports for your courses</p>
        </div>
      </div>

      {isLoading ? <TableLoader /> : (
        <Card className="shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">All Reports</CardTitle>
            <div className="flex items-center gap-3">
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
              <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reg No</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Similarity</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{r.student}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{r.regNo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.course}</td>
                      <td className="px-4 py-3 text-center font-display font-bold text-foreground">{r.similarity}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          r.status === "Pass" ? "bg-emerald-100 text-emerald-700"
                          : r.status === "Flag" ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                        }`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </LecturerLayout>
  );
};

export default LecturerReports;

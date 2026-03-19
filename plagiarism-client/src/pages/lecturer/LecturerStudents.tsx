import { LecturerLayout } from "@/components/layout/LecturerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { useState } from "react";
import { TableLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const students = [
  { regNo: "283/BSC.SE/T/2018", name: "Alice Mwanga", course: "Database Systems", status: "active" },
  { regNo: "102/BSC.CS/T/2019", name: "Bob Kamau", course: "Database Systems", status: "active" },
  { regNo: "045/BSC.IT/T/2020", name: "Carol Lyimo", course: "Software Engineering", status: "active" },
  { regNo: "120/BSC.SE/T/2019", name: "David Masika", course: "Data Structures", status: "suspended" },
  { regNo: "089/BSC.CS/T/2020", name: "Eve Mushi", course: "Software Engineering", status: "active" },
  { regNo: "201/BSC.IT/T/2018", name: "Frank Nyambi", course: "Computer Networks", status: "active" },
];

const LecturerStudents = () => {
  const [search, setSearch] = useState("");
  const isLoading = usePageLoading();

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LecturerLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">My Students</h1>
          <p className="text-sm text-muted-foreground">Students enrolled in your courses</p>
        </div>
      </div>

      {isLoading ? <TableLoader /> : (
        <Card className="shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">All Students</CardTitle>
            <Input placeholder="Search by name or reg no..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reg No</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.regNo} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{s.regNo}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.course}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          s.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>{s.status}</span>
                      </td>
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

export default LecturerStudents;

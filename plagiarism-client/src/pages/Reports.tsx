import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Download, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

interface StudentReport {
  id: number; name: string; regNo: string; course: string; similarity: number; status: string; date: string;
}

const mockReports: StudentReport[] = [
  { id: 1, name: "John Doe", regNo: "283/BSC.SE/T/2018", course: "Database Systems", similarity: 23, status: "Pass", date: "2026-02-20" },
  { id: 2, name: "Jane Smith", regNo: "102/BSC.CS/T/2019", course: "Software Engineering", similarity: 67, status: "Flag", date: "2026-02-22" },
  { id: 3, name: "Mike Johnson", regNo: "145/BSC.IT/T/2020", course: "Data Structures", similarity: 12, status: "Pass", date: "2026-03-01" },
  { id: 4, name: "Sarah Wilson", regNo: "201/BSC.SE/T/2019", course: "Computer Networks", similarity: 89, status: "Fail", date: "2026-03-02" },
  { id: 5, name: "Alice Mwanga", regNo: "310/BSC.CS/T/2020", course: "Operating Systems", similarity: 45, status: "Acceptable", date: "2026-03-03" },
  { id: 6, name: "Bob Kamau", regNo: "122/BSC.IT/T/2021", course: "Web Development", similarity: 78, status: "Fail", date: "2026-03-04" },
  { id: 7, name: "Grace Otieno", regNo: "055/BSC.SE/T/2021", course: "Database Systems", similarity: 5, status: "Pass", date: "2026-03-05" },
  { id: 8, name: "David Mushi", regNo: "400/BSC.CS/T/2018", course: "Artificial Intelligence", similarity: 52, status: "Flag", date: "2026-02-28" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Pass": return "bg-emerald-100 text-emerald-700";
    case "Acceptable": return "bg-blue-100 text-blue-700";
    case "Flag": return "bg-amber-100 text-amber-700";
    case "Fail": return "bg-red-100 text-red-700";
    default: return "bg-muted text-muted-foreground";
  }
};

function exportToCSV(data: StudentReport[], filename: string) {
  const headers = ["S/N", "Name", "Reg Number", "Course", "Similarity (%)", "Status", "Date"];
  const rows = data.map((r, i) => [i + 1, r.name, r.regNo, r.course, r.similarity, r.status, r.date]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
  toast({ title: "Exported", description: `${filename}.csv downloaded successfully.` });
}

const Reports = () => {
  const [searchName, setSearchName] = useState("");
  const [searchRegNo, setSearchRegNo] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedStudent, setSelectedStudent] = useState("");
  const isLoading = usePageLoading();

  const filtered = useMemo(() => {
    return mockReports.filter((r) => {
      if (searchName && !r.name.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchRegNo && !r.regNo.toLowerCase().includes(searchRegNo.toLowerCase())) return false;
      if (dateFrom && new Date(r.date) < dateFrom) return false;
      if (dateTo && new Date(r.date) > dateTo) return false;
      return true;
    });
  }, [searchName, searchRegNo, dateFrom, dateTo]);

  const singleStudentReports = useMemo(() => {
    if (!selectedStudent) return [];
    return mockReports.filter((r) => r.regNo === selectedStudent);
  }, [selectedStudent]);

  const uniqueStudents = useMemo(() => {
    const map = new Map<string, string>();
    mockReports.forEach((r) => map.set(r.regNo, r.name));
    return Array.from(map.entries());
  }, []);

  const clearFilters = () => { setSearchName(""); setSearchRegNo(""); setDateFrom(undefined); setDateTo(undefined); };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">View and export student plagiarism reports</p>
        </div>
      </div>

      {isLoading ? <PageLoader /> : (
        <Tabs defaultValue="all" className="rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TabsList>
            <TabsTrigger value="all">📊 All Students Report</TabsTrigger>
            <TabsTrigger value="single">👤 Single Student Report</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Filter className="h-4 w-4" /> Filters</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label className="text-xs">Name</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="pl-8" />
                  </div>
                </div>
                <div><Label className="text-xs">Registration No.</Label><Input placeholder="e.g. 283/BSC.SE/T/2018" value={searchRegNo} onChange={(e) => setSearchRegNo(e.target.value)} /></div>
                <div>
                  <Label className="text-xs">Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{dateFrom ? format(dateFrom, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" /></PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-xs">Date To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{dateTo ? format(dateTo, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" /></PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
                <Button size="sm" onClick={() => exportToCSV(filtered, "all-students-report")}><Download className="mr-1 h-4 w-4" /> Export All ({filtered.length})</Button>
              </div>
            </div>

            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">S/N</TableHead><TableHead>Name</TableHead><TableHead>Reg Number</TableHead><TableHead>Course</TableHead>
                    <TableHead className="text-center">Similarity</TableHead><TableHead className="text-center">Status</TableHead><TableHead>Date</TableHead><TableHead className="text-center">Export</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No reports match your filters.</TableCell></TableRow>
                  ) : filtered.map((r, i) => (
                    <TableRow key={r.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-xs">{r.regNo}</TableCell>
                      <TableCell>{r.course}</TableCell>
                      <TableCell className="text-center font-display font-bold">{r.similarity}%</TableCell>
                      <TableCell className="text-center"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(r.status)}`}>{r.status}</span></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                      <TableCell className="text-center"><Button variant="ghost" size="sm" onClick={() => exportToCSV([r], `report-${r.regNo}`)}><Download className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="single" className="space-y-4">
            <div className="max-w-md rounded-lg border border-border bg-background p-4">
              <Label>Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
                <SelectContent>{uniqueStudents.map(([regNo, name]) => <SelectItem key={regNo} value={regNo}>{name} ({regNo})</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {selectedStudent && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{singleStudentReports.length} report(s) found</p>
                  <Button size="sm" onClick={() => exportToCSV(singleStudentReports, `report-${selectedStudent}`)}><Download className="mr-1 h-4 w-4" /> Export Student Report</Button>
                </div>
                <div className="rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12">S/N</TableHead><TableHead>Course</TableHead>
                        <TableHead className="text-center">Similarity</TableHead><TableHead className="text-center">Status</TableHead><TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {singleStudentReports.map((r, i) => (
                        <TableRow key={r.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{r.course}</TableCell>
                          <TableCell className="text-center font-display font-bold">{r.similarity}%</TableCell>
                          <TableCell className="text-center"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(r.status)}`}>{r.status}</span></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default Reports;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileSearch, ArrowLeft, BookOpen, FileText, Users, Loader2,
  Search, Calendar, GraduationCap, Building2, Filter,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";
import {
  courses,
  assignments,
  submissions,
  generateSimilarity,
  findHighlightedSegments,
  type Course,
  type Assignment,
  type Submission,
} from "@/data/similarityMockData";

type View = "courses" | "assignments" | "submissions" | "dualResult";

const Similarity = () => {
  const navigate = useNavigate();
  const isLoading = usePageLoading();

  const [view, setView] = useState<View>("courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checking, setChecking] = useState(false);

  // Admin search & filters
  const [courseSearch, setCourseSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Dual comparison state
  const [dualResult, setDualResult] = useState<{
    subA: Submission;
    subB: Submission;
    similarity: number;
  } | null>(null);

  // Unique filter values
  const departments = [...new Set(courses.map((c) => c.department))];
  const semesters = [...new Set(courses.map((c) => c.semester))];

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !courseSearch ||
        c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.lecturer.toLowerCase().includes(courseSearch.toLowerCase());
      const matchDept = departmentFilter === "all" || c.department === departmentFilter;
      const matchSem = semesterFilter === "all" || c.semester === semesterFilter;
      return matchSearch && matchDept && matchSem;
    });
  }, [courseSearch, departmentFilter, semesterFilter]);

  // Filtered data
  const courseAssignments = useMemo(
    () => (selectedCourse ? assignments.filter((a) => a.courseId === selectedCourse.id) : []),
    [selectedCourse]
  );

  const assignmentSubmissions = useMemo(
    () => (selectedAssignment ? submissions.filter((s) => s.assignmentId === selectedAssignment.id) : []),
    [selectedAssignment]
  );

  // Filtered submissions with search and date
  const filteredSubmissions = useMemo(() => {
    return assignmentSubmissions.filter((s) => {
      const matchSearch =
        !submissionSearch ||
        s.studentName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
        s.regNumber.toLowerCase().includes(submissionSearch.toLowerCase());
      const matchDate =
        dateFilter === "all" ||
        (dateFilter === "today" && s.dateSubmitted === new Date().toISOString().slice(0, 10)) ||
        (dateFilter === "week" && isWithinDays(s.dateSubmitted, 7)) ||
        (dateFilter === "month" && isWithinDays(s.dateSubmitted, 30));
      return matchSearch && matchDate;
    });
  }, [assignmentSubmissions, submissionSearch, dateFilter]);

  const allSelected =
    filteredSubmissions.length > 0 && filteredSubmissions.every((s) => selected.has(s.id));
  const someSelected = selected.size > 0 && !allSelected;

  // Handlers
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setSelectedAssignment(null);
    setSelected(new Set());
    setDualResult(null);
    setSubmissionSearch("");
    setDateFilter("all");
    setView("assignments");
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSelected(new Set());
    setDualResult(null);
    setSubmissionSearch("");
    setDateFilter("all");
    setView("submissions");
  };

  const handleBack = () => {
    if (view === "dualResult") {
      setView("submissions");
      setDualResult(null);
    } else if (view === "submissions") {
      setView("assignments");
      setSelected(new Set());
    } else if (view === "assignments") {
      setView("courses");
      setSelectedCourse(null);
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredSubmissions.map((s) => s.id)));
    }
  };

  const handleCompare = async () => {
    const selectedSubs = assignmentSubmissions.filter((s) => selected.has(s.id));
    if (selectedSubs.length < 2) {
      toast({ title: "Selection Required", description: "Select at least 2 submissions.", variant: "destructive" });
      return;
    }

    setChecking(true);
    await new Promise((r) => setTimeout(r, 1200));
    setChecking(false);

    if (selectedSubs.length === 2) {
      setDualResult({
        subA: selectedSubs[0],
        subB: selectedSubs[1],
        similarity: generateSimilarity(),
      });
      setView("dualResult");
      toast({ title: "Comparison Complete", description: "Showing side-by-side results." });
    } else {
      navigate("/similarity/matrix", {
        state: {
          submissions: selectedSubs,
          assignmentTitle: selectedAssignment?.title,
          courseCode: selectedCourse?.code,
          courseName: selectedCourse?.name,
          lecturer: selectedCourse?.lecturer,
        },
      });
    }
  };

  // Breadcrumb
  const breadcrumb = () => {
    const parts: string[] = ["All Courses"];
    if (selectedCourse) parts.push(`${selectedCourse.code} — ${selectedCourse.name}`);
    if (selectedAssignment) parts.push(selectedAssignment.title);
    if (view === "dualResult") parts.push("Comparison");
    return parts;
  };

  if (isLoading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        {view !== "courses" && (
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <FileSearch className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-foreground">Check Similarity</h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumb().map((part, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-border">/</span>}
                <span className={i === breadcrumb().length - 1 ? "text-foreground font-medium" : ""}>{part}</span>
              </span>
            ))}
          </div>
        </div>
        {view === "courses" && (
          <Badge variant="secondary" className="text-xs">
            {courses.length} Courses · {assignments.length} Assignments · {submissions.length} Submissions
          </Badge>
        )}
      </div>

      {/* Level 1: Course Grid with Admin Filters */}
      {view === "courses" && (
        <>
          {/* Search & Filter Bar */}
          <Card className="mb-4 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-500">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, codes, or lecturers…"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-52">
                    <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                  <SelectTrigger className="w-full sm:w-52">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(courseSearch || departmentFilter !== "all" || semesterFilter !== "all") && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Showing {filteredCourses.length} of {courses.length} courses
                </p>
              )}
            </CardContent>
          </Card>

          {filteredCourses.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <Filter className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No courses match your filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course, idx) => {
                const count = assignments.filter((a) => a.courseId === course.id).length;
                return (
                  <Card
                    key={course.id}
                    className="cursor-pointer shadow-card transition-all hover:shadow-lg hover:border-primary/40 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${idx * 60}ms` }}
                    onClick={() => handleCourseClick(course)}
                  >
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-foreground">{course.code}</p>
                        <p className="text-sm text-muted-foreground truncate">{course.name}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span className="truncate">{course.lecturer}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{course.department}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{count} assignments</Badge>
                          <Badge variant="outline" className="text-xs">{course.totalStudents} students</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Level 2: Assignments */}
      {view === "assignments" && selectedCourse && (
        <>
          {/* Course Info Card */}
          <Card className="mb-4 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-500">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm"><span className="font-medium text-foreground">Lecturer:</span> {selectedCourse.lecturer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm"><span className="font-medium text-foreground">Department:</span> {selectedCourse.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm"><span className="font-medium text-foreground">Semester:</span> {selectedCourse.semester}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm"><span className="font-medium text-foreground">Students:</span> {selectedCourse.totalStudents}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {courseAssignments.map((a, idx) => {
              const subCount = submissions.filter((s) => s.assignmentId === a.id).length;
              return (
                <Card
                  key={a.id}
                  className="cursor-pointer shadow-card transition-all hover:shadow-lg hover:border-primary/40 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  onClick={() => handleAssignmentClick(a)}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{a.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{subCount} submissions</span>
                        <span className="text-xs text-muted-foreground">Due: {a.dueDate}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{subCount}/{selectedCourse.totalStudents} submitted</Badge>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Level 3: Submission Table with Search & Date Filter */}
      {view === "submissions" && selectedAssignment && (
        <>
          {/* Course & Assignment Info */}
          <Card className="mb-4 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-500">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                <div><span className="font-medium text-foreground">Course:</span> {selectedCourse?.code} — {selectedCourse?.name}</div>
                <div><span className="font-medium text-foreground">Lecturer:</span> {selectedCourse?.lecturer}</div>
                <div><span className="font-medium text-foreground">Due:</span> {selectedAssignment.dueDate}</div>
              </div>
            </CardContent>
          </Card>

          {/* Search & Filter */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or reg number…"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select All & Compare Button */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-card px-5 py-3 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-500">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleAll}
              />
              <span className="text-sm font-medium text-foreground">
                Select All ({selected.size}/{filteredSubmissions.length})
              </span>
            </label>
            <Button onClick={handleCompare} disabled={selected.size < 2 || checking}>
              {checking ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Comparing…</>
              ) : (
                <><FileSearch className="mr-2 h-4 w-4" /> Compare Selected ({selected.size})</>
              )}
            </Button>
          </div>

          <Card className="shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="font-display text-base">{selectedAssignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No submissions match your search.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={allSelected ? true : someSelected ? "indeterminate" : false}
                          onCheckedChange={toggleAll}
                        />
                      </TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Reg Number</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((sub) => {
                      const isLate = sub.dateSubmitted > (selectedAssignment.dueDate || "");
                      return (
                        <TableRow
                          key={sub.id}
                          className="cursor-pointer transition-colors"
                          onClick={() => toggleOne(sub.id)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selected.has(sub.id)}
                              onCheckedChange={() => toggleOne(sub.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{sub.studentName}</TableCell>
                          <TableCell className="text-muted-foreground">{sub.regNumber}</TableCell>
                          <TableCell className="text-muted-foreground">{sub.dateSubmitted}</TableCell>
                          <TableCell>
                            <Badge variant={isLate ? "destructive" : "secondary"} className="text-xs">
                              {isLate ? "Late" : "On Time"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Scenario A: Dual Comparison Split-Screen */}
      {view === "dualResult" && dualResult && (
        <DualComparisonView
          subA={dualResult.subA}
          subB={dualResult.subB}
          similarity={dualResult.similarity}
          courseName={selectedCourse ? `${selectedCourse.code} — ${selectedCourse.name}` : ""}
          lecturer={selectedCourse?.lecturer || ""}
          assignmentTitle={selectedAssignment?.title || ""}
        />
      )}
    </DashboardLayout>
  );
};

// ── Helper ──
function isWithinDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

// ── Dual Comparison Sub-Component ──
function DualComparisonView({
  subA,
  subB,
  similarity,
  courseName,
  lecturer,
  assignmentTitle,
}: {
  subA: Submission;
  subB: Submission;
  similarity: number;
  courseName: string;
  lecturer: string;
  assignmentTitle: string;
}) {
  const { segmentsA, segmentsB } = findHighlightedSegments(subA.text, subB.text);

  const severityColor =
    similarity >= 50 ? "text-destructive" : similarity >= 25 ? "text-amber-600" : "text-emerald-600";
  const severityBg =
    similarity >= 50 ? "bg-destructive/10" : similarity >= 25 ? "bg-amber-600/10" : "bg-emerald-600/10";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Context Info */}
      <Card className="shadow-card">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
            <div><span className="font-medium text-foreground">Course:</span> {courseName}</div>
            <div><span className="font-medium text-foreground">Lecturer:</span> {lecturer}</div>
            <div><span className="font-medium text-foreground">Assignment:</span> {assignmentTitle}</div>
          </div>
        </CardContent>
      </Card>

      {/* Score badge */}
      <Card className={`shadow-card ${severityBg} border-0`}>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-foreground">Similarity Score</p>
            <p className="text-xs text-muted-foreground">
              {subA.studentName} vs {subB.studentName}
            </p>
          </div>
          <Badge className={`text-2xl font-display font-bold px-4 py-2 ${severityBg} ${severityColor} border-0`}>
            {similarity}%
          </Badge>
        </CardContent>
      </Card>

      {/* Split screen */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {subA.studentName}
              <span className="ml-2 text-xs font-normal text-muted-foreground">{subA.regNumber}</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Submitted: {subA.dateSubmitted}</p>
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed">
              {segmentsA.map((seg, i) => (
                <span key={i} className={seg.highlighted ? "bg-yellow-200 dark:bg-yellow-800/50 rounded px-0.5" : ""}>
                  {seg.text}{" "}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {subB.studentName}
              <span className="ml-2 text-xs font-normal text-muted-foreground">{subB.regNumber}</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Submitted: {subB.dateSubmitted}</p>
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed">
              {segmentsB.map((seg, i) => (
                <span key={i} className={seg.highlighted ? "bg-yellow-200 dark:bg-yellow-800/50 rounded px-0.5" : ""}>
                  {seg.text}{" "}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {similarity >= 50 ? "❌ High similarity — possible plagiarism" : similarity >= 25 ? "⚠️ Moderate overlap — review recommended" : "✅ Low similarity — likely original work"}
      </p>
    </div>
  );
}

export default Similarity;

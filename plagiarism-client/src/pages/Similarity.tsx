import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSearch, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

interface Assignment {
  id: string;
  title: string;
  student: string;
  course: string;
}

const mockAssignments: Assignment[] = [
  { id: "1", title: "ER Diagram Design", student: "Alice Mwanga", course: "Database Systems" },
  { id: "2", title: "SQL Query Optimization", student: "Bob Kamau", course: "Database Systems" },
  { id: "3", title: "Normalization Exercise", student: "Carol Lyimo", course: "Database Systems" },
  { id: "4", title: "UML Class Diagram", student: "Alice Mwanga", course: "Software Engineering" },
  { id: "5", title: "Agile Sprint Report", student: "David Osei", course: "Software Engineering" },
  { id: "6", title: "Requirements Document", student: "Bob Kamau", course: "Software Engineering" },
  { id: "7", title: "Linked List Implementation", student: "Carol Lyimo", course: "Data Structures" },
  { id: "8", title: "Binary Tree Traversal", student: "David Osei", course: "Data Structures" },
  { id: "9", title: "Sorting Algorithms Report", student: "Alice Mwanga", course: "Data Structures" },
  { id: "10", title: "TCP/IP Analysis", student: "Bob Kamau", course: "Computer Networks" },
  { id: "11", title: "Network Topology Design", student: "Carol Lyimo", course: "Computer Networks" },
  { id: "12", title: "Firewall Configuration", student: "David Osei", course: "Computer Networks" },
];

const Similarity = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const isLoading = usePageLoading();
  const navigate = useNavigate();

  const courses = [...new Set(mockAssignments.map((a) => a.course))];

  const getAssignmentsByCourse = (course: string) =>
    mockAssignments.filter((a) => a.course === course);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCourse = (course: string) => {
    const ids = getAssignmentsByCourse(course).map((a) => a.id);
    const allSelected = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const toggleAll = () => {
    const allIds = mockAssignments.map((a) => a.id);
    const allSelected = allIds.every((id) => selected.has(id));
    setSelected(allSelected ? new Set() : new Set(allIds));
  };

  const allSelected = mockAssignments.length > 0 && mockAssignments.every((a) => selected.has(a.id));
  const someSelected = selected.size > 0 && !allSelected;

  const handleRunCheck = () => {
    if (selected.size < 2) {
      toast({ title: "Selection Required", description: "Select at least 2 assignments to compare.", variant: "destructive" });
      return;
    }
    const selectedAssignments = mockAssignments.filter((a) => selected.has(a.id));
    navigate("/similarity/results", { state: { assignments: selectedAssignments } });
  };

  return (
    <DashboardLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <FileSearch className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Check Similarity</h1>
              <p className="text-sm text-muted-foreground">Select assignments to run plagiarism detection</p>
            </div>
          </div>

          {/* Select All & Action Bar */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-card px-5 py-3 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-500">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleAll}
              />
              <span className="text-sm font-medium text-foreground">
                Select All ({selected.size}/{mockAssignments.length})
              </span>
            </label>
            <Button onClick={handleRunCheck} disabled={selected.size < 2}>
              <FileSearch className="mr-2 h-4 w-4" />
              Run Check ({selected.size})
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Course Categories */}
          <div className="space-y-4">
            {courses.map((course, idx) => {
              const assignments = getAssignmentsByCourse(course);
              const courseIds = assignments.map((a) => a.id);
              const allCourseSelected = courseIds.every((id) => selected.has(id));
              const someCourseSelected = courseIds.some((id) => selected.has(id)) && !allCourseSelected;

              return (
                <Card key={course} className="shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 80}ms` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={allCourseSelected ? true : someCourseSelected ? "indeterminate" : false}
                        onCheckedChange={() => toggleCourse(course)}
                      />
                      <CardTitle className="font-display text-base">{course}</CardTitle>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {courseIds.filter((id) => selected.has(id)).length}/{assignments.length} selected
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="divide-y divide-border">
                      {assignments.map((a) => (
                        <label key={a.id} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                          <Checkbox
                            checked={selected.has(a.id)}
                            onCheckedChange={() => toggleOne(a.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                            <p className="text-xs text-muted-foreground">{a.student}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Similarity;

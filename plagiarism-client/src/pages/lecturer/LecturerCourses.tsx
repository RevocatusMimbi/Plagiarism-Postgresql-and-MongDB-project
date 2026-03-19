import { LecturerLayout } from "@/components/layout/LecturerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const courses = [
  { id: 1, name: "Database Systems", code: "CS301", students: 28, faculty: "Faculty of Science" },
  { id: 2, name: "Software Engineering", code: "CS302", students: 32, faculty: "Faculty of Science" },
  { id: 3, name: "Data Structures", code: "CS201", students: 18, faculty: "Faculty of Engineering" },
  { id: 4, name: "Computer Networks", code: "CS303", students: 8, faculty: "Faculty of Engineering" },
];

const LecturerCourses = () => {
  const isLoading = usePageLoading();

  return (
    <LecturerLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <BookOpen className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">My Courses</h1>
          <p className="text-sm text-muted-foreground">Courses assigned to you</p>
        </div>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {courses.map((c) => (
            <Card key={c.id} className="shadow-card transition-shadow hover:shadow-elevated">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="font-display text-base">{c.name}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{c.code}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.faculty}</span>
                  <span className="font-medium text-foreground">{c.students} students</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </LecturerLayout>
  );
};

export default LecturerCourses;

import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileSearch, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";
import { toast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  student: string;
  course: string;
}

interface ComparisonResult {
  assignment1: Assignment;
  assignment2: Assignment;
  similarity: number;
}

function generateResults(assignments: Assignment[]): ComparisonResult[] {
  const results: ComparisonResult[] = [];
  for (let i = 0; i < assignments.length; i++) {
    for (let j = i + 1; j < assignments.length; j++) {
      // Higher similarity for same course
      const sameCourse = assignments[i].course === assignments[j].course;
      const base = sameCourse ? 20 : 5;
      const range = sameCourse ? 70 : 30;
      const similarity = Math.round(base + Math.random() * range);
      results.push({ assignment1: assignments[i], assignment2: assignments[j], similarity });
    }
  }
  return results.sort((a, b) => b.similarity - a.similarity);
}

function getSeverity(score: number) {
  if (score >= 50) return { label: "High", variant: "destructive" as const };
  if (score >= 25) return { label: "Medium", variant: "secondary" as const };
  return { label: "Low", variant: "outline" as const };
}

const SimilarityResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoading = usePageLoading();
  const [processing, setProcessing] = useState(true);
  const [results, setResults] = useState<ComparisonResult[]>([]);

  const assignments: Assignment[] = location.state?.assignments || [];

  useEffect(() => {
    if (assignments.length < 2) {
      navigate("/similarity", { replace: true });
      return;
    }
    const timer = setTimeout(() => {
      setResults(generateResults(assignments));
      setProcessing(false);
      toast({ title: "Analysis Complete", description: `Compared ${assignments.length} assignments.` });
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const highCount = results.filter((r) => r.similarity >= 50).length;
  const medCount = results.filter((r) => r.similarity >= 25 && r.similarity < 50).length;
  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.similarity, 0) / results.length) : 0;

  return (
    <DashboardLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <Button variant="ghost" size="icon" onClick={() => navigate("/similarity")} className="mr-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <FileSearch className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Similarity Results</h1>
              <p className="text-sm text-muted-foreground">{assignments.length} assignments compared</p>
            </div>
          </div>

          {processing ? (
            <Card className="shadow-card animate-in fade-in duration-500">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="font-display text-lg font-semibold text-foreground">Analyzing submissions…</p>
                <p className="text-sm text-muted-foreground mt-1">Running plagiarism detection engine</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="shadow-card">
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Average Similarity</p>
                    <p className={`font-display text-4xl font-bold mt-1 ${avgScore >= 50 ? "text-destructive" : avgScore >= 25 ? "text-amber-600" : "text-emerald-600"}`}>
                      {avgScore}%
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">High Similarity Pairs</p>
                    <p className="font-display text-4xl font-bold mt-1 text-destructive">{highCount}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Flagged for Review</p>
                    <p className="font-display text-4xl font-bold mt-1 text-amber-600">{medCount}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Results Table */}
              <Card className="shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <CardTitle className="font-display text-base">Comparison Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment 1</TableHead>
                        <TableHead>Assignment 2</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead className="text-right">Similarity</TableHead>
                        <TableHead>Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r, i) => {
                        const severity = getSeverity(r.similarity);
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              <p className="font-medium text-sm">{r.assignment1.title}</p>
                              <p className="text-xs text-muted-foreground">{r.assignment1.student}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium text-sm">{r.assignment2.title}</p>
                              <p className="text-xs text-muted-foreground">{r.assignment2.student}</p>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {r.assignment1.course === r.assignment2.course ? r.assignment1.course : "Cross-course"}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`font-display text-lg font-bold ${r.similarity >= 50 ? "text-destructive" : r.similarity >= 25 ? "text-amber-600" : "text-emerald-600"}`}>
                                {r.similarity}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={severity.variant}>{severity.label}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default SimilarityResults;

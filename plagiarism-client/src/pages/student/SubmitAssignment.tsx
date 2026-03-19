import { useState } from "react";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileUp, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const courses = ["Database Systems", "Software Engineering", "Data Structures", "Computer Networks", "Operating Systems"];

const SubmitAssignment = () => {
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isLoading = usePageLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !title || !file) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    toast({ title: "Success", description: "Assignment submitted successfully!" });
    setSubmitting(false);
  };

  const handleReset = () => {
    setCourse(""); setTitle(""); setDescription(""); setFile(null); setSubmitted(false);
  };

  if (submitted) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
          <div className="rounded-full bg-emerald-100 p-6">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-foreground">Assignment Submitted!</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your assignment for <span className="font-medium">{course}</span> has been submitted for plagiarism checking.</p>
          <Button onClick={handleReset} className="mt-6">Submit Another</Button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <Upload className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Submit Assignment</h1>
              <p className="text-sm text-muted-foreground">Upload your assignment for plagiarism checking</p>
            </div>
          </div>

          <Card className="max-w-2xl shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader><CardTitle className="font-display text-lg">Assignment Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Course *</Label>
                  <Select value={course} onValueChange={setCourse} disabled={submitting}>
                    <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                    <SelectContent>{courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assignment Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Database Normalization Report" required disabled={submitting} />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the assignment..." rows={3} disabled={submitting} />
                </div>

                <div className="space-y-2">
                  <Label>Upload File *</Label>
                  <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center">
                    <FileUp className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">{file ? file.name : "Click to select or drag & drop your file"}</p>
                    <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 cursor-pointer opacity-0" style={{ position: "relative" }} disabled={submitting} />
                    <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX, or TXT (max 10MB)</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleReset} disabled={submitting}>Reset</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Upload className="mr-2 h-4 w-4" /> Submit Assignment</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </StudentLayout>
  );
};

export default SubmitAssignment;

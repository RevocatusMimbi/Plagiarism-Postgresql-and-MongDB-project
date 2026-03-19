import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserPlus, RotateCcw, GraduationCap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useLectureStore } from "@/store/lectureStore";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const AddLecture = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { lectures, addLecture } = useLectureStore();
  const isLoading = usePageLoading();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fname || !lname || !email) return;
    if (lectures.some((l) => l.email === email)) {
      toast({ title: "Warning", description: "Email is already in use.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    addLecture(fname, lname, email);
    toast({ title: "Success", description: `${fname} ${lname} added as Lecture.` });
    setFname(""); setLname(""); setEmail("");
    setSubmitting(false);
  };

  const handleReset = () => { setFname(""); setLname(""); setEmail(""); };

  return (
    <DashboardLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Add Lecture</h1>
              <p className="text-sm text-muted-foreground">Register a new lecture</p>
            </div>
          </div>

          <div className="mx-auto max-w-lg rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 font-display text-base font-semibold text-primary">Register Lecture.</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><Label>First Name:</Label><Input value={fname} onChange={(e) => setFname(e.target.value)} placeholder="First name" required pattern="^[a-zA-Z]*$" disabled={submitting} /></div>
              <div><Label>Last Name:</Label><Input value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last name" required pattern="^[a-zA-Z]*$" disabled={submitting} /></div>
              <div><Label>Email:</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={submitting} /></div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={handleReset} disabled={submitting}><RotateCcw className="mr-1 h-4 w-4" /> Reset</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Adding...</> : <><UserPlus className="mr-1 h-4 w-4" /> Add Lecture</>}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AddLecture;

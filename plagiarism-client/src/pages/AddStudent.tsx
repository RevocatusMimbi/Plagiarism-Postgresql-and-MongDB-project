import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, RotateCcw, UserPlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useStudentStore } from "@/store/studentStore";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const AddStudent = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [regNo, setRegNo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { students, addStudent } = useStudentStore();
  const isLoading = usePageLoading();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (students.some((s) => s.regNo === regNo)) {
      toast({ title: "Warning", description: "Registration number already in use.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    addStudent(regNo, fname, lname);
    toast({ title: "Success", description: `${fname} ${lname} added as Student.` });
    setFname(""); setLname(""); setRegNo("");
    setSubmitting(false);
  };

  const handleReset = () => { setFname(""); setLname(""); setRegNo(""); };

  return (
    <DashboardLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Add Student</h1>
              <p className="text-sm text-muted-foreground">Register a new student</p>
            </div>
          </div>

          <div className="mx-auto max-w-lg rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 font-display text-base font-semibold text-primary">Register Student.</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><Label>First Name:</Label><Input value={fname} onChange={(e) => setFname(e.target.value)} placeholder="First name" required pattern="^[a-zA-Z]*$" disabled={submitting} /></div>
              <div><Label>Last Name:</Label><Input value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last name" required pattern="^[a-zA-Z]*$" disabled={submitting} /></div>
              <div><Label>Registration Number:</Label><Input value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="eg. 283/BSC.SE/T/2018" required disabled={submitting} /></div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={handleReset} disabled={submitting}><RotateCcw className="mr-1 h-4 w-4" /> Reset</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Adding...</> : <><UserPlus className="mr-1 h-4 w-4" /> Add Student</>}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AddStudent;

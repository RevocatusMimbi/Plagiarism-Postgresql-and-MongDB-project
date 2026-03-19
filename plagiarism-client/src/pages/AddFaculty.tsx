import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Network, PlusCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useFacultyStore } from "@/store/facultyStore";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const AddFaculty = () => {
  const [facName, setFacName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { faculties, addFaculty } = useFacultyStore();
  const isLoading = usePageLoading();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (faculties.some((f) => f.name.toLowerCase() === facName.toLowerCase())) {
      toast({ title: "Warning", description: "Faculty already exists.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    addFaculty(facName);
    toast({ title: "Success", description: `${facName} added as new faculty.` });
    setFacName("");
    setSubmitting(false);
  };

  return (
    <DashboardLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <Network className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Add Faculty</h1>
              <p className="text-sm text-muted-foreground">Add a new university faculty</p>
            </div>
          </div>

          <div className="mx-auto max-w-lg rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 font-display text-base font-semibold text-primary">Add New Faculty.</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><Label>Faculty Name:</Label><Input value={facName} onChange={(e) => setFacName(e.target.value)} placeholder="Faculty name" required pattern="^[a-zA-Z\s]*$" disabled={submitting} /></div>
              <Button type="submit" disabled={submitting}>
                {submitting ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Adding...</> : <><PlusCircle className="mr-1 h-4 w-4" /> Add Faculty</>}
              </Button>
            </form>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AddFaculty;

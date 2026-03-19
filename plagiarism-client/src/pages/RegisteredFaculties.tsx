import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Network, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useFacultyStore } from "@/store/facultyStore";
import { TableLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const RegisteredFaculties = () => {
  const { faculties, deleteFaculty, updateFaculty } = useFacultyStore();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);
  const isLoading = usePageLoading();

  const openEdit = (fac: typeof faculties[0]) => { setEditing({ id: fac.id, name: fac.name }); setEditOpen(true); };

  const handleSaveEdit = () => {
    if (!editing) return;
    updateFaculty(editing.id, editing.name);
    setEditOpen(false);
    toast({ title: "Success", description: "Faculty updated." });
  };

  const handleDelete = (id: number) => {
    const fac = faculties.find((f) => f.id === id);
    if (fac && fac.courses > 0) {
      toast({ title: "Warning", description: "Faculty can't be deleted because it contains courses.", variant: "destructive" });
      return;
    }
    deleteFaculty(id);
    toast({ title: "Deleted", description: "Faculty removed successfully." });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <Network className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Registered Faculties</h1>
          <p className="text-sm text-muted-foreground">View and manage all faculties</p>
        </div>
      </div>

      {isLoading ? <TableLoader /> : (
        <div className="rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="mb-4 font-display text-base font-semibold text-primary">List of Faculties</h2>
          {faculties.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No faculties registered yet.</p>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sidebar text-sidebar-foreground">
                    <TableHead>S/N</TableHead><TableHead>Name</TableHead><TableHead>Courses</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculties.map((fac, i) => (
                    <TableRow key={fac.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{fac.name}</TableCell>
                      <TableCell>{fac.courses}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(fac.id)}><Trash2 className="mr-1 h-3 w-3" /> delete</Button>
                          <Button size="sm" variant="outline" onClick={() => openEdit(fac)}><Edit className="mr-1 h-3 w-3" /> edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Faculty Name</DialogTitle></DialogHeader>
          {editing && (
            <div><Label>Faculty Name:</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Close</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RegisteredFaculties;

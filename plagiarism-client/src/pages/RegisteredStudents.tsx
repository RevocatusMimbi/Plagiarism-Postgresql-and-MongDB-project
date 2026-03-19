import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useStudentStore } from "@/store/studentStore";
import { TableLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const RegisteredStudents = () => {
  const { students, deleteStudent, toggleStudentStatus, updateStudent } = useStudentStore();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<{ regNo: string; fname: string; lname: string } | null>(null);
  const isLoading = usePageLoading();

  const openEdit = (std: typeof students[0]) => { setEditing({ regNo: std.regNo, fname: std.fname, lname: std.lname }); setEditOpen(true); };

  const handleSaveEdit = () => {
    if (!editing) return;
    updateStudent(editing.regNo, editing.fname, editing.lname);
    setEditOpen(false);
    toast({ title: "Success", description: "Student updated." });
  };

  const handleDelete = (regNo: string) => {
    deleteStudent(regNo);
    toast({ title: "Deleted", description: "Student removed successfully." });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Registered Students</h1>
          <p className="text-sm text-muted-foreground">View and manage all students</p>
        </div>
      </div>

      {isLoading ? <TableLoader /> : (
        <div className="rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="mb-4 font-display text-base font-semibold text-primary">List of Registered Students</h2>
          {students.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No students registered yet.</p>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sidebar text-sidebar-foreground">
                    <TableHead>S/N</TableHead><TableHead>Full Name</TableHead><TableHead>Reg Number</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((std, i) => (
                    <TableRow key={std.regNo}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{std.fname} {std.lname}</TableCell>
                      <TableCell>{std.regNo}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(std.regNo)}><Trash2 className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => openEdit(std)}><Edit className="h-3 w-3" /></Button>
                          <Button size="sm" variant={std.status === "active" ? "secondary" : "outline"} onClick={() => { toggleStudentStatus(std.regNo); toast({ title: "Updated", description: `Student ${std.status === "active" ? "suspended" : "activated"}.` }); }}>
                            {std.status === "active" ? "Suspend" : "Unsuspend"}
                          </Button>
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
          <DialogHeader><DialogTitle>Change Student Profile</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Registration Number:</Label><Input value={editing.regNo} disabled /></div>
              <div><Label>First Name:</Label><Input value={editing.fname} onChange={(e) => setEditing({ ...editing, fname: e.target.value })} /></div>
              <div><Label>Last Name:</Label><Input value={editing.lname} onChange={(e) => setEditing({ ...editing, lname: e.target.value })} /></div>
            </div>
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

export default RegisteredStudents;

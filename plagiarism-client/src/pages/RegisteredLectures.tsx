import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GraduationCap, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useLectureStore } from "@/store/lectureStore";
import { TableLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const RegisteredLectures = () => {
  const { lectures, deleteLecture, toggleLectureStatus, updateLecture } = useLectureStore();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number; fname: string; lname: string; email: string } | null>(null);
  const isLoading = usePageLoading();

  const openEdit = (lec: typeof lectures[0]) => { setEditing({ id: lec.id, fname: lec.fname, lname: lec.lname, email: lec.email }); setEditOpen(true); };

  const handleSaveEdit = () => {
    if (!editing) return;
    updateLecture(editing.id, editing.fname, editing.lname, editing.email);
    setEditOpen(false);
    toast({ title: "Success", description: `${editing.fname} ${editing.lname} updated.` });
  };

  const handleDelete = (id: number) => {
    deleteLecture(id);
    toast({ title: "Deleted", description: "Lecture removed successfully." });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
        <GraduationCap className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Registered Lectures</h1>
          <p className="text-sm text-muted-foreground">View and manage all lectures</p>
        </div>
      </div>

      {isLoading ? <TableLoader /> : (
        <div className="rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="mb-4 font-display text-base font-semibold text-primary">List of Registered Lectures</h2>
          {lectures.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No lectures registered yet.</p>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sidebar text-sidebar-foreground">
                    <TableHead>ID</TableHead><TableHead>Full Name</TableHead><TableHead>Email</TableHead><TableHead>Courses</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lectures.map((lec) => (
                    <TableRow key={lec.id}>
                      <TableCell>{lec.id}</TableCell>
                      <TableCell>{lec.fname} {lec.lname}</TableCell>
                      <TableCell>{lec.email}</TableCell>
                      <TableCell>{lec.courses}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(lec.id)}><Trash2 className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => openEdit(lec)}><Edit className="h-3 w-3" /></Button>
                          <Button size="sm" variant={lec.status === "active" ? "secondary" : "outline"} onClick={() => { toggleLectureStatus(lec.id); toast({ title: "Updated", description: `Lecture ${lec.status === "active" ? "suspended" : "activated"}.` }); }}>
                            {lec.status === "active" ? "Suspend" : "Unsuspend"}
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
          <DialogHeader><DialogTitle>Change Lecture Profile</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>First Name:</Label><Input value={editing.fname} onChange={(e) => setEditing({ ...editing, fname: e.target.value })} /></div>
              <div><Label>Last Name:</Label><Input value={editing.lname} onChange={(e) => setEditing({ ...editing, lname: e.target.value })} /></div>
              <div><Label>Email:</Label><Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
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

export default RegisteredLectures;

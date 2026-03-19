import { useState } from "react";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const StudentProfile = () => {
  const { user } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [saving, setSaving] = useState(false);
  const isLoading = usePageLoading();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Success", description: "Password changed successfully!" });
    setOldPass(""); setNewPass(""); setConfirmPass("");
    setSaving(false);
  };

  return (
    <StudentLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <User className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">My Profile</h1>
              <p className="text-sm text-muted-foreground">View and manage your account</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabsList>
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="shadow-card">
                <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label className="text-muted-foreground">Full Name</Label><p className="text-foreground font-medium">{user?.name}</p></div>
                  <div><Label className="text-muted-foreground">Email</Label><p className="text-foreground font-medium">{user?.email}</p></div>
                  <div><Label className="text-muted-foreground">Registration Number</Label><p className="text-foreground font-medium">{user?.regNo}</p></div>
                  <div><Label className="text-muted-foreground">Role</Label><p className="text-foreground font-medium capitalize">{user?.role}</p></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card className="shadow-card">
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} required disabled={saving} /></div>
                    <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required disabled={saving} /></div>
                    <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required disabled={saving} /></div>
                    <Button type="submit" disabled={saving}>
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </StudentLayout>
  );
};

export default StudentProfile;

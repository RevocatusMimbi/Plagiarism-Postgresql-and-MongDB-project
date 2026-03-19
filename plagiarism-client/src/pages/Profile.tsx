import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Save, RotateCcw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const Profile = () => {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@roapc.com");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [saving, setSaving] = useState(false);
  const isLoading = usePageLoading();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Success", description: "User profile updated." });
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPass !== confirmPass) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Success", description: "Password changed successfully." });
    setOldPass(""); setNewPass(""); setConfirmPass("");
    setSaving(false);
  };

  return (
    <DashboardLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <User className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Full User Profile</h1>
              <p className="text-sm text-muted-foreground">View and manage your account</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabsList>
              <TabsTrigger value="profile">👤 View User Profile</TabsTrigger>
              <TabsTrigger value="password">🔒 Change Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="max-w-lg space-y-6 rounded-lg bg-background p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">AU</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">Admin of the system</p>
                  </div>
                </div>
                <h3 className="font-display text-base font-semibold text-primary">Change User Profile.</h3>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div><Label>User Name:</Label><Input value={name} onChange={(e) => setName(e.target.value)} required disabled={saving} /></div>
                  <div><Label>Email:</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={saving} /></div>
                  <div><Label>Profile picture:</Label><Input type="file" accept="image/*" disabled={saving} /></div>
                  <div className="flex gap-2">
                    <Button type="reset" variant="secondary" disabled={saving}><RotateCcw className="mr-1 h-4 w-4" /> Reset</Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-1 h-4 w-4" /> Save</>}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="password">
              <div className="max-w-lg rounded-lg bg-background p-6">
                <h3 className="mb-4 font-display text-base font-semibold text-primary">Change Password.</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div><Label>Current Password:</Label><Input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} required disabled={saving} /></div>
                  <div><Label>New Password:</Label><Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required disabled={saving} /></div>
                  <div><Label>Confirm Password:</Label><Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required disabled={saving} /></div>
                  <div className="flex gap-2">
                    <Button type="reset" variant="secondary" onClick={() => { setOldPass(""); setNewPass(""); setConfirmPass(""); }} disabled={saving}>
                      <RotateCcw className="mr-1 h-4 w-4" /> Reset
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-1 h-4 w-4" /> Save changes</>}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  );
};

export default Profile;

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Settings as SettingsIcon, RotateCcw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/PageLoader";
import { usePageLoading } from "@/hooks/usePageLoading";

const mockUsers = [
  { id: "283/BSC.SE/T/2018", name: "Alice Mwanga (283/BSC.SE/T/2018)", group: "Students" },
  { id: "102/BSC.CS/T/2019", name: "Bob Kamau (102/BSC.CS/T/2019)", group: "Students" },
  { id: "1", name: "John Doe (john@example.com)", group: "Lectures" },
  { id: "2", name: "Jane Smith (jane@example.com)", group: "Lectures" },
];

const Settings = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [saving, setSaving] = useState(false);
  const isLoading = usePageLoading();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adminPass || !newPass) return;
    if (newPass.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Success", description: "Password reset successfully." });
    setSelectedUser(""); setAdminPass(""); setNewPass("");
    setSaving(false);
  };

  return (
    <DashboardLayout>
      {isLoading ? <PageLoader /> : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Setting Panel</h1>
              <p className="text-sm text-muted-foreground">System configuration</p>
            </div>
          </div>

          <Tabs defaultValue="reset" className="rounded-xl bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabsList>
              <TabsTrigger value="reset">🔑 Reset Password</TabsTrigger>
              <TabsTrigger value="grades">⚖️ Comment & Range</TabsTrigger>
            </TabsList>

            <TabsContent value="reset">
              <div className="max-w-lg rounded-lg bg-background p-6">
                <h3 className="mb-4 font-display text-base font-semibold text-primary">Reset User password.</h3>
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <Label>User name:</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser} disabled={saving}>
                      <SelectTrigger><SelectValue placeholder="Select username" /></SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Your password:</Label><Input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="Your Password" required disabled={saving} /></div>
                  <div><Label>New Password:</Label><Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New user Password" required disabled={saving} /></div>
                  <Button type="submit" disabled={saving}>
                    {saving ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Resetting...</> : <><RotateCcw className="mr-1 h-4 w-4" /> Reset</>}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="grades">
              <div className="max-w-lg rounded-lg bg-background p-6">
                <h3 className="mb-4 font-display text-base font-semibold text-primary">Similarity Grade Settings</h3>
                <div className="space-y-3">
                  {[
                    { range: "0% – 25%", comment: "Pass", color: "bg-emerald-100 text-emerald-700" },
                    { range: "26% – 50%", comment: "Acceptable", color: "bg-blue-100 text-blue-700" },
                    { range: "51% – 75%", comment: "Flag", color: "bg-amber-100 text-amber-700" },
                    { range: "76% – 100%", comment: "Fail", color: "bg-red-100 text-red-700" },
                  ].map((g) => (
                    <div key={g.range} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{g.range}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${g.color}`}>{g.comment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  );
};

export default Settings;

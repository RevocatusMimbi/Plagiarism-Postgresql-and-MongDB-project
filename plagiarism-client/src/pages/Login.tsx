import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GraduationCap, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1000));

    const result = login(email, password);
    if (result.success) {
      toast({ title: "Welcome back!", description: "You have been logged in successfully." });
      navigate("/");
    } else {
      toast({ title: "Login Failed", description: result.error || "Invalid credentials", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-midnight shadow-elevated">
            <GraduationCap className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-wider text-foreground">R O A P C</h1>
          <p className="mt-1 text-sm text-muted-foreground">RUCU Offline Assignments Plagiarism Checker</p>
        </div>

        <Card className="shadow-elevated border-border">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-lg">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@roapc.ac.tz" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required disabled={isLoading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required disabled={isLoading} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Demo Accounts</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">Admin:</span> admin@roapc.ac.tz</p>
                <p><span className="font-medium text-foreground">Lecturer:</span> john@roapc.ac.tz</p>
                <p><span className="font-medium text-foreground">Student:</span> alice@student.roapc.ac.tz</p>
                <p className="mt-1 italic">Any password works for demo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

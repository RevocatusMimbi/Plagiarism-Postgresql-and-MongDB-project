import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "lecturer" | "student";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  regNo?: string;
}

const MOCK_USERS: MockUser[] = [
  { id: "admin-1", name: "Admin User", email: "admin@roapc.ac.tz", role: "admin" },
  { id: "lec-1", name: "John Doe", email: "john@roapc.ac.tz", role: "lecturer" },
  { id: "lec-2", name: "Jane Smith", email: "jane@roapc.ac.tz", role: "lecturer" },
  { id: "std-1", name: "Alice Mwanga", email: "alice@student.roapc.ac.tz", role: "student", regNo: "283/BSC.SE/T/2018" },
  { id: "std-2", name: "Bob Kamau", email: "bob@student.roapc.ac.tz", role: "student", regNo: "102/BSC.CS/T/2019" },
];

interface AuthContextType {
  user: MockUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = (email: string, _password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email);
    if (!found) return { success: false, error: "Invalid email or password" };
    // Mock: any password works
    setUser(found);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

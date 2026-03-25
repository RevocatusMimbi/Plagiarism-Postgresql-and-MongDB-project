import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

// Admin pages
import Index from "./pages/Index";
import AddLecture from "./pages/AddLecture";
import RegisteredLectures from "./pages/RegisteredLectures";
import AddStudent from "./pages/AddStudent";
import RegisteredStudents from "./pages/RegisteredStudents";
import AddFaculty from "./pages/AddFaculty";
import RegisteredFaculties from "./pages/RegisteredFaculties";
import Similarity from "./pages/Similarity";
import SimilarityResults from "./pages/SimilarityResults";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitAssignment from "./pages/student/SubmitAssignment";
import StudentResults from "./pages/student/StudentResults";
import StudentProfile from "./pages/student/StudentProfile";

// Lecturer pages
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import LecturerCourses from "./pages/lecturer/LecturerCourses";
import LecturerStudents from "./pages/lecturer/LecturerStudents";
import LecturerSimilarity from "./pages/lecturer/LecturerSimilarity";
import LecturerComparisonMatrix from "./pages/lecturer/LecturerComparisonMatrix";
import LecturerReports from "./pages/lecturer/LecturerReports";
import LecturerProfile from "./pages/lecturer/LecturerProfile";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to role-specific home
    if (user.role === "student") return <Navigate to="/student" replace />;
    if (user.role === "lecturer") return <Navigate to="/lecturer" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function RoleRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "student") return <Navigate to="/student" replace />;
  if (user?.role === "lecturer") return <Navigate to="/lecturer" replace />;
  return <Index />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

      {/* Root — redirects by role */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Admin routes */}
      <Route path="/lectures/add" element={<ProtectedRoute allowedRoles={["admin"]}><AddLecture /></ProtectedRoute>} />
      <Route path="/lectures" element={<ProtectedRoute allowedRoles={["admin"]}><RegisteredLectures /></ProtectedRoute>} />
      <Route path="/students/add" element={<ProtectedRoute allowedRoles={["admin"]}><AddStudent /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={["admin"]}><RegisteredStudents /></ProtectedRoute>} />
      <Route path="/faculty/add" element={<ProtectedRoute allowedRoles={["admin"]}><AddFaculty /></ProtectedRoute>} />
      <Route path="/faculty" element={<ProtectedRoute allowedRoles={["admin"]}><RegisteredFaculties /></ProtectedRoute>} />
      <Route path="/similarity" element={<ProtectedRoute allowedRoles={["admin"]}><Similarity /></ProtectedRoute>} />
      <Route path="/similarity/results" element={<ProtectedRoute allowedRoles={["admin"]}><SimilarityResults /></ProtectedRoute>} />
      <Route path="/similarity/matrix" element={<ProtectedRoute allowedRoles={["admin"]}><SimilarityResults /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin"]}><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={["admin"]}><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={["admin"]}><Profile /></ProtectedRoute>} />

      {/* Student routes */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/submit" element={<ProtectedRoute allowedRoles={["student"]}><SubmitAssignment /></ProtectedRoute>} />
      <Route path="/student/results" element={<ProtectedRoute allowedRoles={["student"]}><StudentResults /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["student"]}><StudentProfile /></ProtectedRoute>} />

      {/* Lecturer routes */}
      <Route path="/lecturer" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerDashboard /></ProtectedRoute>} />
      <Route path="/lecturer/courses" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerCourses /></ProtectedRoute>} />
      <Route path="/lecturer/students" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerStudents /></ProtectedRoute>} />
      <Route path="/lecturer/similarity" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerSimilarity /></ProtectedRoute>} />
      <Route path="/lecturer/similarity/matrix" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerComparisonMatrix /></ProtectedRoute>} />
      <Route path="/lecturer/reports" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerReports /></ProtectedRoute>} />
      <Route path="/lecturer/profile" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerProfile /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <AppRoutes />
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

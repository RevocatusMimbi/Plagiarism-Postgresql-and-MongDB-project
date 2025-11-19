import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import './index.css';

// Placeholder components (You will replace these later)
const StudentHome = () => <h1>Student Dashboard</h1>;
const LectureDashboard = () => <h1>Lecture Dashboard</h1>;
const AdminHome = () => <h1>Admin Home</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: The Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes (Placeholders for now) */}
        <Route path="/student/home" element={<StudentHome />} />
        <Route path="/lecture/dashboard" element={<LectureDashboard />} />
        <Route path="/admin/home" element={<AdminHome />} />

        {/* Optional: 404 Not Found Page */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
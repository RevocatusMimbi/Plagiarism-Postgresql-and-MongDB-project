import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import StudentDashboard from './pages/StudentDashboard';
import './index.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public Route: The Login Page */}
				<Route
					path='/'
					element={<LoginPage />}
				/>

				{/* Protected Routes - Admin */}
				<Route
					path='/admin/dashboard'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/faculties'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/departments'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/lecturers'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/students'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/plagiarism'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/submissions'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/settings'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admin/profile'
					element={<AdminDashboard />}
				/>

				{/* Protected Routes - Lecturer */}
				<Route
					path='/lecturer/dashboard'
					element={<LecturerDashboard />}
				/>
				<Route
					path='/lecturer/courses'
					element={<LecturerDashboard />}
				/>
				<Route
					path='/lecturer/assignments'
					element={<LecturerDashboard />}
				/>
				<Route
					path='/lecturer/plagiarism'
					element={<LecturerDashboard />}
				/>
				<Route
					path='/lecturer/submissions'
					element={<LecturerDashboard />}
				/>
				<Route
					path='/lecturer/settings'
					element={<LecturerDashboard />}
				/>
				<Route
					path='/lecturer/profile'
					element={<LecturerDashboard />}
				/>

				{/* Protected Routes - Student */}
				<Route
					path='/student/dashboard'
					element={<StudentDashboard />}
				/>
				<Route
					path='/student/courses'
					element={<StudentDashboard />}
				/>
				<Route
					path='/student/assignments'
					element={<StudentDashboard />}
				/>
				<Route
					path='/student/submit'
					element={<StudentDashboard />}
				/>
				<Route
					path='/student/submissions'
					element={<StudentDashboard />}
				/>
				<Route
					path='/student/check'
					element={<StudentDashboard />}
				/>
				<Route
					path='/student/settings'
					element={<StudentDashboard />}
				/>
				<Route
					path='/student/profile'
					element={<StudentDashboard />}
				/>

				{/* Logout */}
				<Route
					path='/logout'
					element={
						<Navigate
							to='/'
							replace
						/>
					}
				/>

				{/* Optional: 404 Not Found Page */}
				<Route
					path='*'
					element={
						<div className='flex min-h-screen items-center justify-center bg-slate-50'>
							<div className='text-center'>
								<h1 className='text-6xl font-bold text-slate-800'>404</h1>
								<p className='mt-2 text-lg text-slate-600'>Page Not Found</p>
								<a
									href='/'
									className='mt-4 inline-block text-indigo-600 hover:text-indigo-700'>
									Go back home
								</a>
							</div>
						</div>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

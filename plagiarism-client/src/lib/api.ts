import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
	baseURL: 'http://localhost:5000/api',
	withCredentials: true,
});

// Request interceptor to add token to headers
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	},
);

// Dashboard API endpoints
export const dashboardAPI = {
	getStats: () => api.get('/dashboard/admin/counts'),
};

// Auth API endpoints
export const authAPI = {
	login: (credentials: { email: string; password: string }) =>
		api.post('/auth/login', credentials),
	register: (data: any) => api.post('/auth/register', data),
};

// Admin API endpoints
export const adminAPI = {
	getStudents: () => api.get('/students'),
	getLecturers: () => api.get('/lecturers'),
	getFaculties: () => api.get('/faculty'),
};

// Student API endpoints
export const studentAPI = {
	submitAssignment: (data: any) => api.post('/submissions', data),
	getResults: () => api.get('/submissions'),
};

// Lecturer API endpoints
export const lecturerAPI = {
	getCourses: () => api.get('/courses'),
	getStudents: () => api.get('/lecturer/students'),
};

export default api;

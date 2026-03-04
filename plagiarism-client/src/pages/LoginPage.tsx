import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/toast';
import { User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- INTERFACES ---
// Backend response structure from /api/auth/login
interface BackendResponse {
	success: boolean;
	message: string;
	data: {
		user: {
			id: number | string;
			email?: string;
			regNo?: string;
			firstName?: string;
			lastName?: string;
			name?: string;
			role: 'admin' | 'lecturer' | 'student';
			image?: string;
		};
		token: string;
	};
}

// Map backend role (lowercase) to frontend role display
const mapRoleToFrontend = (role: string): string => {
	switch (role) {
		case 'admin':
			return 'Admin';
		case 'lecturer':
			return 'Lecture';
		case 'student':
			return 'Student';
		default:
			return 'Student';
	}
};

// --- LOGIN COMPONENT ---
export function LoginPage() {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');

	const { addToast } = useToast();
	const navigate = useNavigate();

	// React Query mutation for login
	const loginMutation = useMutation({
		mutationFn: async (credentials: {
			identifier: string;
			password: string;
		}) => {
			const response = await api.post<BackendResponse>(
				'/auth/login',
				credentials,
			);
			return response.data;
		},
		onSuccess: (data) => {
			// Show success toast
			addToast(data.message, 'success');

			// Extract user and token from response structure
			const { user, token } = data.data;
			const frontendRole = mapRoleToFrontend(user.role);

			// Store token and user info in localStorage
			localStorage.setItem('token', token);
			localStorage.setItem('userRole', frontendRole);
			localStorage.setItem(
				'user',
				JSON.stringify({ ...user, role: frontendRole }),
			);

			// Redirect user based on role
			let redirectPath = '/';
			if (frontendRole === 'Student') redirectPath = '/student/dashboard';
			else if (frontendRole === 'Lecture') redirectPath = '/lecturer/dashboard';
			else if (frontendRole === 'Admin') redirectPath = '/admin/dashboard';

			// Navigate after short delay
			setTimeout(() => {
				navigate(redirectPath);
			}, 500);
		},
		onError: (error: unknown) => {
			// Handle errors with toast
			const err = error as {
				response?: { status?: number; data?: { message?: string } };
				message?: string;
			};

			if (err.response?.status === 401) {
				addToast('Invalid credentials or user not found.', 'error');
			} else if (err.response?.data?.message?.includes('suspended')) {
				addToast('Your account has been suspended. Contact admin.', 'error');
			} else if (err.response?.data?.message) {
				addToast(err.response.data.message, 'error');
			} else if (err.message === 'Network Error') {
				addToast('Cannot connect to the backend server.', 'error');
			} else {
				addToast('Login failed. Please try again.', 'error');
			}
		},
	});

	// Form submit handler
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate({ identifier, password });
	};

	// Check if loading
	const isLoading = loginMutation.isPending;

	return (
		<div
			className='flex items-center justify-center min-h-screen'
			style={{
				backgroundImage: `linear-gradient(45deg, rgba(42, 97, 116, 0.851), rgba(177, 216, 230,0.811)), url('/images/bg-3.jpg')`,
				backgroundSize: 'cover',
			}}>
			<Card className='w-full max-w-md shadow-2xl bg-white/90'>
				<CardHeader className='text-center'>
					{/* User icon */}
					<div className='mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4'>
						<User className='h-8 w-8 text-white' />
					</div>
					<CardTitle className='text-2xl font-bold'>Sign In</CardTitle>
					<CardDescription className='font-semibold'>
						OFFLINE ASSIGNMENT PLAGIARISM CHECKER
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Login form */}
					<form
						onSubmit={handleSubmit}
						className='space-y-4'>
						<div className='space-y-2'>
							<Input
								id='identifier'
								type='text'
								placeholder='Username / Registration Number'
								autoComplete='off'
								required
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								disabled={isLoading}
							/>
						</div>
						<div className='space-y-2'>
							<Input
								id='password'
								type='password'
								placeholder='Password'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
							/>
						</div>

						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Logging In...
								</>
							) : (
								'Login'
							)}
						</Button>
					</form>

					{/* Footer */}
					<div className='mt-4 text-center text-sm text-gray-500'>
						OAPC | Copy right © {new Date().getFullYear()} All rights reserved.
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

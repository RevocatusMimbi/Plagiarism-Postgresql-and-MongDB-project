import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';   //  React Query for handling async mutations
import { api } from '../lib/axios';                   //  Axios instance for API calls
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Terminal, User } from 'lucide-react';        // Icons
import { useNavigate } from 'react-router-dom';       // For navigation after login

// --- INTERFACES ---
// Defines the shape of the successful response from your backend's /auth/login
interface LoginResponse {
  token: string;
  user: {
    id: number | string;
    email?: string;
    regNo?: string;
    role: 'Admin' | 'Lecture' | 'Student';
    level: number;
  };
  message: string;
}

// --- LOGIN COMPONENT ---
export function LoginPage() {
  // Local state for form inputs and status messages
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');     
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navigate = useNavigate(); //  Hook for navigation

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { identifier: string; password: string }) => {
      // POST request to backend
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // 1. Show success message
      setStatusMessage({ type: 'success', text: data.message });

      // 2. Redirect user based on role
      const role = data.user.role;
      let redirectPath = '/';
      if (role === 'Student') redirectPath = '/student/home';
      else if (role === 'Lecture') redirectPath = '/lecture/dashboard';
      else if (role === 'Admin') redirectPath = '/admin/home';

      // Navigate to the correct page
      navigate(redirectPath);

      // Debug log (optional)
      console.log(`Login successful. User Role: ${role}. Redirecting to: ${redirectPath}`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // Handle errors gracefully
      let errorMessage = 'Wrong password or username, please try again.'; // Default

      if (error.response?.status === 401) {
        errorMessage = 'Invalid credentials or user not found.';
      } else if (error.response?.data?.message?.includes('suspended')) {
        errorMessage = 'Your Account has been suspended, Contact with admin.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Cannot connect to the backend server.';
      }

      setStatusMessage({ type: 'error', text: errorMessage });
    },
  });

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null); // Clear old messages
    loginMutation.mutate({ identifier, password }); // Trigger login mutation
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `linear-gradient(45deg, rgba(42, 97, 116, 0.851), rgba(177, 216, 230,0.811)), url('/images/bg-3.jpg')`,
        backgroundSize: 'cover',  
      }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-white/90">
        <CardHeader className="text-center">
          {/*  User icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="font-semibold">
            OFFLINE ASSIGNMENT PLAGIARISM CHECKER
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Alert messages for success/error */}
          {statusMessage && (
            <Alert
              variant={statusMessage.type === 'error' ? 'destructive' : 'default'}
              className={`mb-4 cursor-pointer ${
                statusMessage.type === 'error'
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-green-100 border-green-400 text-green-700'
              }`}
              onClick={() => setStatusMessage(null)} // Click to dismiss
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle>
                {statusMessage.type === 'error' ? 'Oops!' : 'SUCCESS:'}
              </AlertTitle>
              <AlertDescription>{statusMessage.text}</AlertDescription>
            </Alert>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="identifier"
                type="text"
                placeholder="Username"
                autoComplete="off"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging In...' : 'Login'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-sm text-gray-500">
            OAPC | Copy right © {new Date().getFullYear()} All rights reserved.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

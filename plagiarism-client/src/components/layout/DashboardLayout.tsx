import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import type { UserRole } from './AppSidebar';

interface DashboardLayoutProps {
	children: React.ReactNode;
	userName: string;
	role: UserRole;
}

export function DashboardLayout({
	children,
	userName,
	role,
}: DashboardLayoutProps) {
	return (
		<div className='flex min-h-screen bg-slate-50'>
			<AppSidebar
				role={role}
				userName={userName}
			/>
			<div className='flex-1 pl-72 transition-all duration-300'>
				<AppHeader
					userName={userName}
					role={role}
				/>
				<main className='min-h-[calc(100vh-4rem)] p-6'>
					<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
						{children}
					</div>
				</main>
				<footer className='border-t border-slate-200 bg-white px-6 py-4'>
					<p className='text-center text-xs text-slate-500'>
						ROAPC • RUCU Offline Assignments Plagiarism Checker • ©{' '}
						{new Date().getFullYear()} All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}

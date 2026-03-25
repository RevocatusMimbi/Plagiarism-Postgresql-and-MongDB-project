import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useSidebar } from '@/contexts/SidebarContext';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { collapsed } = useSidebar();

	return (
		<div className='flex min-h-screen'>
			<AppSidebar />
			<div
				className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
				<AppHeader />
				<main className='flex-1 p-6'>{children}</main>
				<footer className='border-t border-border bg-card px-6 py-3'>
					<p className='text-right text-xs text-muted-foreground'>
						ROAPC | Copyright © {new Date().getFullYear()} All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}

import { Link, useLocation } from 'react-router-dom';
import {
	Home,
	UserPlus,
	Users,
	Network,
	Settings,
	User,
	LogOut,
	ChevronLeft,
	FileSearch,
	FileText,
	GraduationCap,
	List,
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

const navItems = [
	{ heading: 'Dashboards' },
	{ label: 'Admin Home', icon: Home, path: '/' },
	{ heading: 'Lectures' },
	{ label: 'Add Lecture', icon: UserPlus, path: '/lectures/add' },
	{ label: 'Registered Lectures', icon: GraduationCap, path: '/lectures' },
	{ heading: 'Students' },
	{ label: 'Add Student', icon: Users, path: '/students/add' },
	{ label: 'Registered Students', icon: List, path: '/students' },
	{ heading: 'Faculty' },
	{ label: 'Add Faculty', icon: Network, path: '/faculty/add' },
	{ label: 'Registered Faculties', icon: List, path: '/faculty' },
	{ heading: 'Plagiarism' },
	{ label: 'Check Similarity', icon: FileSearch, path: '/similarity' },
	{ heading: 'Reports' },
	{ label: 'Reports', icon: FileText, path: '/reports' },
	{ heading: 'System' },
	{ label: 'Settings', icon: Settings, path: '/settings' },
	{ heading: 'My Account' },
	{ label: 'Full Profile', icon: User, path: '/profile' },
	{ label: 'Logout', icon: LogOut, path: '/logout' },
];

export function AppSidebar() {
	const { collapsed, toggleCollapsed } = useSidebar();
	const location = useLocation();

	return (
		<aside
			className={`fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ${
				collapsed ? 'w-16' : 'w-64'
			}`}>
			<div className='flex h-16 items-center justify-between border-b border-sidebar-border px-4'>
				{!collapsed && (
					<span className='font-display text-lg font-bold tracking-widest text-sidebar-primary-foreground'>
						R O A P C
					</span>
				)}
				<button
					onClick={toggleCollapsed}
					className='rounded-md p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
					<ChevronLeft
						className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
					/>
				</button>
			</div>

			<nav
				className='mt-2 space-y-0.5 overflow-y-auto px-3'
				style={{ height: 'calc(100vh - 4rem)' }}>
				{navItems.map((item, i) => {
					if ('heading' in item && !('label' in item)) {
						if (collapsed) return null;
						return (
							<p
								key={i}
								className='mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-heading'>
								{item.heading}
							</p>
						);
					}
					if (!('label' in item)) return null;
					const isActive = location.pathname === item.path;
					const Icon = item.icon!;
					return (
						<Link
							key={i}
							to={item.path!}
							className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
								isActive
									? 'bg-sidebar-accent text-sidebar-accent-foreground'
									: 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
							}`}>
							<Icon className='h-[18px] w-[18px] shrink-0' />
							{!collapsed && <span>{item.label}</span>}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}

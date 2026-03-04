import {
	Bell,
	Search,
	ChevronDown,
	LogOut,
	User,
	Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface AppHeaderProps {
	userName: string;
	role: 'admin' | 'lecturer' | 'student';
}

export function AppHeader({ userName, role }: AppHeaderProps) {
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const getRoleLabel = () => {
		switch (role) {
			case 'admin':
				return 'Administrator';
			case 'lecturer':
				return 'Lecturer';
			case 'student':
				return 'Student';
			default:
				return 'User';
		}
	};

	return (
		<header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 shadow-sm backdrop-blur-sm'>
			{/* Left side - Title */}
			<div className='flex items-center gap-4'>
				<div className='flex items-center gap-2'>
					<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md'>
						<span className='text-sm font-bold text-white'>R</span>
					</div>
					<span className='font-display text-base font-semibold tracking-wide text-slate-800'>
						RUCU Offline Assignments Plagiarism Checker
					</span>
				</div>
			</div>

			{/* Right side - Actions */}
			<div className='flex items-center gap-2'>
				{/* Search */}
				<button className='group relative rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700'>
					<Search className='h-5 w-5' />
					<span className='absolute right-0 top-0 h-2 w-2 rounded-full bg-indigo-500 opacity-0 transition-opacity group-hover:opacity-100' />
				</button>

				{/* Notifications */}
				<button className='group relative rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700'>
					<Bell className='h-5 w-5' />
					<span className='absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500' />
				</button>

				{/* Divider */}
				<div className='mx-2 h-8 w-px bg-slate-200' />

				{/* User Menu */}
				<div
					className='relative'
					ref={dropdownRef}>
					<button
						onClick={() => setShowDropdown(!showDropdown)}
						className='flex items-center gap-3 rounded-xl p-1.5 pr-3 transition-all hover:bg-slate-100'>
						<Avatar className='h-9 w-9 border-2 border-indigo-100 shadow-sm'>
							<AvatarFallback className='bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white'>
								{getInitials(userName)}
							</AvatarFallback>
						</Avatar>
						<div className='hidden text-left md:block'>
							<p className='text-sm font-medium text-slate-700'>{userName}</p>
							<p className='text-xs text-slate-500'>{getRoleLabel()}</p>
						</div>
						<ChevronDown
							className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
								showDropdown ? 'rotate-180' : ''
							}`}
						/>
					</button>

					{/* Dropdown Menu */}
					{showDropdown && (
						<div className='absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200'>
							<div className='border-b border-slate-100 px-4 pb-3 pt-2'>
								<p className='text-sm font-medium text-slate-800'>{userName}</p>
								<p className='text-xs text-slate-500'>{getRoleLabel()}</p>
							</div>
							<div className='py-1'>
								<Link
									to={`/${role}/profile`}
									className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900'
									onClick={() => setShowDropdown(false)}>
									<User className='h-4 w-4' />
									My Profile
								</Link>
								<Link
									to={`/${role}/settings`}
									className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900'
									onClick={() => setShowDropdown(false)}>
									<Settings className='h-4 w-4' />
									Settings
								</Link>
							</div>
							<div className='border-t border-slate-100 py-1'>
								<Link
									to='/logout'
									className='flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50'
									onClick={() => setShowDropdown(false)}>
									<LogOut className='h-4 w-4' />
									Logout
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

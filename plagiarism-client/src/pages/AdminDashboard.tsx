import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users, GraduationCap, BookOpen, FileText } from 'lucide-react';

const AdminDashboard: React.FC = () => {
	const { stats, isLoading } = useDashboard();

	const statData = [
		{
			title: 'Total Students',
			subtitle: 'Registered students',
			value: stats?.totalStudents || 0,
			icon: Users,
			gradient: 'midnight' as const,
			link: '/students',
		},
		{
			title: 'Total Lecturers',
			subtitle: 'Registered lecturers',
			value: stats?.totalLecturers || 0,
			icon: GraduationCap,
			gradient: 'asteroid' as const,
			link: '/lectures',
		},
		{
			title: 'Total Courses',
			subtitle: 'Available courses',
			value: stats?.totalCourses || 0,
			icon: BookOpen,
			gradient: 'royal' as const,
			link: '/courses',
		},
		{
			title: 'Total Submissions',
			subtitle: 'Assignments submitted',
			value: stats?.totalSubmissions || 0,
			icon: FileText,
			gradient: 'love-kiss' as const,
			link: '/submissions',
		},
	];

	if (isLoading) {
		return (
			<DashboardLayout>
				<div className='flex items-center justify-center h-64'>
					<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className='space-y-6'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
					<p className='mt-2 text-gray-600'>
						Welcome back! Here's what's happening with your institution.
					</p>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{statData.map((stat, index) => (
						<StatCard
							key={index}
							title={stat.title}
							subtitle={stat.subtitle}
							value={stat.value}
							icon={stat.icon}
							gradient={stat.gradient}
							link={stat.link}
						/>
					))}
				</div>

				{/* Additional Dashboard Content */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					<div className='bg-white p-6 rounded-lg shadow-md'>
						<h2 className='text-xl font-semibold text-gray-900 mb-4'>
							Recent Activity
						</h2>
						<div className='space-y-4'>
							<div className='flex items-center space-x-4'>
								<div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
									<span className='text-blue-600 font-semibold'>S</span>
								</div>
								<div className='flex-1'>
									<p className='text-sm font-medium text-gray-900'>
										New student registered
									</p>
									<p className='text-xs text-gray-500'>2 hours ago</p>
								</div>
							</div>
							<div className='flex items-center space-x-4'>
								<div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
									<span className='text-green-600 font-semibold'>L</span>
								</div>
								<div className='flex-1'>
									<p className='text-sm font-medium text-gray-900'>
										New lecturer added
									</p>
									<p className='text-xs text-gray-500'>5 hours ago</p>
								</div>
							</div>
						</div>
					</div>

					<div className='bg-white p-6 rounded-lg shadow-md'>
						<h2 className='text-xl font-semibold text-gray-900 mb-4'>
							System Status
						</h2>
						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-gray-600'>Server Status</span>
								<span className='text-sm font-medium text-green-600'>
									Online
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-gray-600'>Database</span>
								<span className='text-sm font-medium text-green-600'>
									Connected
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-gray-600'>API Service</span>
								<span className='text-sm font-medium text-green-600'>
									Running
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default AdminDashboard;

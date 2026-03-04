import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import {
	Network,
	Users,
	GraduationCap,
	FileSearch,
	AlertTriangle,
	CheckCircle,
	Clock,
	TrendingUp,
} from 'lucide-react';

// Mock data - In production, this would come from API calls
const adminStats = {
	faculties: 12,
	students: 348,
	lecturers: 45,
	submissions: 156,
};

const recentPlagiarismChecks = [
	{
		id: 1,
		student: 'John Doe',
		course: 'Database Systems',
		similarity: 23,
		status: 'Pass',
		date: '2 min ago',
	},
	{
		id: 2,
		student: 'Jane Smith',
		course: 'Software Engineering',
		similarity: 67,
		status: 'Flag',
		date: '5 min ago',
	},
	{
		id: 3,
		student: 'Mike Johnson',
		course: 'Data Structures',
		similarity: 12,
		status: 'Pass',
		date: '12 min ago',
	},
	{
		id: 4,
		student: 'Sarah Wilson',
		course: 'Computer Networks',
		similarity: 89,
		status: 'Fail',
		date: '18 min ago',
	},
	{
		id: 5,
		student: 'David Brown',
		course: 'Algorithms',
		similarity: 45,
		status: 'Flag',
		date: '25 min ago',
	},
];

const getStatusStyles = (status: string) => {
	switch (status) {
		case 'Pass':
			return 'bg-emerald-100 text-emerald-700 border-emerald-200';
		case 'Flag':
			return 'bg-amber-100 text-amber-700 border-amber-200';
		case 'Fail':
			return 'bg-red-100 text-red-700 border-red-200';
		default:
			return 'bg-slate-100 text-slate-700 border-slate-200';
	}
};

const getSimilarityColor = (similarity: number) => {
	if (similarity < 25) return 'text-emerald-600';
	if (similarity < 50) return 'text-amber-600';
	if (similarity < 75) return 'text-orange-600';
	return 'text-red-600';
};

const Admin = () => {
	return (
		<DashboardLayout
			userName='Admin User'
			role='admin'>
			{/* Page heading */}
			<div className='mb-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100'>
				<div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20'>
					<TrendingUp className='h-7 w-7 text-white' />
				</div>
				<div>
					<h1 className='font-display text-xl font-bold text-slate-800'>
						Admin Dashboard
					</h1>
					<p className='text-sm text-slate-500'>
						Overview of the system and plagiarism statistics
					</p>
				</div>
			</div>

			{/* Stat cards */}
			<div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='Faculties'
					subtitle='Total Number of Faculties'
					value={adminStats.faculties}
					icon={Network}
					gradient='midnight'
					link='/admin/faculties'
					trend={{ value: 8, isPositive: true }}
				/>
				<StatCard
					title='Students'
					subtitle='Total Registered Students'
					value={adminStats.students}
					icon={Users}
					gradient='royal'
					link='/admin/students'
					trend={{ value: 12, isPositive: true }}
				/>
				<StatCard
					title='Lecturers'
					subtitle='Total Registered Lectures'
					value={adminStats.lecturers}
					icon={GraduationCap}
					gradient='emerald'
					link='/admin/lecturers'
					trend={{ value: 5, isPositive: true }}
				/>
				<StatCard
					title='Submissions'
					subtitle='Total Assignments Submitted'
					value={adminStats.submissions}
					icon={FileSearch}
					gradient='amber'
					link='/admin/submissions'
					trend={{ value: 23, isPositive: true }}
				/>
			</div>

			{/* Recent Plagiarism Checks */}
			<div className='mt-8 rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden'>
				<div className='border-b border-slate-100 px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div>
							<h2 className='font-display text-lg font-semibold text-slate-800'>
								Recent Plagiarism Checks
							</h2>
							<p className='text-sm text-slate-500'>
								Latest submission similarity analysis
							</p>
						</div>
						<div className='flex items-center gap-2'>
							<span className='flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700'>
								<CheckCircle className='h-3.5 w-3.5' />
								{
									recentPlagiarismChecks.filter((s) => s.status === 'Pass')
										.length
								}{' '}
								Pass
							</span>
							<span className='flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700'>
								<AlertTriangle className='h-3.5 w-3.5' />
								{
									recentPlagiarismChecks.filter((s) => s.status === 'Flag')
										.length
								}{' '}
								Flagged
							</span>
							<span className='flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700'>
								<AlertTriangle className='h-3.5 w-3.5' />
								{
									recentPlagiarismChecks.filter((s) => s.status === 'Fail')
										.length
								}{' '}
								Failed
							</span>
						</div>
					</div>
				</div>

				<div className='divide-y divide-slate-100'>
					{recentPlagiarismChecks.map((item) => (
						<div
							key={item.id}
							className='flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50'>
							<div className='flex items-center gap-4'>
								<div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 font-bold text-indigo-600'>
									{item.student.charAt(0)}
								</div>
								<div>
									<p className='text-sm font-medium text-slate-800'>
										{item.student}
									</p>
									<p className='text-xs text-slate-500'>{item.course}</p>
								</div>
							</div>
							<div className='flex items-center gap-6'>
								<div className='flex items-center gap-1.5 text-slate-400'>
									<Clock className='h-4 w-4' />
									<span className='text-xs'>{item.date}</span>
								</div>
								<div className='text-right min-w-[80px]'>
									<p
										className={`font-display text-lg font-bold ${getSimilarityColor(item.similarity)}`}>
										{item.similarity}%
									</p>
									<p className='text-xs text-slate-400'>similarity</p>
								</div>
								<span
									className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border ${getStatusStyles(item.status)}`}>
									{item.status}
								</span>
							</div>
						</div>
					))}
				</div>

				<div className='border-t border-slate-100 px-6 py-4'>
					<button className='text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors'>
						View all submissions →
					</button>
				</div>
			</div>

			{/* Quick Actions */}
			<div className='mt-8 grid gap-5 md:grid-cols-3'>
				<div className='rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg'>
					<h3 className='font-display text-lg font-semibold mb-2'>
						Quick Plagiarism Check
					</h3>
					<p className='text-indigo-100 text-sm mb-4'>
						Upload and check documents for plagiarism instantly
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Check Now →
					</button>
				</div>
				<div className='rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg'>
					<h3 className='font-display text-lg font-semibold mb-2'>
						Generate Reports
					</h3>
					<p className='text-emerald-100 text-sm mb-4'>
						Create detailed reports on plagiarism statistics
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Generate →
					</button>
				</div>
				<div className='rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg'>
					<h3 className='font-display text-lg font-semibold mb-2'>
						System Settings
					</h3>
					<p className='text-amber-100 text-sm mb-4'>
						Configure plagiarism detection thresholds
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Configure →
					</button>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Admin;

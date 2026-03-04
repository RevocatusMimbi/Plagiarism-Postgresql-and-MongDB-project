import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import {
	BookOpen,
	FileText,
	FileSearch,
	Clock,
	CheckCircle,
	AlertTriangle,
	TrendingUp,
	Upload,
	History,
	Award,
} from 'lucide-react';

// Mock data - In production, this would come from API calls
const studentStats = {
	courses: 4,
	assignments: 8,
	submissions: 6,
	pending: 2,
};

const mySubmissions = [
	{
		id: 1,
		assignment: 'Database Design Project',
		course: 'Database Systems',
		similarity: 12,
		status: 'Pass',
		date: '2 days ago',
	},
	{
		id: 2,
		assignment: 'UML Class Diagram',
		course: 'Software Engineering',
		similarity: 0,
		status: 'Pass',
		date: '5 days ago',
	},
	{
		id: 3,
		assignment: 'SQL Queries Assignment',
		course: 'Database Systems',
		similarity: 8,
		status: 'Pass',
		date: '1 week ago',
	},
	{
		id: 4,
		assignment: 'Algorithm Analysis',
		course: 'Data Structures',
		similarity: 5,
		status: 'Pass',
		date: '1 week ago',
	},
];

const upcomingAssignments = [
	{
		id: 1,
		assignment: 'Web Application Design',
		course: 'Web Development',
		dueDate: '3 days',
		status: 'Upcoming',
	},
	{
		id: 2,
		assignment: 'Network Protocol Report',
		course: 'Computer Networks',
		dueDate: '5 days',
		status: 'Upcoming',
	},
	{
		id: 3,
		assignment: 'Data Mining Essay',
		course: 'Data Science',
		dueDate: '1 week',
		status: 'Upcoming',
	},
];

const getSimilarityColor = (similarity: number) => {
	if (similarity < 25) return 'text-emerald-600';
	if (similarity < 50) return 'text-amber-600';
	if (similarity < 75) return 'text-orange-600';
	return 'text-red-600';
};

const getSimilarityBg = (similarity: number) => {
	if (similarity < 25) return 'bg-emerald-100';
	if (similarity < 50) return 'bg-amber-100';
	if (similarity < 75) return 'bg-orange-100';
	return 'bg-red-100';
};

const StudentDashboard = () => {
	const averageSimilarity =
		mySubmissions.length > 0
			? Math.round(
					mySubmissions.reduce((acc, sub) => acc + sub.similarity, 0) /
						mySubmissions.length,
				)
			: 0;

	return (
		<DashboardLayout
			userName='John Doe'
			role='student'>
			{/* Page heading */}
			<div className='mb-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100'>
				<div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20'>
					<TrendingUp className='h-7 w-7 text-white' />
				</div>
				<div>
					<h1 className='font-display text-xl font-bold text-slate-800'>
						Student Dashboard
					</h1>
					<p className='text-sm text-slate-500'>
						Track your assignments and submission status
					</p>
				</div>
			</div>

			{/* Welcome Banner */}
			<div className='mb-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-lg'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='font-display text-2xl font-bold mb-1'>
							Welcome back, John!
						</h2>
						<p className='text-indigo-100'>
							You have {studentStats.pending} pending assignments to submit
						</p>
					</div>
					<div className='hidden md:flex items-center gap-4'>
						<div className='text-center px-4'>
							<p className='text-3xl font-bold'>{averageSimilarity}%</p>
							<p className='text-sm text-indigo-200'>Avg. Similarity</p>
						</div>
						<div className='h-12 w-px bg-white/20' />
						<div className='text-center px-4'>
							<p className='text-3xl font-bold'>{studentStats.submissions}</p>
							<p className='text-sm text-indigo-200'>Submitted</p>
						</div>
					</div>
				</div>
			</div>

			{/* Stat cards */}
			<div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='My Courses'
					subtitle='Enrolled courses'
					value={studentStats.courses}
					icon={BookOpen}
					gradient='royal'
					link='/student/courses'
				/>
				<StatCard
					title='Total Assignments'
					subtitle='Assigned this semester'
					value={studentStats.assignments}
					icon={FileText}
					gradient='emerald'
					link='/student/assignments'
				/>
				<StatCard
					title='Submitted'
					subtitle='Completed submissions'
					value={studentStats.submissions}
					icon={CheckCircle}
					gradient='amber'
					link='/student/submissions'
					trend={{ value: 15, isPositive: true }}
				/>
				<StatCard
					title='Pending'
					subtitle='Awaiting submission'
					value={studentStats.pending}
					icon={Clock}
					gradient='rose'
					link='/student/submit'
				/>
			</div>

			<div className='mt-8 grid gap-6 lg:grid-cols-2'>
				{/* My Submissions */}
				<div className='rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden'>
					<div className='border-b border-slate-100 px-6 py-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<History className='h-5 w-5 text-indigo-600' />
								<h2 className='font-display text-lg font-semibold text-slate-800'>
									My Submissions
								</h2>
							</div>
							<button className='text-sm font-medium text-indigo-600 hover:text-indigo-700'>
								View all →
							</button>
						</div>
					</div>

					<div className='divide-y divide-slate-100'>
						{mySubmissions.map((item) => (
							<div
								key={item.id}
								className='flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50'>
								<div className='flex items-center gap-3'>
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-full ${getSimilarityBg(item.similarity)}`}>
										<FileText
											className={`h-5 w-5 ${getSimilarityColor(item.similarity)}`}
										/>
									</div>
									<div>
										<p className='text-sm font-medium text-slate-800'>
											{item.assignment}
										</p>
										<p className='text-xs text-slate-500'>{item.course}</p>
									</div>
								</div>
								<div className='flex items-center gap-4'>
									<div className='flex items-center gap-1.5 text-slate-400'>
										<Clock className='h-4 w-4' />
										<span className='text-xs'>{item.date}</span>
									</div>
									<div className='text-right min-w-[50px]'>
										<p
											className={`font-display text-base font-bold ${getSimilarityColor(item.similarity)}`}>
											{item.similarity}%
										</p>
									</div>
									<span className='flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>
										<CheckCircle className='h-3 w-3' />
										{item.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Upcoming Assignments */}
				<div className='rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden'>
					<div className='border-b border-slate-100 px-6 py-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<AlertTriangle className='h-5 w-5 text-amber-600' />
								<h2 className='font-display text-lg font-semibold text-slate-800'>
									Upcoming Assignments
								</h2>
							</div>
							<button className='text-sm font-medium text-indigo-600 hover:text-indigo-700'>
								View all →
							</button>
						</div>
					</div>

					<div className='divide-y divide-slate-100'>
						{upcomingAssignments.map((item) => (
							<div
								key={item.id}
								className='flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50'>
								<div className='flex items-center gap-3'>
									<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100'>
										<Clock className='h-5 w-5 text-amber-600' />
									</div>
									<div>
										<p className='text-sm font-medium text-slate-800'>
											{item.assignment}
										</p>
										<p className='text-xs text-slate-500'>{item.course}</p>
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
										Due in {item.dueDate}
									</span>
									<button className='rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700'>
										Submit
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className='mt-8 grid gap-5 md:grid-cols-3'>
				<div className='rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg'>
					<div className='flex items-center gap-3 mb-3'>
						<Upload className='h-6 w-6' />
						<h3 className='font-display text-lg font-semibold'>
							Submit Assignment
						</h3>
					</div>
					<p className='text-emerald-100 text-sm mb-4'>
						Upload your assignment for plagiarism checking
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Submit Now →
					</button>
				</div>
				<div className='rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg'>
					<div className='flex items-center gap-3 mb-3'>
						<FileSearch className='h-6 w-6' />
						<h3 className='font-display text-lg font-semibold'>
							Check My Work
						</h3>
					</div>
					<p className='text-blue-100 text-sm mb-4'>
						Check your work for potential plagiarism before submitting
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Check Now →
					</button>
				</div>
				<div className='rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg'>
					<div className='flex items-center gap-3 mb-3'>
						<Award className='h-6 w-6' />
						<h3 className='font-display text-lg font-semibold'>View History</h3>
					</div>
					<p className='text-purple-100 text-sm mb-4'>
						View all your past submissions and plagiarism reports
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						View History →
					</button>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default StudentDashboard;

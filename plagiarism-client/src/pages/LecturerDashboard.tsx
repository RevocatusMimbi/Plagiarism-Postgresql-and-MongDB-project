import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import {
	BookOpen,
	Users,
	FileText,
	FileSearch,
	Clock,
	TrendingUp,
	Award,
} from 'lucide-react';

// Mock data - In production, this would come from API calls
const lecturerStats = {
	courses: 5,
	students: 180,
	assignments: 12,
	pendingChecks: 28,
};

const recentSubmissions = [
	{
		id: 1,
		student: 'Alice Johnson',
		assignment: 'Database Design',
		course: 'Database Systems',
		similarity: 15,
		status: 'Pass',
		date: '10 min ago',
	},
	{
		id: 2,
		student: 'Bob Smith',
		assignment: 'UML Diagrams',
		course: 'Software Engineering',
		similarity: 78,
		status: 'Fail',
		date: '25 min ago',
	},
	{
		id: 3,
		student: 'Carol Williams',
		assignment: 'SQL Queries',
		course: 'Database Systems',
		similarity: 8,
		status: 'Pass',
		date: '1 hour ago',
	},
	{
		id: 4,
		student: 'David Brown',
		assignment: 'API Design',
		course: 'Web Development',
		similarity: 52,
		status: 'Flag',
		date: '2 hours ago',
	},
];

const myCourses = [
	{
		id: 1,
		name: 'Database Systems',
		students: 45,
		submissions: 38,
		pending: 7,
	},
	{
		id: 2,
		name: 'Software Engineering',
		students: 38,
		submissions: 30,
		pending: 8,
	},
	{ id: 3, name: 'Data Structures', students: 52, submissions: 45, pending: 7 },
	{
		id: 4,
		name: 'Web Development',
		students: 45,
		submissions: 32,
		pending: 13,
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

const LecturerDashboard = () => {
	return (
		<DashboardLayout
			userName='Dr. John Smith'
			role='lecturer'>
			{/* Page heading */}
			<div className='mb-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100'>
				<div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20'>
					<TrendingUp className='h-7 w-7 text-white' />
				</div>
				<div>
					<h1 className='font-display text-xl font-bold text-slate-800'>
						Lecturer Dashboard
					</h1>
					<p className='text-sm text-slate-500'>
						Manage your courses and check submissions
					</p>
				</div>
			</div>

			{/* Stat cards */}
			<div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='My Courses'
					subtitle='Active courses assigned'
					value={lecturerStats.courses}
					icon={BookOpen}
					gradient='royal'
					link='/lecturer/courses'
					trend={{ value: 2, isPositive: true }}
				/>
				<StatCard
					title='Total Students'
					subtitle='Students in all courses'
					value={lecturerStats.students}
					icon={Users}
					gradient='emerald'
					link='/lecturer/students'
					trend={{ value: 15, isPositive: true }}
				/>
				<StatCard
					title='Assignments'
					subtitle='Active assignments'
					value={lecturerStats.assignments}
					icon={FileText}
					gradient='amber'
					link='/lecturer/assignments'
					trend={{ value: 3, isPositive: true }}
				/>
				<StatCard
					title='Pending Checks'
					subtitle='Submissions awaiting review'
					value={lecturerStats.pendingChecks}
					icon={FileSearch}
					gradient='rose'
					link='/lecturer/submissions'
					trend={{ value: 8, isPositive: false }}
				/>
			</div>

			<div className='mt-8 grid gap-6 lg:grid-cols-2'>
				{/* Recent Submissions */}
				<div className='rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden'>
					<div className='border-b border-slate-100 px-6 py-4'>
						<div className='flex items-center justify-between'>
							<div>
								<h2 className='font-display text-lg font-semibold text-slate-800'>
									Recent Submissions
								</h2>
								<p className='text-sm text-slate-500'>
									Latest assignment submissions
								</p>
							</div>
							<button className='text-sm font-medium text-indigo-600 hover:text-indigo-700'>
								View all →
							</button>
						</div>
					</div>

					<div className='divide-y divide-slate-100'>
						{recentSubmissions.map((item) => (
							<div
								key={item.id}
								className='flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50'>
								<div className='flex items-center gap-3'>
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 font-bold text-blue-600'>
										{item.student.charAt(0)}
									</div>
									<div>
										<p className='text-sm font-medium text-slate-800'>
											{item.student}
										</p>
										<p className='text-xs text-slate-500'>
											{item.assignment} • {item.course}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-4'>
									<div className='flex items-center gap-1.5 text-slate-400'>
										<Clock className='h-4 w-4' />
										<span className='text-xs'>{item.date}</span>
									</div>
									<div className='text-right min-w-[60px]'>
										<p
											className={`font-display text-base font-bold ${getSimilarityColor(item.similarity)}`}>
											{item.similarity}%
										</p>
									</div>
									<span
										className={`rounded-full px-3 py-1 text-xs font-semibold border ${getStatusStyles(item.status)}`}>
										{item.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* My Courses Overview */}
				<div className='rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden'>
					<div className='border-b border-slate-100 px-6 py-4'>
						<div className='flex items-center justify-between'>
							<div>
								<h2 className='font-display text-lg font-semibold text-slate-800'>
									My Courses
								</h2>
								<p className='text-sm text-slate-500'>
									Course overview and submission status
								</p>
							</div>
							<button className='text-sm font-medium text-indigo-600 hover:text-indigo-700'>
								Manage →
							</button>
						</div>
					</div>

					<div className='divide-y divide-slate-100'>
						{myCourses.map((course) => (
							<div
								key={course.id}
								className='flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50'>
								<div className='flex items-center gap-3'>
									<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100'>
										<BookOpen className='h-5 w-5 text-emerald-600' />
									</div>
									<div>
										<p className='text-sm font-medium text-slate-800'>
											{course.name}
										</p>
										<p className='text-xs text-slate-500'>
											{course.students} students
										</p>
									</div>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-center'>
										<p className='text-sm font-semibold text-slate-800'>
											{course.submissions}
										</p>
										<p className='text-xs text-slate-500'>Submitted</p>
									</div>
									<div className='text-center'>
										<p className='text-sm font-semibold text-amber-600'>
											{course.pending}
										</p>
										<p className='text-xs text-slate-500'>Pending</p>
									</div>
									<div className='h-8 w-24 rounded-full bg-slate-100 overflow-hidden'>
										<div
											className='h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all'
											style={{
												width: `${(course.submissions / course.students) * 100}%`,
											}}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className='mt-8 grid gap-5 md:grid-cols-3'>
				<div className='rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg'>
					<div className='flex items-center gap-3 mb-3'>
						<FileSearch className='h-6 w-6' />
						<h3 className='font-display text-lg font-semibold'>
							Check Plagiarism
						</h3>
					</div>
					<p className='text-blue-100 text-sm mb-4'>
						Review and check student submissions for plagiarism
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Check Now →
					</button>
				</div>
				<div className='rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg'>
					<div className='flex items-center gap-3 mb-3'>
						<FileText className='h-6 w-6' />
						<h3 className='font-display text-lg font-semibold'>
							Grade Assignments
						</h3>
					</div>
					<p className='text-emerald-100 text-sm mb-4'>
						Review and grade pending student submissions
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Grade Now →
					</button>
				</div>
				<div className='rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg'>
					<div className='flex items-center gap-3 mb-3'>
						<Award className='h-6 w-6' />
						<h3 className='font-display text-lg font-semibold'>
							Generate Report
						</h3>
					</div>
					<p className='text-purple-100 text-sm mb-4'>
						Create course plagiarism reports and statistics
					</p>
					<button className='rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20'>
						Generate →
					</button>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default LecturerDashboard;

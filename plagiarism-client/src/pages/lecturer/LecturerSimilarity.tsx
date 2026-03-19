import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LecturerLayout } from '@/components/layout/LecturerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	FileSearch,
	ArrowLeft,
	BookOpen,
	FileText,
	Users,
	Loader2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PageLoader } from '@/components/PageLoader';
import { usePageLoading } from '@/hooks/usePageLoading';
import {
	courses,
	assignments,
	submissions,
	calculateGST,
	type Course,
	type Assignment,
	type GstResult,
	type Submission,
} from '@/data/similarityMockData';
import { ComparisonDetail } from '@/components/similarity/ComparisonDetail';

type View = 'courses' | 'assignments' | 'submissions' | 'dualResult';

const LecturerSimilarity = () => {
	const navigate = useNavigate();
	const isLoading = usePageLoading();

	const [view, setView] = useState<View>('courses');
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [selectedAssignment, setSelectedAssignment] =
		useState<Assignment | null>(null);
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [checking, setChecking] = useState(false);

	// Dual comparison state
	const [dualResult, setDualResult] = useState<{
		subA: Submission;
		subB: Submission;
		gst: GstResult;
	} | null>(null);

	// Filtered data
	const courseAssignments = useMemo(
		() =>
			selectedCourse
				? assignments.filter((a) => a.courseId === selectedCourse.id)
				: [],
		[selectedCourse],
	);

	const assignmentSubmissions = useMemo(
		() =>
			selectedAssignment
				? submissions.filter((s) => s.assignmentId === selectedAssignment.id)
				: [],
		[selectedAssignment],
	);

	const allSelected =
		assignmentSubmissions.length > 0 &&
		assignmentSubmissions.every((s) => selected.has(s.id));
	const someSelected = selected.size > 0 && !allSelected;

	// Handlers
	const handleCourseClick = (course: Course) => {
		setSelectedCourse(course);
		setSelectedAssignment(null);
		setSelected(new Set());
		setDualResult(null);
		setView('assignments');
	};

	const handleAssignmentClick = (assignment: Assignment) => {
		setSelectedAssignment(assignment);
		setSelected(new Set());
		setDualResult(null);
		setView('submissions');
	};

	const handleBack = () => {
		if (view === 'dualResult') {
			setView('submissions');
			setDualResult(null);
		} else if (view === 'submissions') {
			setView('assignments');
			setSelected(new Set());
		} else if (view === 'assignments') {
			setView('courses');
			setSelectedCourse(null);
		}
	};

	const toggleOne = (id: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const toggleAll = () => {
		if (allSelected) {
			setSelected(new Set());
		} else {
			setSelected(new Set(assignmentSubmissions.map((s) => s.id)));
		}
	};

	const handleCompare = async () => {
		const selectedSubs = assignmentSubmissions.filter((s) =>
			selected.has(s.id),
		);
		if (selectedSubs.length < 2) {
			toast({
				title: 'Selection Required',
				description: 'Select at least 2 submissions.',
				variant: 'destructive',
			});
			return;
		}

		setChecking(true);
		await new Promise((r) => setTimeout(r, 1200));
		setChecking(false);

		if (selectedSubs.length === 2) {
			// Scenario A: Dual comparison
			const gst = calculateGST(selectedSubs[0].text, selectedSubs[1].text);
			setDualResult({
				subA: selectedSubs[0],
				subB: selectedSubs[1],
				gst,
			});
			setView('dualResult');
			toast({
				title: 'Comparison Complete',
				description: 'Showing side-by-side results.',
			});
		} else {
			// Scenario B: Bulk comparison → navigate to matrix page
			navigate('/lecturer/similarity/matrix', {
				state: {
					submissions: selectedSubs,
					assignmentTitle: selectedAssignment?.title,
					courseCode: selectedCourse?.code,
				},
			});
		}
	};

	// Breadcrumb
	const breadcrumb = () => {
		const parts: string[] = ['Courses'];
		if (selectedCourse) parts.push(`${selectedCourse.code}`);
		if (selectedAssignment) parts.push(selectedAssignment.title);
		if (view === 'dualResult') parts.push('Comparison');
		return parts;
	};

	if (isLoading)
		return (
			<LecturerLayout>
				<PageLoader />
			</LecturerLayout>
		);

	return (
		<LecturerLayout>
			{/* Header */}
			<div className='mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500'>
				{view !== 'courses' && (
					<Button
						variant='ghost'
						size='icon'
						onClick={handleBack}
						className='mr-1'>
						<ArrowLeft className='h-5 w-5' />
					</Button>
				)}
				<FileSearch className='h-6 w-6 text-primary' />
				<div className='flex-1'>
					<h1 className='font-display text-xl font-bold text-foreground'>
						Check Similarity
					</h1>
					<div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
						{breadcrumb().map((part, i) => (
							<span
								key={i}
								className='flex items-center gap-1.5'>
								{i > 0 && <span className='text-border'>/</span>}
								<span
									className={
										i === breadcrumb().length - 1
											? 'text-foreground font-medium'
											: ''
									}>
									{part}
								</span>
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Level 1: Course Grid */}
			{view === 'courses' && (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{courses.map((course, idx) => {
						const count = assignments.filter(
							(a) => a.courseId === course.id,
						).length;
						return (
							<Card
								key={course.id}
								className='cursor-pointer shadow-card transition-all hover:shadow-lg hover:border-primary/40 animate-in fade-in slide-in-from-bottom-4 duration-500'
								style={{ animationDelay: `${idx * 60}ms` }}
								onClick={() => handleCourseClick(course)}>
								<CardContent className='flex items-start gap-4 pt-6'>
									<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
										<BookOpen className='h-5 w-5 text-primary' />
									</div>
									<div>
										<p className='font-display font-bold text-foreground'>
											{course.code}
										</p>
										<p className='text-sm text-muted-foreground'>
											{course.name}
										</p>
										<Badge
											variant='secondary'
											className='mt-2 text-xs'>
											{count} assignments
										</Badge>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{/* Level 2: Assignments */}
			{view === 'assignments' && selectedCourse && (
				<div className='space-y-3'>
					{courseAssignments.map((a, idx) => {
						const subCount = submissions.filter(
							(s) => s.assignmentId === a.id,
						).length;
						return (
							<Card
								key={a.id}
								className='cursor-pointer shadow-card transition-all hover:shadow-lg hover:border-primary/40 animate-in fade-in slide-in-from-bottom-4 duration-500'
								style={{ animationDelay: `${idx * 60}ms` }}
								onClick={() => handleAssignmentClick(a)}>
								<CardContent className='flex items-center gap-4 py-4'>
									<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
										<FileText className='h-5 w-5 text-primary' />
									</div>
									<div className='flex-1'>
										<p className='font-medium text-foreground'>{a.title}</p>
										<p className='text-xs text-muted-foreground'>
											{subCount} submissions
										</p>
									</div>
									<Users className='h-4 w-4 text-muted-foreground' />
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{/* Level 3: Submission Table */}
			{view === 'submissions' && selectedAssignment && (
				<>
					<div className='mb-4 flex items-center justify-between rounded-xl bg-card px-5 py-3 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-500'>
						<label className='flex items-center gap-3 cursor-pointer'>
							<Checkbox
								checked={
									allSelected ? true : someSelected ? 'indeterminate' : false
								}
								onCheckedChange={toggleAll}
							/>
							<span className='text-sm font-medium text-foreground'>
								Select All ({selected.size}/{assignmentSubmissions.length})
							</span>
						</label>
						<Button
							onClick={handleCompare}
							disabled={selected.size < 2 || checking}>
							{checking ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' /> Comparing…
								</>
							) : (
								<>
									<FileSearch className='mr-2 h-4 w-4' /> Compare Selected (
									{selected.size})
								</>
							)}
						</Button>
					</div>

					<Card className='shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500'>
						<CardHeader>
							<CardTitle className='font-display text-base'>
								{selectedAssignment.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-12'>
											<Checkbox
												checked={
													allSelected
														? true
														: someSelected
															? 'indeterminate'
															: false
												}
												onCheckedChange={toggleAll}
											/>
										</TableHead>
										<TableHead>Student Name</TableHead>
										<TableHead>Reg Number</TableHead>
										<TableHead>Date Submitted</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{assignmentSubmissions.map((sub) => (
										<TableRow
											key={sub.id}
											className='cursor-pointer transition-colors'
											onClick={() => toggleOne(sub.id)}>
											<TableCell>
												<Checkbox
													checked={selected.has(sub.id)}
													onCheckedChange={() => toggleOne(sub.id)}
													onClick={(e) => e.stopPropagation()}
												/>
											</TableCell>
											<TableCell className='font-medium'>
												{sub.studentName}
											</TableCell>
											<TableCell className='text-muted-foreground'>
												{sub.regNumber}
											</TableCell>
											<TableCell className='text-muted-foreground'>
												{sub.dateSubmitted}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</>
			)}

			{/* Scenario A: Dual Comparison Detail View */}
			{view === 'dualResult' && dualResult && (
				<ComparisonDetail
					leftName={dualResult.subA.studentName}
					leftMeta={dualResult.subA.regNumber}
					rightName={dualResult.subB.studentName}
					rightMeta={dualResult.subB.regNumber}
					gst={dualResult.gst}
					onBack={handleBack}
				/>
			)}
		</LecturerLayout>
	);
};

export default LecturerSimilarity;

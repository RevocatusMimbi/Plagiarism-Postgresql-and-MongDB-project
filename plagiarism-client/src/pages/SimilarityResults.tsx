import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	ArrowLeft,
	Eye,
	FileSearch,
	Loader2,
	ChevronLeft,
	ChevronRight,
	Search,
	Download,
	GraduationCap,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PageLoader } from '@/components/PageLoader';
import { usePageLoading } from '@/hooks/usePageLoading';
import {
	generateComparisonPairs,
	findHighlightedSegments,
	type Submission,
	type ComparisonPair,
} from '@/data/similarityMockData';

const PAGE_SIZE = 10;

const AdminComparisonMatrix = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isLoading = usePageLoading();

	const subs: Submission[] = location.state?.submissions || [];
	const assignmentTitle: string =
		location.state?.assignmentTitle || 'Assignment';
	const courseCode: string = location.state?.courseCode || '';
	const courseName: string = location.state?.courseName || '';
	const lecturer: string = location.state?.lecturer || '';

	const [processing, setProcessing] = useState(true);
	const [pairs, setPairs] = useState<ComparisonPair[]>([]);
	const [filter, setFilter] = useState('all');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [detailPair, setDetailPair] = useState<ComparisonPair | null>(null);

	useEffect(() => {
		if (subs.length < 2) {
			navigate('/similarity', { replace: true });
			return;
		}
		const timer = setTimeout(() => {
			setPairs(generateComparisonPairs(subs));
			setProcessing(false);
			toast({
				title: 'Analysis Complete',
				description: `Generated ${(subs.length * (subs.length - 1)) / 2} comparison pairs.`,
			});
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	const filtered = useMemo(() => {
		let result = pairs;
		if (filter === 'high') result = result.filter((p) => p.similarity >= 50);
		else if (filter === 'medium')
			result = result.filter((p) => p.similarity >= 25 && p.similarity < 50);
		else if (filter === 'low') result = result.filter((p) => p.similarity < 25);
		if (search) {
			const q = search.toLowerCase();
			result = result.filter(
				(p) =>
					p.studentA.toLowerCase().includes(q) ||
					p.studentB.toLowerCase().includes(q) ||
					p.regA.toLowerCase().includes(q) ||
					p.regB.toLowerCase().includes(q),
			);
		}
		return result;
	}, [pairs, filter, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const highCount = pairs.filter((p) => p.similarity >= 50).length;
	const medCount = pairs.filter(
		(p) => p.similarity >= 25 && p.similarity < 50,
	).length;
	const avgScore = pairs.length
		? Math.round(pairs.reduce((s, p) => s + p.similarity, 0) / pairs.length)
		: 0;

	const handleExport = () => {
		toast({
			title: 'Export Started',
			description: 'Downloading comparison results as CSV…',
		});
	};

	if (isLoading)
		return (
			<DashboardLayout>
				<PageLoader />
			</DashboardLayout>
		);

	return (
		<DashboardLayout>
			{/* Header */}
			<div className='mb-6 flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card animate-in fade-in duration-500'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => navigate('/similarity')}
					className='mr-1'>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<FileSearch className='h-6 w-6 text-primary' />
				<div className='flex-1'>
					<h1 className='font-display text-xl font-bold text-foreground'>
						Comparison Matrix
					</h1>
					<p className='text-sm text-muted-foreground'>
						{courseCode} — {assignmentTitle} · {subs.length} students ·{' '}
						{pairs.length} pairs
					</p>
				</div>
				<Button
					variant='outline'
					size='sm'
					onClick={handleExport}>
					<Download className='mr-2 h-4 w-4' /> Export CSV
				</Button>
			</div>

			{processing ? (
				<Card className='shadow-card animate-in fade-in duration-500'>
					<CardContent className='flex flex-col items-center justify-center py-16'>
						<Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
						<p className='font-display text-lg font-semibold text-foreground'>
							Analyzing submissions…
						</p>
						<p className='text-sm text-muted-foreground mt-1'>
							Generating pairwise comparisons
						</p>
					</CardContent>
				</Card>
			) : detailPair ? (
				<DetailView
					pair={detailPair}
					onClose={() => setDetailPair(null)}
					courseName={`${courseCode} — ${courseName}`}
					lecturer={lecturer}
					assignmentTitle={assignmentTitle}
				/>
			) : (
				<>
					{/* Summary */}
					<div className='grid gap-4 md:grid-cols-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
						<Card className='shadow-card'>
							<CardContent className='pt-6 text-center'>
								<p className='text-xs text-muted-foreground uppercase tracking-wide'>
									Total Pairs
								</p>
								<p className='font-display text-4xl font-bold mt-1 text-foreground'>
									{pairs.length}
								</p>
							</CardContent>
						</Card>
						<Card className='shadow-card'>
							<CardContent className='pt-6 text-center'>
								<p className='text-xs text-muted-foreground uppercase tracking-wide'>
									Average Similarity
								</p>
								<p
									className={`font-display text-4xl font-bold mt-1 ${avgScore >= 50 ? 'text-destructive' : avgScore >= 25 ? 'text-amber-600' : 'text-emerald-600'}`}>
									{avgScore}%
								</p>
							</CardContent>
						</Card>
						<Card className='shadow-card'>
							<CardContent className='pt-6 text-center'>
								<p className='text-xs text-muted-foreground uppercase tracking-wide'>
									High Similarity
								</p>
								<p className='font-display text-4xl font-bold mt-1 text-destructive'>
									{highCount}
								</p>
							</CardContent>
						</Card>
						<Card className='shadow-card'>
							<CardContent className='pt-6 text-center'>
								<p className='text-xs text-muted-foreground uppercase tracking-wide'>
									Flagged for Review
								</p>
								<p className='font-display text-4xl font-bold mt-1 text-amber-600'>
									{medCount}
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Search & Filter */}
					<Card
						className='shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500'
						style={{ animationDelay: '80ms' }}>
						<CardHeader className='flex-row items-center justify-between space-y-0 pb-4 gap-3 flex-wrap'>
							<CardTitle className='font-display text-base'>
								Pairwise Results
							</CardTitle>
							<div className='flex items-center gap-3'>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
									<Input
										placeholder='Search students…'
										value={search}
										onChange={(e) => {
											setSearch(e.target.value);
											setPage(1);
										}}
										className='pl-9 w-52'
									/>
								</div>
								<Select
									value={filter}
									onValueChange={(v) => {
										setFilter(v);
										setPage(1);
									}}>
									<SelectTrigger className='w-44'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>All Results</SelectItem>
										<SelectItem value='high'>High (≥ 50%)</SelectItem>
										<SelectItem value='medium'>Medium (25-49%)</SelectItem>
										<SelectItem value='low'>Low (&lt; 25%)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent>
							{filtered.length === 0 ? (
								<p className='py-8 text-center text-sm text-muted-foreground'>
									No results match your filters.
								</p>
							) : (
								<>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Student 1</TableHead>
												<TableHead>Student 2</TableHead>
												<TableHead className='text-center'>
													Similarity
												</TableHead>
												<TableHead>Level</TableHead>
												<TableHead className='text-center'>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{paginated.map((pair, i) => {
												const sev =
													pair.similarity >= 50
														? { label: 'High', variant: 'destructive' as const }
														: pair.similarity >= 25
															? {
																	label: 'Medium',
																	variant: 'secondary' as const,
																}
															: { label: 'Low', variant: 'outline' as const };
												return (
													<TableRow key={i}>
														<TableCell>
															<p className='font-medium text-sm'>
																{pair.studentA}
															</p>
															<p className='text-xs text-muted-foreground'>
																{pair.regA}
															</p>
														</TableCell>
														<TableCell>
															<p className='font-medium text-sm'>
																{pair.studentB}
															</p>
															<p className='text-xs text-muted-foreground'>
																{pair.regB}
															</p>
														</TableCell>
														<TableCell className='text-center'>
															<span
																className={`font-display text-lg font-bold ${pair.similarity >= 50 ? 'text-destructive' : pair.similarity >= 25 ? 'text-amber-600' : 'text-emerald-600'}`}>
																{pair.similarity}%
															</span>
														</TableCell>
														<TableCell>
															<Badge variant={sev.variant}>{sev.label}</Badge>
														</TableCell>
														<TableCell className='text-center'>
															<Button
																variant='ghost'
																size='sm'
																onClick={() => setDetailPair(pair)}>
																<Eye className='mr-1 h-4 w-4' /> View
															</Button>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>

									{/* Pagination */}
									<div className='mt-4 flex items-center justify-between text-sm text-muted-foreground'>
										<span>
											Showing {(page - 1) * PAGE_SIZE + 1}–
											{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
											{filtered.length}
										</span>
										<div className='flex items-center gap-2'>
											<Button
												variant='outline'
												size='sm'
												disabled={page === 1}
												onClick={() => setPage(page - 1)}>
												<ChevronLeft className='h-4 w-4' />
											</Button>
											<span className='font-medium text-foreground'>
												{page} / {totalPages}
											</span>
											<Button
												variant='outline'
												size='sm'
												disabled={page === totalPages}
												onClick={() => setPage(page + 1)}>
												<ChevronRight className='h-4 w-4' />
											</Button>
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</>
			)}
		</DashboardLayout>
	);
};

// ── Detail View ──
function DetailView({
	pair,
	onClose,
	courseName,
	lecturer,
	assignmentTitle,
}: {
	pair: ComparisonPair;
	onClose: () => void;
	courseName: string;
	lecturer: string;
	assignmentTitle: string;
}) {
	const { segmentsA, segmentsB } = findHighlightedSegments(
		pair.textA,
		pair.textB,
	);
	const severityColor =
		pair.similarity >= 50
			? 'text-destructive'
			: pair.similarity >= 25
				? 'text-amber-600'
				: 'text-emerald-600';
	const severityBg =
		pair.similarity >= 50
			? 'bg-destructive/10'
			: pair.similarity >= 25
				? 'bg-amber-600/10'
				: 'bg-emerald-600/10';

	return (
		<div className='space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
			{/* Context */}
			<Card className='shadow-card'>
				<CardContent className='pt-4 pb-4'>
					<div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm'>
						<div>
							<span className='font-medium text-foreground'>Course:</span>{' '}
							{courseName}
						</div>
						<div>
							<span className='font-medium text-foreground'>Lecturer:</span>{' '}
							{lecturer}
						</div>
						<div>
							<span className='font-medium text-foreground'>Assignment:</span>{' '}
							{assignmentTitle}
						</div>
					</div>
				</CardContent>
			</Card>

			<div className='flex items-center justify-between'>
				<Button
					variant='ghost'
					size='sm'
					onClick={onClose}>
					<ArrowLeft className='mr-1 h-4 w-4' /> Back to Matrix
				</Button>
				<Badge
					className={`text-xl font-display font-bold px-4 py-1.5 ${severityBg} ${severityColor} border-0`}>
					{pair.similarity}%
				</Badge>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<Card className='shadow-card'>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium'>
							{pair.studentA}
							<span className='ml-2 text-xs font-normal text-muted-foreground'>
								{pair.regA}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-sm leading-relaxed'>
							{segmentsA.map((seg, i) => (
								<span
									key={i}
									className={
										seg.highlighted
											? 'bg-yellow-200 dark:bg-yellow-800/50 rounded px-0.5'
											: ''
									}>
									{seg.text}{' '}
								</span>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className='shadow-card'>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium'>
							{pair.studentB}
							<span className='ml-2 text-xs font-normal text-muted-foreground'>
								{pair.regB}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-sm leading-relaxed'>
							{segmentsB.map((seg, i) => (
								<span
									key={i}
									className={
										seg.highlighted
											? 'bg-yellow-200 dark:bg-yellow-800/50 rounded px-0.5'
											: ''
									}>
									{seg.text}{' '}
								</span>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<p className='text-xs text-muted-foreground text-center'>
				{pair.similarity >= 50
					? '❌ High similarity — possible plagiarism'
					: pair.similarity >= 25
						? '⚠️ Moderate overlap — review recommended'
						: '✅ Low similarity — likely original work'}
			</p>
		</div>
	);
}

export default AdminComparisonMatrix;

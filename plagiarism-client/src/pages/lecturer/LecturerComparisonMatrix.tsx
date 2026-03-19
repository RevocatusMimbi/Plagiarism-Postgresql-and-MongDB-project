import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { LecturerLayout } from '@/components/layout/LecturerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	ArrowLeft,
	Download,
	Eye,
	FileSearch,
	Loader2,
	ChevronLeft,
	ChevronRight,
	X,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PageLoader } from '@/components/PageLoader';
import { usePageLoading } from '@/hooks/usePageLoading';
import {
	generateComparisonPairs,
	type Submission,
	type ComparisonPair,
} from '@/data/similarityMockData';
import { ComparisonDetail } from '@/components/similarity/ComparisonDetail';

const PAGE_SIZE = 10;

const LecturerComparisonMatrix = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isLoading = usePageLoading();

	const subs: Submission[] = location.state?.submissions || [];
	const assignmentTitle: string =
		location.state?.assignmentTitle || 'Assignment';
	const courseCode: string = location.state?.courseCode || '';

	const [processing, setProcessing] = useState(true);
	const [pairs, setPairs] = useState<ComparisonPair[]>([]);
	const [filter, setFilter] = useState('all');
	const [page, setPage] = useState(1);
	const [detailPair, setDetailPair] = useState<ComparisonPair | null>(null);

	useEffect(() => {
		if (subs.length < 2) {
			navigate('/lecturer/similarity', { replace: true });
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
		if (filter === 'high') return pairs.filter((p) => p.similarity > 70);
		if (filter === 'medium')
			return pairs.filter((p) => p.similarity >= 30 && p.similarity <= 70);
		if (filter === 'low') return pairs.filter((p) => p.similarity < 30);
		return pairs;
	}, [pairs, filter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const highCount = pairs.filter((p) => p.similarity > 70).length;
	const medCount = pairs.filter(
		(p) => p.similarity >= 30 && p.similarity <= 70,
	).length;
	const avgScore = pairs.length
		? Math.round(pairs.reduce((s, p) => s + p.similarity, 0) / pairs.length)
		: 0;

	const exportReport = () => {
		const lines: string[] = [];
		lines.push('Plagiarism Comparison Report');
		lines.push(`Course: ${courseCode}`);
		lines.push(`Assignment: ${assignmentTitle}`);
		lines.push(`Generated: ${new Date().toLocaleString()}`);
		lines.push('');
		lines.push(`Filter: ${filter}`);
		lines.push('');
		lines.push('Matches:');
		filtered.forEach((p, idx) => {
			lines.push(
				`${idx + 1}: ${p.studentA} vs ${p.studentB} — ${p.similarity}% similarity — longest match ${p.gst?.longestMatch ?? 0} chars`,
			);
		});

		const blob = new Blob([lines.join('\n')], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `plagiarism-report-${Date.now()}.pdf`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);

		toast({
			title: 'Report exported',
			description: 'A mock PDF file was downloaded.',
		});
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
				<Button
					variant='ghost'
					size='icon'
					onClick={() => navigate('/lecturer/similarity')}
					className='mr-1'>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<FileSearch className='h-6 w-6 text-primary' />
				<div>
					<h1 className='font-display text-xl font-bold text-foreground'>
						Comparison Matrix
					</h1>
					<p className='text-sm text-muted-foreground'>
						{courseCode} — {assignmentTitle} · {subs.length} students ·{' '}
						{pairs.length} pairs
					</p>
				</div>
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
				/* Detail View */
				<DetailView
					pair={detailPair}
					onClose={() => setDetailPair(null)}
				/>
			) : (
				<>
					{/* Summary */}
					<div className='grid gap-4 md:grid-cols-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
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

					{/* Filter & Table */}
					<Card
						className='shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500'
						style={{ animationDelay: '80ms' }}>
						<CardHeader className='flex-row items-center justify-between space-y-0 pb-4'>
							<CardTitle className='font-display text-base'>
								Pairwise Results
							</CardTitle>
							<div className='flex items-center gap-2'>
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
										<SelectItem value='high'>High (&gt; 70%)</SelectItem>
										<SelectItem value='medium'>Medium (30-70%)</SelectItem>
										<SelectItem value='low'>Low (&lt; 30%)</SelectItem>
									</SelectContent>
								</Select>
								<Button
									variant='outline'
									size='sm'
									onClick={() => exportReport()}>
									<Download className='mr-2 h-4 w-4' /> Export Report
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{filtered.length === 0 ? (
								<p className='py-8 text-center text-sm text-muted-foreground'>
									No results match this filter.
								</p>
							) : (
								<>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Student 1</TableHead>
												<TableHead>Student 2</TableHead>
												<TableHead className='text-right'>
													GST Similarity
												</TableHead>
												<TableHead className='text-right'>
													Longest Match
												</TableHead>
												<TableHead className='text-right'>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{paginated.map((pair, i) => {
												const sev =
													pair.similarity > 70
														? { label: 'High', variant: 'destructive' as const }
														: pair.similarity >= 30
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
														<TableCell className='text-right'>
															<span
																className={`font-display text-lg font-bold ${pair.similarity > 70 ? 'text-destructive' : pair.similarity >= 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
																{pair.similarity}%
															</span>
														</TableCell>
														<TableCell className='text-right'>
															<span className='font-medium text-sm text-muted-foreground'>
																{pair.gst?.longestMatch ?? '—'} chars
															</span>
														</TableCell>
														<TableCell className='text-right'>
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
		</LecturerLayout>
	);
};

// ── Detail View ──
function DetailView({
	pair,
	onClose,
}: {
	pair: ComparisonPair;
	onClose: () => void;
}) {
	return (
		<ComparisonDetail
			leftName={pair.studentA}
			leftMeta={pair.regA}
			rightName={pair.studentB}
			rightMeta={pair.regB}
			gst={pair.gst}
			onBack={onClose}
		/>
	);
}

export default LecturerComparisonMatrix;

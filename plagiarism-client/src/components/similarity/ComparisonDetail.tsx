import { useEffect, useMemo, useRef, useState } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollBar } from '@/components/ui/scroll-area';
import type { GstColor, GstMatch, GstResult } from '@/data/similarityMockData';

const highlightClasses: Record<GstColor, string> = {
	amber: 'bg-amber-200/70 dark:bg-amber-900/40',
	cyan: 'bg-cyan-200/70 dark:bg-cyan-900/40',
	emerald: 'bg-emerald-200/70 dark:bg-emerald-900/40',
	fuchsia: 'bg-fuchsia-200/70 dark:bg-fuchsia-900/40',
	violet: 'bg-violet-200/70 dark:bg-violet-900/40',
};

function SimilarityGauge({ value }: { value: number }) {
	const radius = 56;
	const strokeWidth = 12;
	const normalizedRadius = radius - strokeWidth / 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset = circumference - (value / 100) * circumference;

	return (
		<div className='relative flex items-center justify-center'>
			<svg
				height={radius * 2}
				width={radius * 2}
				className='rotate-[-90deg]'>
				<circle
					stroke='rgba(99, 102, 241, 0.12)'
					fill='transparent'
					strokeWidth={strokeWidth}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				<circle
					stroke='#3f6ad8'
					fill='transparent'
					strokeWidth={strokeWidth}
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap='round'
					r={normalizedRadius}
					cx={radius}
					cy={radius}
					style={{ transition: 'stroke-dashoffset 0.3s ease' }}
				/>
			</svg>
			<div className='absolute text-center'>
				<p className='text-xs font-medium text-muted-foreground'>Similarity</p>
				<p className='text-3xl font-display font-bold text-primary'>{value}%</p>
			</div>
		</div>
	);
}

interface ComparisonDetailProps {
	leftName: string;
	leftMeta?: string;
	rightName: string;
	rightMeta?: string;
	gst: GstResult;
	onBack?: () => void;
}

export function ComparisonDetail({
	leftName,
	leftMeta,
	rightName,
	rightMeta,
	gst,
	onBack,
}: ComparisonDetailProps) {
	const { matches, segmentsA, segmentsB, similarity } = gst;
	const leftViewportRef = useRef<HTMLDivElement | null>(null);
	const rightViewportRef = useRef<HTMLDivElement | null>(null);
	const matchRefsLeft = useRef<Record<string, HTMLDivElement | null>>({});
	const matchRefsRight = useRef<Record<string, HTMLDivElement | null>>({});
	const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

	const matchesById = useMemo(() => {
		const map = new Map<string, GstMatch>();
		matches.forEach((m) => map.set(m.id, m));
		return map;
	}, [matches]);

	const sortedMatches = useMemo(() => {
		return [...matches].sort((a, b) => b.length - a.length);
	}, [matches]);

	const scrollToMatch = (matchId: string) => {
		setActiveMatchId(matchId);
		const leftEl = matchRefsLeft.current[matchId];
		const rightEl = matchRefsRight.current[matchId];
		if (leftEl && leftViewportRef.current) {
			leftViewportRef.current.scrollTo({
				top:
					leftEl.offsetTop -
					leftViewportRef.current.clientHeight / 2 +
					leftEl.clientHeight / 2,
				behavior: 'smooth',
			});
		}
		if (rightEl && rightViewportRef.current) {
			rightViewportRef.current.scrollTo({
				top:
					rightEl.offsetTop -
					rightViewportRef.current.clientHeight / 2 +
					rightEl.clientHeight / 2,
				behavior: 'smooth',
			});
		}
	};

	const syncScroll = () => {
		if (!leftViewportRef.current || !rightViewportRef.current) return;
		const top = leftViewportRef.current.scrollTop;
		let closest: { id: string; dist: number } | null = null;

		Object.entries(matchRefsLeft.current).forEach(([id, el]) => {
			if (!el) return;
			const dist = Math.abs(el.offsetTop - top);
			if (!closest || dist < closest.dist) {
				closest = { id, dist };
			}
		});

		if (closest) {
			setActiveMatchId(closest.id);
			const el = matchRefsRight.current[closest.id];
			if (el) {
				rightViewportRef.current.scrollTo({
					top:
						el.offsetTop -
						rightViewportRef.current.clientHeight / 2 +
						el.clientHeight / 2,
					behavior: 'smooth',
				});
			}
		}
	};

	useEffect(() => {
		const view = leftViewportRef.current;
		if (!view) return;
		view.addEventListener('scroll', syncScroll, { passive: true });
		return () => view.removeEventListener('scroll', syncScroll);
	}, []);

	const severityText =
		similarity >= 70
			? '❌ High similarity — possible plagiarism'
			: similarity >= 30
				? '⚠️ Moderate overlap — review recommended'
				: '✅ Low similarity — likely original work';

	return (
		<div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col items-center gap-4 md:flex-row md:justify-between'>
				{onBack && (
					<Button
						variant='ghost'
						size='sm'
						onClick={onBack}
						className='md:order-1'>
						<ArrowLeft className='mr-2 h-4 w-4' /> Back
					</Button>
				)}

				<Card className='mx-auto w-full max-w-[260px] flex-1 md:mx-0'>
					<CardContent className='flex items-center justify-center p-5'>
						<SimilarityGauge value={similarity} />
					</CardContent>
				</Card>

				<div className='flex flex-col items-center gap-1 text-center md:items-end md:text-right'>
					<p className='text-sm font-medium text-muted-foreground'>
						{leftName} vs {rightName}
					</p>
					<p className='text-xs text-muted-foreground'>{leftMeta}</p>
					<p className='text-xs text-muted-foreground'>{rightMeta}</p>
				</div>
			</div>

			<div className='grid gap-4 lg:grid-cols-[1fr_1fr_280px]'>
				{/* Left text pane */}
				<Card className='shadow-card'>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium'>{leftName}</CardTitle>
					</CardHeader>
					<CardContent className='p-0'>
						<ScrollAreaPrimitive.Root className='relative h-[420px] overflow-hidden rounded-b-lg border border-border'>
							<ScrollAreaPrimitive.Viewport
								ref={leftViewportRef}
								className='h-full w-full p-4 font-mono text-sm leading-relaxed'>
								{segmentsA.map((seg, idx) => {
									const match = seg.matchId
										? matchesById.get(seg.matchId)
										: undefined;
									const active = seg.matchId && seg.matchId === activeMatchId;
									return (
										<p
											key={idx}
											ref={(el) => {
												if (seg.matchId)
													matchRefsLeft.current[seg.matchId] = el;
											}}
											className={cn(
												'whitespace-pre-wrap rounded-md px-2 py-1',
												match ? highlightClasses[match.color] : '',
												active ? 'ring-2 ring-primary' : '',
											)}>
											{seg.text}
										</p>
									);
								})}
							</ScrollAreaPrimitive.Viewport>
							<ScrollBar orientation='vertical' />
						</ScrollAreaPrimitive.Root>
					</CardContent>
				</Card>

				{/* Right text pane */}
				<Card className='shadow-card'>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm font-medium'>{rightName}</CardTitle>
					</CardHeader>
					<CardContent className='p-0'>
						<ScrollAreaPrimitive.Root className='relative h-[420px] overflow-hidden rounded-b-lg border border-border'>
							<ScrollAreaPrimitive.Viewport
								ref={rightViewportRef}
								className='h-full w-full p-4 font-mono text-sm leading-relaxed'>
								{segmentsB.map((seg, idx) => {
									const match = seg.matchId
										? matchesById.get(seg.matchId)
										: undefined;
									const active = seg.matchId && seg.matchId === activeMatchId;
									return (
										<p
											key={idx}
											ref={(el) => {
												if (seg.matchId)
													matchRefsRight.current[seg.matchId] = el;
											}}
											className={cn(
												'whitespace-pre-wrap rounded-md px-2 py-1',
												match ? highlightClasses[match.color] : '',
												active ? 'ring-2 ring-primary' : '',
											)}>
											{seg.text}
										</p>
									);
								})}
							</ScrollAreaPrimitive.Viewport>
							<ScrollBar orientation='vertical' />
						</ScrollAreaPrimitive.Root>
					</CardContent>
				</Card>

				{/* Match list */}
				<Card className='shadow-card'>
					<CardHeader>
						<CardTitle className='text-sm font-medium'>Found Matches</CardTitle>
					</CardHeader>
					<CardContent className='space-y-2'>
						<p className='text-xs text-muted-foreground'>
							Click a match to jump to the corresponding text.
						</p>
						<div className='space-y-2'>
							{sortedMatches.map((match) => (
								<button
									key={match.id}
									type='button'
									onClick={() => scrollToMatch(match.id)}
									className={cn(
										'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition hover:bg-primary/10',
										activeMatchId === match.id
											? 'border-primary bg-primary/10'
											: 'border-border',
									)}>
									<span className='flex items-center gap-2'>
										<span
											className={cn(
												'h-2 w-2 rounded-full',
												highlightClasses[match.color],
											)}
										/>
										Match {match.id.replace('match-', '')}
									</span>
									<Badge variant='secondary'>{match.length} chars</Badge>
								</button>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<p className='text-xs text-muted-foreground text-center'>
				{severityText}
			</p>
		</div>
	);
}

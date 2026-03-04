import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type LucideIcon = React.ComponentType<{
	className?: string;
	size?: number | string;
}>;

type GradientType =
	| 'midnight'
	| 'asteroid'
	| 'royal'
	| 'emerald'
	| 'amber'
	| 'rose';

interface StatCardProps {
	title: string;
	subtitle: string;
	value: number | string;
	icon: LucideIcon;
	gradient?: GradientType;
	link?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

const gradientStyles: Record<GradientType, string> = {
	midnight: 'from-slate-800 via-slate-900 to-slate-950',
	asteroid: 'from-slate-600 via-slate-700 to-slate-800',
	royal: 'from-indigo-500 via-purple-600 to-violet-700',
	emerald: 'from-emerald-500 via-teal-600 to-cyan-700',
	amber: 'from-amber-500 via-orange-600 to-red-700',
	rose: 'from-rose-500 via-pink-600 to-fuchsia-700',
};

const iconGradientStyles: Record<GradientType, string> = {
	midnight: 'from-slate-400 to-slate-600',
	asteroid: 'from-gray-300 to-gray-500',
	royal: 'from-indigo-300 to-purple-400',
	emerald: 'from-emerald-300 to-teal-400',
	amber: 'from-amber-300 to-orange-400',
	rose: 'from-rose-300 to-pink-400',
};

export function StatCard({
	title,
	subtitle,
	value,
	icon: Icon,
	gradient = 'royal',
	link,
	trend,
}: StatCardProps) {
	const cardContent = (
		<div className='group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl'>
			{/* Gradient background */}
			<div
				className={`absolute inset-0 bg-gradient-to-br ${gradientStyles[gradient]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
			/>

			{/* Content */}
			<div className='relative p-6'>
				{/* Header */}
				<div className='mb-4 flex items-start justify-between'>
					<div
						className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradientStyles[gradient]} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
						<Icon className='h-7 w-7 text-white' />
					</div>
					{trend && (
						<div
							className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
								trend.isPositive
									? 'bg-emerald-100 text-emerald-700'
									: 'bg-red-100 text-red-700'
							}`}>
							{trend.isPositive ? (
								<ArrowUpRight className='h-3 w-3' />
							) : (
								<ArrowDownRight className='h-3 w-3' />
							)}
							{Math.abs(trend.value)}%
						</div>
					)}
				</div>

				{/* Stats */}
				<div className='space-y-1'>
					<p className='text-3xl font-bold text-slate-800 transition-colors group-hover:text-white'>
						{value}
					</p>
					<p className='text-sm font-medium text-slate-500 transition-colors group-hover:text-white/80'>
						{title}
					</p>
					<p className='text-xs text-slate-400 transition-colors group-hover:text-white/60'>
						{subtitle}
					</p>
				</div>

				{/* Hover indicator */}
				<div className='absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100'>
					<ArrowUpRight className='h-4 w-4 text-slate-600' />
				</div>
			</div>

			{/* Decorative elements */}
			<div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 transition-transform duration-300 group-hover:scale-150' />
			<div className='absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150' />
		</div>
	);

	if (link) {
		return (
			<Link
				to={link}
				className='block h-full transition-transform duration-300 hover:-translate-y-1'>
				{cardContent}
			</Link>
		);
	}

	return cardContent;
}

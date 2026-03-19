import { Skeleton } from "@/components/ui/skeleton";

export const PageLoader = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* Header skeleton */}
    <div className="flex items-center gap-3 rounded-xl bg-card px-5 py-4 shadow-card">
      <Skeleton className="h-6 w-6 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="rounded-xl bg-card p-6 shadow-card space-y-4">
      <Skeleton className="h-5 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    </div>

    {/* Extra card skeleton */}
    <div className="grid gap-5 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl bg-card p-6 shadow-card space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  </div>
);

export const TableLoader = () => (
  <div className="rounded-xl bg-card p-6 shadow-card space-y-4 animate-in fade-in duration-500">
    <Skeleton className="h-5 w-48" />
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  </div>
);

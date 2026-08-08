import React from 'react';

export function Skeleton({ className = '', variant = 'default' }) {
  if (variant === 'circle') {
    return <div className={`rounded-full skeleton-shimmer ${className}`} />;
  }
  return <div className={`skeleton-shimmer ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-14 rounded-lg" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl mt-4" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800/80 flex items-center space-x-4">
      <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
      <div className="space-y-2 flex-grow">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="h-64 flex items-end justify-between gap-3 pt-6">
        {[40, 65, 30, 85, 55, 75, 90].map((h, idx) => (
          <Skeleton key={idx} className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

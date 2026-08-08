import React from 'react';

export function ProgressBar({ current, total, percentage }) {
  const calculatedPercent = percentage !== undefined 
    ? percentage 
    : Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
        <span>Question {current} of {total}</span>
        <span className="tabular-nums">{calculatedPercent}% Completed</span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full shadow-sm shadow-indigo-500/50 relative overflow-hidden"
          style={{ 
            width: `${calculatedPercent}%`,
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Shine sweep on the progress bar */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}

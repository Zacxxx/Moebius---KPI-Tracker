import React from 'react';

interface ContextWindowIndicatorProps {
    percentage: number;
    onClick: () => void;
}

export const ContextWindowIndicator: React.FC<ContextWindowIndicatorProps> = ({ percentage, onClick }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const color = percentage > 85 ? 'stroke-red-500' : percentage > 60 ? 'stroke-yellow-500' : 'stroke-emerald-500';

    return (
        <button onClick={onClick} className="relative flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors" aria-label="Open context manager">
            <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle
                    className="stroke-zinc-600"
                    cx="18"
                    cy="18"
                    r={radius}
                    strokeWidth="3"
                    fill="transparent"
                />
                <circle
                    className={`transition-all duration-500 ${color}`}
                    cx="18"
                    cy="18"
                    r={radius}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-zinc-300">
                {Math.round(percentage)}%
            </span>
        </button>
    );
};

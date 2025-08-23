
import React from 'react';

interface GaugeProps {
    value: number;
    min?: number;
    max: number;
    label: string;
    units?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ value, min = 0, max, label, units = '' }) => {
    const percentage = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const strokeWidth = 12;

    const circumference = Math.PI * 2 * 80;
    const strokeDashoffset = circumference * (1 - (percentage * 0.75)); // 0.75 for 270 deg arc

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 200 165" className="absolute w-full h-full">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                {/* Background Arc */}
                <path
                    d="M 25 140 A 80 80 0 1 1 175 140"
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Value Arc */}
                <path
                    d="M 25 140 A 80 80 0 1 1 175 140"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <div className="relative text-center -translate-y-2">
                <div className="text-4xl font-bold text-white tracking-tight">{label}</div>
                <div className="text-xs text-zinc-400">of {max.toLocaleString()}{units} target</div>
            </div>
        </div>
    );
};

import React from 'react';

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, width = 100, height = 20, stroke = "#8b5cf6", strokeWidth = 1.5 }) => {
    if (!data || data.length < 2) return null;

    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - minVal) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};

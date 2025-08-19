
import React, { forwardRef } from 'react';
import { Card } from './Card';

interface HeaderPanelProps {
    children: React.ReactNode;
    className?: string;
}

export const HeaderPanel = forwardRef<HTMLDivElement, HeaderPanelProps>(({ children, className = '' }, ref) => (
    <div ref={ref} className={`absolute top-16 z-50 ${className}`}>
        <Card className="overflow-hidden shadow-2xl shadow-black/40">
            {children}
        </Card>
    </div>
));

import React from 'react';
import { Card } from './Card';

interface HeaderPanelProps {
    children: React.ReactNode;
    position?: { top: number; left: number } | null;
}

export const HeaderPanel = React.forwardRef<HTMLDivElement, HeaderPanelProps>(
    ({ children, position }, ref) => {
    if (!position) return null;

    return (
        <div 
            ref={ref}
            className="fixed z-50 animate-fade-in-fast" 
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
            <Card className="overflow-hidden shadow-2xl shadow-black/40">
                {children}
            </Card>
        </div>
    );
});
HeaderPanel.displayName = 'HeaderPanel';

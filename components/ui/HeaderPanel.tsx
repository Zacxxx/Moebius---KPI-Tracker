
import React from 'react';
import { Card } from './Card';

interface HeaderPanelProps {
    children: React.ReactNode;
    className?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const HeaderPanel: React.FC<HeaderPanelProps> = ({ children, className = '', onMouseEnter, onMouseLeave }) => (
    <div className={`absolute top-16 z-50 ${className}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Card className="overflow-hidden shadow-2xl shadow-black/40">
            {children}
        </Card>
    </div>
);

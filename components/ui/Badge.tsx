
import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'violet' | 'blue' | 'emerald' | 'red';
    className?: string;
}

const variants = {
    default: 'bg-zinc-700 text-zinc-300',
    violet: 'bg-violet-500/20 text-violet-300',
    blue: 'bg-blue-500/20 text-blue-300',
    emerald: 'bg-emerald-500/20 text-emerald-300',
    red: 'bg-red-500/20 text-red-300',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

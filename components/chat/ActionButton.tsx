import React from 'react';

export const ActionButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({ label, onClick, children }) => (
    <button
        title={label}
        onClick={onClick}
        className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-700/70 hover:text-zinc-100 transition-colors"
    >
        {children}
    </button>
);
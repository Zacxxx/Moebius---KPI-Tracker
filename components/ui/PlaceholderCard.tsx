import React from 'react';

export const PlaceholderCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-center rounded-3xl border border-dashed border-zinc-700/80 text-zinc-500 h-40 ${className}`}>
    <span className="text-sm font-medium text-center px-4">{children}</span>
  </div>
);
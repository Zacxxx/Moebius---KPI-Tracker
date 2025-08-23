
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '../Icons';
import type { Page } from '../../types';

interface BreadcrumbItem {
    label: string;
    page: Page;
}

interface DashboardBreadcrumbProps {
    title: string;
    items: BreadcrumbItem[];
    activePage: Page;
    onSelect: (page: Page) => void;
}

export const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({ title, items, activePage, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!items || items.length === 0) {
        return <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center gap-2 group"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">{title}</h1>
                <ChevronDownIcon className={`h-6 w-6 text-zinc-400 transition-transform group-hover:text-zinc-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 p-2">
                    {items.map(item => (
                        <button
                            key={item.page}
                            onClick={() => {
                                onSelect(item.page);
                                setIsOpen(false);
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-md text-zinc-200 hover:bg-zinc-700"
                        >
                            <span>{item.label}</span>
                            {activePage === item.page && <CheckIcon className="h-4 w-4 text-violet-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

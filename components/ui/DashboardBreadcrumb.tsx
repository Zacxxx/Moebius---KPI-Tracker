import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon, ChevronRightIcon } from '../Icons';
// FIX: NavItemData should be imported from '../../types' not '../../navigation' as it's defined in types.ts and not exported from navigation.ts
import type { Page, NavItemData } from '../../types';

const FlyoutMenuItem: React.FC<{
  item: NavItemData;
  activePage: Page;
  onSelect: (page: Page) => void;
  closeAllFlyouts: () => void;
}> = ({ item, activePage, onSelect, closeAllFlyouts }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = item.page === activePage || (item.subItems || []).some(sub => sub.page === activePage || (sub.subItems || []).some(s => s.page === activePage));

  const handleClick = () => {
    if (item.page && !item.isMenuOnly) {
      onSelect(item.page);
    }
    closeAllFlyouts();
  };

  if (!item.subItems) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
          activePage === item.page ? 'text-violet-300 bg-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
        }`}
      >
        <span>{item.label}</span>
        {activePage === item.page && <CheckIcon className="h-4 w-4 text-violet-400" />}
      </button>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        className={`flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
          isActive ? 'text-violet-300 bg-zinc-700/80' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
        }`}
      >
        <span>{item.label}</span>
        <ChevronRightIcon className="h-4 w-4 ml-2" />
      </button>
      {isHovered && (
        <div className="absolute left-full -top-1 w-52 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 z-50 animate-fade-in-fast">
          <div className="p-1">
            {item.subItems.map(sub => (
              <FlyoutMenuItem
                key={sub.page}
                item={sub}
                activePage={activePage}
                onSelect={onSelect}
                closeAllFlyouts={closeAllFlyouts}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


interface DashboardBreadcrumbProps {
    path: string[];
    items: NavItemData[];
    activePage: Page;
    onSelect: (page: Page) => void;
}

export const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({ path, items, activePage, onSelect }) => {
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
        return <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">{path.join(' / ')}</h1>;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center gap-2 group"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors whitespace-nowrap">
                    {path.map((part, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="text-zinc-500 font-normal mx-1">/</span>}
                            <span>{part}</span>
                        </React.Fragment>
                    ))}
                </h1>
                <ChevronDownIcon className={`h-5 w-5 text-zinc-400 transition-transform group-hover:text-zinc-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 p-1">
                    {items.map(item => (
                       <FlyoutMenuItem
                          key={item.page}
                          item={item}
                          activePage={activePage}
                          onSelect={onSelect}
                          closeAllFlyouts={() => setIsOpen(false)}
                       />
                    ))}
                </div>
            )}
        </div>
    );
};
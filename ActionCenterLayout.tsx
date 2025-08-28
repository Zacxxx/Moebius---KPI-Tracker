
import React, { useMemo } from 'react';
import type { Page, NavItemData } from './types';
import { DashboardBreadcrumb } from './components/ui/DashboardBreadcrumb';
import { allNavItems, navigationData } from './navigation';
import { findPath } from './utils';


interface ActionCenterLayoutProps {
    page: Page;
    setPage: (page: Page) => void;
    children: React.ReactNode;
    pageDescription: string;
}

export const ActionCenterLayout: React.FC<ActionCenterLayoutProps> = ({ page, setPage, children, pageDescription }) => {
    const pageInfo = useMemo(() => {
        // A helper to recursively find the item in the navigation data
        const findNavItem = (items: NavItemData[], pageToFind: Page): NavItemData | null => {
            for (const item of items) {
                if (item.page === pageToFind) return item;
                if (item.subItems) {
                    const found = findNavItem(item.subItems, pageToFind);
                    if (found) return found;
                }
            }
            return null;
        }
        return findNavItem(allNavItems, page);
    }, [page]);
    
    const pageTitle = pageInfo?.label || "Action Center";

    const breadcrumbItems = useMemo<NavItemData[]>(() => {
        const actionCenterRoot = navigationData.platform[0].items.find(i => i.label === "Action Center");
        if (!actionCenterRoot || !actionCenterRoot.subItems) return [];
        return actionCenterRoot.subItems;
    }, []);

    const breadcrumbPath = useMemo<string[]>(() => {
        const pathItems = findPath(page, allNavItems);
    
        if (!pathItems) return [pageTitle];
    
        const actionCenterIndex = pathItems.findIndex(item => item.label === "Action Center");
        const relevantPath = actionCenterIndex !== -1 ? pathItems.slice(actionCenterIndex + 1) : pathItems;
        
        return relevantPath.map(item => item.label);
    }, [page, pageTitle]);

    return (
        <div className="space-y-6">
            <header>
                 <DashboardBreadcrumb 
                    path={breadcrumbPath}
                    items={breadcrumbItems}
                    activePage={page}
                    onSelect={setPage}
                />
                 <p className="text-zinc-400 mt-1">{pageDescription}</p>
            </header>
            {children}
        </div>
    );
};

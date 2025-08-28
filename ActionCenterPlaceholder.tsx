
import React from 'react';
import type { Page, NavItemData } from './types';
import { ActionCenterLayout } from './ActionCenterLayout';
import { Card, CardContent } from './components/ui/Card';
import { PaletteIcon } from './components/Icons';
import { allNavItems } from './navigation';

interface ActionCenterPlaceholderProps {
    page: Page;
    setPage: (page: Page) => void;
}

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

export const ActionCenterPlaceholder: React.FC<ActionCenterPlaceholderProps> = ({ page, setPage }) => {
    const pageInfo = findNavItem(allNavItems, page) || { label: 'Action Center Page' };
    const pageTitle = pageInfo.label;
    const pageDescription = `This is the page for ${pageTitle}. Functionality is under construction.`;

    return (
        <ActionCenterLayout page={page} setPage={setPage} pageDescription={pageDescription}>
            <Card>
                <CardContent className="p-10 text-center">
                    <PaletteIcon className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                    <h1 className="text-xl font-bold tracking-tight text-white">{pageTitle}</h1>
                    <p className="text-zinc-400 mt-2">This page is under construction.</p>
                </CardContent>
            </Card>
        </ActionCenterLayout>
    );
};

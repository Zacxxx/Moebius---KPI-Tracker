

import React, { useState } from 'react';
import type { PromotionItem, ColumnDef } from './types';
import { DataTable } from './components/DataTable';
import { Button } from './components/ui/Button';
import { PlusCircleIcon } from './components/Icons';
import { initialPromotions } from './data';

export default function Promotions() {
    const [promotions] = useState<PromotionItem[]>(initialPromotions);
    const columns: ColumnDef<PromotionItem>[] = [
        { accessorKey: 'code', header: 'Coupon Code', cellType: 'text' },
        { accessorKey: 'type', header: 'Type', cellType: 'badge', badgeOptions: { 'Percentage': 'blue', 'Fixed Amount': 'violet' } },
        { accessorKey: 'value', header: 'Value', cellType: 'number' },
        { accessorKey: 'usageCount', header: 'Usage Count', cellType: 'number' },
        { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Active': 'emerald', 'Expired': 'default' } },
    ];
    
    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Promotions & Campaigns</h1>
                    <p className="text-zinc-400 mt-1">Create and manage discount codes and special offers.</p>
                </div>
                <Button onClick={() => alert('This would open a modal to create a new promotion.')}>
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Create New Promotion
                </Button>
            </header>
            
            <DataTable columns={columns} data={promotions} setData={() => {}} newRowData={{ code: '', type: 'Percentage', value: 0, usageCount: 0, status: 'Active' }} isReadOnly={true} />
        </div>
    );
}
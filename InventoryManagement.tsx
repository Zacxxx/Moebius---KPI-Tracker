

import React, { useState } from 'react';
import type { ProductItem, ColumnDef } from './types';
import { DataTable } from './components/DataTable';
import { initialProducts } from './data';

export default function InventoryManagement() {
    const [products] = useState<ProductItem[]>(initialProducts);
    const columns: ColumnDef<ProductItem>[] = [
        { accessorKey: 'name', header: 'Product Name', cellType: 'text' },
        { accessorKey: 'sku', header: 'SKU', cellType: 'text' },
        { accessorKey: 'price', header: 'Price (€)', cellType: 'currency' },
        { accessorKey: 'stock', header: 'Stock', cellType: 'number' },
        { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'In Stock': 'emerald', 'Low Stock': 'violet', 'Out of Stock': 'red' } },
    ];
    
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">Inventory Management</h1>
                <p className="text-zinc-400 mt-1">Track stock levels and manage your product catalog.</p>
            </header>
            
            <DataTable columns={columns} data={products} setData={() => {}} newRowData={{ name: '', sku: '', price: 0, stock: 0, status: 'In Stock' }} isReadOnly={true} />
        </div>
    );
}
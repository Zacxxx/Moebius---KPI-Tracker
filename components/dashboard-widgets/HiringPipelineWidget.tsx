import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import type { ColumnDef, GenericWidgetProps } from '../../types';
import { Badge } from '../ui/Badge';
import { EURO } from '../../utils';
import { WidgetHeader } from './ProductStockWidget';

const renderCell = (row: any, column: ColumnDef<any>) => {
    const value = row[column.accessorKey];
    if (column.cellType === 'badge' && column.badgeOptions) {
      const variant = column.badgeOptions[value as string] || 'default';
      return <Badge variant={variant}>{String(value)}</Badge>;
    }
    if (column.cellType === 'currency') {
        return EURO.format(value as number);
    }
    return String(value);
};

export const TableViewWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, data = [] }) => {
    const { title, dataSourceKey } = instance.config;

    // In a real app, columns would be derived from the data source schema
    const columns = (data && data.length > 0) ? Object.keys(data[0]).map(key => ({ accessorKey: key, header: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) })) as ColumnDef<any>[] : [];
    
    if (!dataSourceKey) {
        return (
             <Card className="h-full">
                <CardHeader>
                    <WidgetHeader title={title} onConfigure={onConfigure} />
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48 text-zinc-500">
                    Click the settings icon to configure this widget.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <WidgetHeader title={title} onConfigure={onConfigure} />
            </CardHeader>
            <CardContent className="!p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                            <tr>
                                {columns.map(col => (
                                    <th key={String(col.accessorKey)} scope="col" className="px-6 py-3">{col.header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 5).map((row: any, index: number) => ( // Show top 5 rows for dashboard brevity
                                <tr key={row.id || index} className="border-b border-zinc-800 last:border-b-0">
                                    {columns.map(col => (
                                        <td key={String(col.accessorKey)} className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                                            {renderCell(row, col)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};
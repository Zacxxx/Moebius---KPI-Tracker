import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ChevronDownIcon } from '../Icons';

const FunnelStage: React.FC<{ title: string; value: number; conversion?: number; color: string; isFirst?: boolean; isLast?: boolean; }> = ({ title, value, conversion, color, isFirst = false, isLast = false }) => (
    <div className="relative flex flex-col items-center">
        {!isFirst && <ChevronDownIcon className="h-6 w-6 text-zinc-600 my-1" />}
        <div className={`w-full p-3 rounded-lg text-center border-b-4 ${color}`}>
            <p className="text-sm text-zinc-300">{title}</p>
            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        </div>
        {!isLast && conversion && (
            <div className="mt-2 text-center text-xs text-zinc-400">
                <p>Conversion</p>
                <p className="font-semibold text-zinc-200">{conversion}%</p>
            </div>
        )}
    </div>
);


export const SalesFunnel: React.FC = () => {
    return (
        <Card>
            <CardHeader><CardTitle>Sales Funnel</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <FunnelStage title="Visitors" value={125340} conversion={11.2} color="border-violet-500" isFirst />
                <FunnelStage title="Leads" value={14038} conversion={24.6} color="border-violet-600" />
                <FunnelStage title="Qualified Leads" value={3450} conversion={12.8} color="border-emerald-500" />
                <FunnelStage title="Customers" value={442} color="border-emerald-600" isLast />
            </CardContent>
        </Card>
    );
};

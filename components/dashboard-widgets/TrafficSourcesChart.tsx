import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PALETTE } from '../../constants';
import { GenericWidgetProps } from '../../types';
import { WidgetHeader } from './ProductStockWidget';

const COLORS = [PALETTE.super.base, PALETTE.current.base, PALETTE.super.light, PALETTE.current.light, '#71717a'];

export const PieChartWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, data = [], onCite }) => {
    const { title, dataSourceKey } = instance.config;

    if (!dataSourceKey) {
        return (
             <Card className="h-full">
                <CardHeader>
                    <WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} />
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48 text-zinc-500">
                    Click the settings icon to configure this widget.
                </CardContent>
            </Card>
        )
    }
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} />
            </CardHeader>
            <CardContent className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            return ( <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px"> {`${(percent * 100).toFixed(0)}%`} </text> );
                        }}>
                            {data.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={PALETTE.ink} />)}
                        </Pie>
                        <Tooltip cursor={{ fill: 'rgba(113, 113, 122, 0.1)' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #3f3f46', borderRadius: '12px' }} />
                        <Legend wrapperStyle={{fontSize: '14px'}}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

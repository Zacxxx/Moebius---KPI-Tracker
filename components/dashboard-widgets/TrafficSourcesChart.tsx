import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PALETTE } from '../../constants';

const trafficData = [
    { name: 'Organic Search', value: 4200 },
    { name: 'Social Media', value: 2800 },
    { name: 'Paid Ads', value: 1500 },
    { name: 'Referral', value: 1200 },
    { name: 'Direct', value: 800 },
];
const COLORS = [PALETTE.super.base, PALETTE.current.base, PALETTE.super.light, PALETTE.current.light, '#71717a'];

export const TrafficSourcesChart: React.FC = () => {
    return (
        <Card className="h-full">
            <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={trafficData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            return ( <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px"> {`${(percent * 100).toFixed(0)}%`} </text> );
                        }}>
                            {trafficData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={PALETTE.ink} />)}
                        </Pie>
                        <Tooltip cursor={{ fill: 'rgba(113, 113, 122, 0.1)' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #3f3f46', borderRadius: '12px' }} />
                        <Legend wrapperStyle={{fontSize: '14px'}}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

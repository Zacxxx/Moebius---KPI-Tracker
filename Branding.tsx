
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { initialBrandingMetrics, initialBrandMentionData } from './data';
import type { BrandingMetric, BrandMentionData } from './types';
import { MegaphoneIcon, BarChartIcon, SearchIcon, UsersIcon } from './components/Icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { PALETTE } from './constants';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Social Media Reach': UsersIcon,
    'Social Engagement': BarChartIcon,
    'Branded Search Volume': SearchIcon,
    'Brand Mentions': MegaphoneIcon,
};

export default function Branding() {
    const [brandingMetrics] = useState<BrandingMetric[]>(initialBrandingMetrics);
    const [mentionData] = useState<BrandMentionData[]>(initialBrandMentionData);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">Brand Monitoring</h1>
                <p className="text-zinc-400 mt-1">Track your brand's presence and perception across channels.</p>
            </header>
            
            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {brandingMetrics.map(item => (
                        <KpiWidget 
                          key={item.id} 
                          title={item.metric} 
                          value={item.value} 
                          change={item.change} 
                          icon={iconMap[item.metric] || MegaphoneIcon}
                        />
                    ))}
                </div>
            </section>

            <section>
                 <h2 className="text-xl font-semibold text-zinc-200 mb-4">Brand Mentions Over Time</h2>
                <Card>
                    <CardContent className="h-[400px] pt-6">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mentionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                                <YAxis stroke="#71717a" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(113, 113, 122, 0.1)' }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                />
                                <Legend wrapperStyle={{fontSize: '14px', paddingTop: '20px'}}/>
                                <Bar dataKey="Twitter" stackId="a" fill={PALETTE.super.base} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="LinkedIn" stackId="a" fill={PALETTE.current.base} />
                                <Bar dataKey="News" stackId="a" fill={'#71717a'} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

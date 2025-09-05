


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { initialPartnerMetrics, initialPartnerItems } from './data';
import type { PartnerMetric, PartnerItem } from './types';
import { UsersIcon, TrendingUpIcon, PieChartIcon } from './components/Icons';
import { Badge } from './components/ui/Badge';
import { EURO } from './utils';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Total Active Partners': UsersIcon,
    'Partner-Sourced Leads': UsersIcon,
    'Partner-Driven Revenue': TrendingUpIcon,
    'Avg. Lead Conversion': PieChartIcon,
};

const tierBadgeMap: { [key: string]: 'violet' | 'default' | 'blue' } = {
    'Gold': 'violet',
    'Silver': 'default',
    'Bronze': 'blue'
}


export default function Partners({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
    const [partnerMetrics] = useState<PartnerMetric[]>(initialPartnerMetrics);
    const [partners] = useState<PartnerItem[]>(initialPartnerItems);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">Partner Program</h1>
                <p className="text-zinc-400 mt-1">Manage and analyze the performance of your channel partners.</p>
            </header>
            
            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {partnerMetrics.map(item => (
                        <KpiWidget 
                          key={item.id} 
                          title={item.metric} 
                          value={item.value} 
                          change={item.change} 
                          icon={iconMap[item.metric] || UsersIcon}
                          isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Partner Performance</h2>
                <Card>
                    <CardContent className="!p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Partner Name</th>
                                        <th scope="col" className="px-6 py-3">Tier</th>
                                        <th scope="col" className="px-6 py-3 text-right">Leads</th>
                                        <th scope="col" className="px-6 py-3 text-right">Revenue</th>
                                        <th scope="col" className="px-6 py-3 text-right">Commission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partners.map((item) => (
                                        <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.name}</th>
                                            <td className="px-6 py-4"><Badge variant={tierBadgeMap[item.tier]}>{item.tier}</Badge></td>
                                            <td className="px-6 py-4 text-zinc-300 text-right">{item.leads}</td>
                                            <td className="px-6 py-4 text-zinc-300 text-right">{EURO.format(item.revenue)}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-semibold text-right">{EURO.format(item.commission)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { initialContentMetrics, initialContentItems } from './data';
import type { ContentMetric, ContentItem } from './types';
import { FileTextIcon, BarChartIcon, TrendingUpIcon, ClockIcon } from './components/Icons';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Total Content Pieces': FileTextIcon,
    'Avg. Engagement Rate': BarChartIcon,
    'Content-Sourced Leads': TrendingUpIcon,
    'Avg. Time on Page': ClockIcon,
};

export default function Content({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
    const [contentMetrics] = useState<ContentMetric[]>(initialContentMetrics);
    const [contentItems] = useState<ContentItem[]>(initialContentItems);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">Content Performance</h1>
                <p className="text-zinc-400 mt-1">Analyze the performance of your blog posts, whitepapers, and case studies.</p>
            </header>
            
            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
                <div className="fluid-widget-grid">
                    {contentMetrics.map(item => (
                        <KpiWidget 
                          key={item.id} 
                          title={item.metric} 
                          value={item.value} 
                          change={item.change} 
                          icon={iconMap[item.metric] || FileTextIcon}
                          isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Recent Content</h2>
                <Card>
                    <CardContent className="!p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Title</th>
                                        <th scope="col" className="px-6 py-3">Type</th>
                                        <th scope="col" className="px-6 py-3">Published</th>
                                        <th scope="col" className="px-6 py-3 text-right">Views</th>
                                        <th scope="col" className="px-6 py-3 text-right">Engagement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contentItems.map((item) => (
                                        <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.title}</th>
                                            <td className="px-6 py-4 text-zinc-300">{item.type}</td>
                                            <td className="px-6 py-4 text-zinc-300">{item.date}</td>
                                            <td className="px-6 py-4 text-zinc-300 text-right">{item.views.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-semibold text-right">{item.engagement}</td>
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




import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { initialPrMetrics, initialMediaMentionItems } from './data';
import type { PrMetric, MediaMentionItem } from './types';
import { MegaphoneIcon, BarChartIcon, SmileIcon, TrendingUpIcon } from './components/Icons';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Media Mentions': MegaphoneIcon,
    'Share of Voice': BarChartIcon,
    'Sentiment Score': SmileIcon,
    'Estimated Reach': TrendingUpIcon,
};

export default function PublicRelations({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
    const [prMetrics] = useState<PrMetric[]>(initialPrMetrics);
    const [mentions] = useState<MediaMentionItem[]>(initialMediaMentionItems);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">Public Relations</h1>
                <p className="text-zinc-400 mt-1">Track media mentions and analyze brand sentiment.</p>
            </header>
            
            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {prMetrics.map(item => (
                        <KpiWidget 
                          key={item.id} 
                          title={item.metric} 
                          value={item.value} 
                          change={item.change} 
                          icon={iconMap[item.metric] || MegaphoneIcon}
                          isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Recent Media Mentions</h2>
                <div className="space-y-4">
                    {mentions.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-4">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-zinc-800/30 p-2 -m-2 rounded-lg">
                                    <p className="text-sm font-semibold text-violet-400">{item.publication}</p>
                                    <p className="text-base text-zinc-100 mt-1">{item.title}</p>
                                    <p className="text-xs text-zinc-500 mt-2">{item.date}</p>
                                </a>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
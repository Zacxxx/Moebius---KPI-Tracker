

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { initialSeoMetrics, initialKeywordItems, initialBacklinkItems } from './data';
import type { SeoMetric, KeywordItem, BacklinkItem } from './types';
import { SearchIcon, TrendingUpIcon, DatabaseIcon, ChevronUpIcon, ChevronDownIcon } from './components/Icons';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Organic Traffic': TrendingUpIcon,
    'Avg. Keyword Position': SearchIcon,
    'Referring Domains': DatabaseIcon,
    'Domain Authority': TrendingUpIcon,
};

const PositionChange: React.FC<{ change: number }> = ({ change }) => {
    if (change === 0) return <span className="text-zinc-500">-</span>;
    const isUp = change > 0;
    return (
        <span className={`flex items-center ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            {Math.abs(change)}
        </span>
    );
};

export default function Seo({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
    const [seoMetrics] = useState<SeoMetric[]>(initialSeoMetrics);
    const [keywords] = useState<KeywordItem[]>(initialKeywordItems);
    const [backlinks] = useState<BacklinkItem[]>(initialBacklinkItems);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">SEO & Domain Authority</h1>
                <p className="text-zinc-400 mt-1">Monitor organic traffic, keyword rankings, and backlink profile.</p>
            </header>
            
            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {seoMetrics.map(item => (
                        <KpiWidget 
                          key={item.id} 
                          title={item.metric} 
                          value={item.value} 
                          change={item.change} 
                          icon={iconMap[item.metric] || SearchIcon}
                          isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
                        />
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>Top Keyword Rankings</CardTitle></CardHeader>
                    <CardContent className="!p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Keyword</th>
                                        <th scope="col" className="px-6 py-3 text-center">Position</th>
                                        <th scope="col" className="px-6 py-3 text-center">Change</th>
                                        <th scope="col" className="px-6 py-3 text-right">Volume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keywords.map((item) => (
                                        <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.keyword}</th>
                                            <td className="px-6 py-4 text-zinc-300 text-center">{item.position}</td>
                                            <td className="px-6 py-4 text-zinc-300 flex justify-center"><PositionChange change={item.change} /></td>
                                            <td className="px-6 py-4 text-zinc-300 text-right">{item.volume}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Recent Backlinks</CardTitle></CardHeader>
                    <CardContent className="!p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Referring Domain</th>
                                        <th scope="col" className="px-6 py-3 text-right">Authority</th>
                                        <th scope="col" className="px-6 py-3 text-right">Date Acquired</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {backlinks.map((item) => (
                                        <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.domain}</th>
                                            <td className="px-6 py-4 text-zinc-300 text-right">{item.authority}</td>
                                            <td className="px-6 py-4 text-zinc-300 text-right">{item.date}</td>
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
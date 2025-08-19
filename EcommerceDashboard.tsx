
import React, { useMemo, useState } from 'react';
import type { EcommerceMetric } from './types';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { BarChartIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from './components/Icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PALETTE } from './constants';
import { fmtEuro } from './utils';
import { initialEcommerceMetrics } from './data';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Gross Merchandise Volume': TrendingUpIcon,
    'Average Order Value': WalletIcon,
    'Conversion Rate': BarChartIcon,
    'Cart Abandonment Rate': TrendingDownIcon,
};

const iconColorMap: { [key: string]: string } = {
    'Gross Merchandise Volume': 'text-emerald-400',
    'Average Order Value': 'text-emerald-400',
    'Conversion Rate': 'text-emerald-400',
    'Cart Abandonment Rate': 'text-red-400',
};

// Mock data for the chart
const salesTrendData = [
  { name: 'Jan', Sales: 4000, Orders: 2400 },
  { name: 'Feb', Sales: 3000, Orders: 1398 },
  { name: 'Mar', Sales: 5000, Orders: 9800 },
  { name: 'Apr', Sales: 4780, Orders: 3908 },
  { name: 'May', Sales: 5890, Orders: 4800 },
  { name: 'Jun', Sales: 4390, Orders: 3800 },
  { name: 'Jul', Sales: 5490, Orders: 4300 },
];

export default function EcommerceDashboard() {
    const [ecommerceMetrics] = useState<EcommerceMetric[]>(initialEcommerceMetrics);

    const topProducts = useMemo(() => [
        { id: 1, name: 'Electric Guitar Standard', sales: '€12,499.75' },
        { id: 2, name: 'Keyboard 88-Key', sales: '€9,749.85' },
        { id: 3, name: 'Acoustic Guitar Pro', sales: '€7,499.75' },
        { id: 4, name: 'Drum Kit Beginner', sales: '€6,399.84' },
    ], []);

    const topSources = useMemo(() => [
        { id: 1, source: 'google.com', value: '3,281 visitors' },
        { id: 2, source: 'instagram.com', value: '2,150 visitors' },
        { id: 3, source: 'facebook.com', value: '1,567 visitors' },
        { id: 4, source: 'organic', value: '1,204 visitors' },
    ], []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">Sales Performance Dashboard</h1>
                <p className="text-zinc-400 mt-1">A real-time command center for your online store.</p>
            </header>

            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Sales Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ecommerceMetrics.map(metric => (
                        <KpiWidget
                            key={metric.id}
                            title={metric.metric}
                            value={metric.value}
                            change={metric.change}
                            icon={iconMap[metric.metric] || TrendingUpIcon}
                            iconColor={iconColorMap[metric.metric] || 'text-violet-400'}
                        />
                    ))}
                </div>
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Trend (YTD)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                     <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={PALETTE.super.base} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={PALETTE.super.base} stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                                    <YAxis tickFormatter={fmtEuro} stroke="#71717a" fontSize={12} />
                                    <Tooltip
                                      cursor={{ stroke: PALETTE.grid, strokeOpacity: 0.2 }}
                                      content={({ active, payload, label }) => {
                                          if (active && payload && payload.length) {
                                              return (
                                                  <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-lg p-3 shadow-2xl text-zinc-200">
                                                      <p className="text-xs font-bold mb-1">{label}</p>
                                                      <p className="text-sm font-medium text-white">{`Sales: ${fmtEuro(payload[0].value as number)}`}</p>
                                                  </div>
                                              );
                                          }
                                          return null;
                                      }}
                                    />
                                    <Area type="monotone" dataKey="Sales" stroke={PALETTE.super.stroke} fill="url(#salesGradient)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {topProducts.map(p => (
                                    <li key={p.id} className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300">{p.name}</span>
                                        <span className="font-semibold text-white">{p.sales}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Top Referring Sources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {topSources.map(s => (
                                    <li key={s.id} className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300">{s.source}</span>
                                        <span className="font-semibold text-white">{s.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

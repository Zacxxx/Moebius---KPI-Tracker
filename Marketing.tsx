
import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MegaphoneIcon, TrendingUpIcon, WalletIcon, UsersIcon, BarChartIcon, ChevronDownIcon } from './components/Icons';
import type { MarketingMetric, Campaign } from './types';
import { KpiWidget } from './components/KpiWidget';
import { initialMarketingMetrics, initialCampaigns } from './data';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { PALETTE } from './constants';
import { EURO } from './utils';


const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Leads': MegaphoneIcon,
    'Conversion Rate': TrendingUpIcon,
    'Customer Acquisition Cost (CAC)': WalletIcon,
    'Website Traffic': UsersIcon,
    'Return on Ad Spend (ROAS)': TrendingUpIcon,
    'Click-Through Rate (CTR)': BarChartIcon,
    'Cost Per Click (CPC)': WalletIcon,
};

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

const campaignStatusVariants: { [key: string]: 'emerald' | 'violet' | 'default' } = {
    'Active': 'emerald',
    'Paused': 'violet',
    'Completed': 'default',
};

export default function Marketing() {
  const [marketingMetrics] = useState<MarketingMetric[]>(initialMarketingMetrics);
  const [campaigns] = useState<Campaign[]>(initialCampaigns);
  
  const trafficData = [
    { name: 'Organic Search', value: 4200 },
    { name: 'Social Media', value: 2800 },
    { name: 'Paid Ads', value: 1500 },
    { name: 'Referral', value: 1200 },
    { name: 'Direct', value: 800 },
  ];
  const COLORS = [PALETTE.super.base, PALETTE.current.base, PALETTE.super.light, PALETTE.current.light, '#71717a'];


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Marketing</h1>
        <p className="text-zinc-400 mt-1">Analyze campaign performance, track funnel conversions, and understand your traffic sources.</p>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketingMetrics.map(item => (
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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
                <CardHeader><CardTitle>Sales Funnel</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <FunnelStage title="Visitors" value={125340} conversion={11.2} color="border-violet-500" isFirst />
                    <FunnelStage title="Leads" value={14038} conversion={24.6} color="border-violet-600" />
                    <FunnelStage title="Qualified Leads" value={3450} conversion={12.8} color="border-emerald-500" />
                    <FunnelStage title="Customers" value={442} color="border-emerald-600" isLast />
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
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
          </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Campaign Performance</h2>
        <Card>
            <CardContent className="!p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Campaign Name</th>
                                <th scope="col" className="px-6 py-3">Channel</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Budget</th>
                                <th scope="col" className="px-6 py-3 text-right">CPA</th>
                                <th scope="col" className="px-6 py-3 text-right">ROAS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{campaign.name}</th>
                                    <td className="px-6 py-4 text-zinc-300">{campaign.channel}</td>
                                    <td className="px-6 py-4"><Badge variant={campaignStatusVariants[campaign.status]}>{campaign.status}</Badge></td>
                                    <td className="px-6 py-4 text-zinc-300 text-right">{EURO.format(campaign.budget)}</td>
                                    <td className="px-6 py-4 text-zinc-300 text-right">{EURO.format(campaign.cpa)}</td>
                                    <td className="px-6 py-4 text-emerald-400 font-semibold text-right">{campaign.roas}</td>
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

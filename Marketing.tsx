
import React, { useState } from 'react';
import { MegaphoneIcon, TrendingUpIcon, WalletIcon } from './components/Icons';
import type { MarketingMetric } from './types';
import { KpiWidget } from './components/KpiWidget';
import { initialMarketingMetrics } from './data';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Leads': MegaphoneIcon,
    'Conversion Rate': TrendingUpIcon,
    'Customer Acquisition Cost (CAC)': WalletIcon,
};

export default function Marketing() {
  const [marketingMetrics] = useState<MarketingMetric[]>(initialMarketingMetrics);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Marketing & Sales Funnel</h1>
        <p className="text-zinc-400 mt-1">Track campaign performance and customer acquisition.</p>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}
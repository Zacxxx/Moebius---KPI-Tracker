
import React, { useState } from 'react';
import { TrendingUpIcon, ClockIcon, TrendingDownIcon } from './components/Icons';
import type { OperationalMetric } from './types';
import { KpiWidget } from './components/KpiWidget';
import { initialOperationalMetrics } from './data';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'System Uptime': TrendingUpIcon,
    'Avg. Ticket Resolution Time': ClockIcon,
    'Burn Rate': TrendingDownIcon,
};

const iconColorMap: { [key: string]: string } = {
    'System Uptime': 'text-emerald-400',
    'Avg. Ticket Resolution Time': 'text-emerald-400',
    'Burn Rate': 'text-red-400',
};

export default function Operational({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
  const [operationalMetrics] = useState<OperationalMetric[]>(initialOperationalMetrics);
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Operational Efficiency</h1>
        <p className="text-zinc-400 mt-1">Track costs, uptime, and system performance.</p>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="fluid-widget-grid">
            {operationalMetrics.map(item => (
                <KpiWidget 
                    key={item.id} 
                    title={item.metric} 
                    value={item.value} 
                    change={item.change}
                    icon={iconMap[item.metric] || TrendingUpIcon}
                    iconColor={iconColorMap[item.metric] || 'text-violet-400'}
                    inverse={item.inverse}
                    isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
                />
            ))}
        </div>
      </section>
    </div>
  );
}

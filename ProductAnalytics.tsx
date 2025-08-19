
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { GaugeIcon, TrendingUpIcon, SmileIcon, ClockIcon } from './components/Icons';
import type { ProductMetric } from './types';
import { KpiWidget } from './components/KpiWidget';
import { initialProductMetrics } from './data';


const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'DAU / MAU Ratio': GaugeIcon,
    'Key Feature Adoption Rate': TrendingUpIcon,
    'Net Promoter Score (NPS)': SmileIcon,
    'Avg. Session Duration': ClockIcon,
};

export default function ProductAnalytics() {
  const [productMetrics] = useState<ProductMetric[]>(initialProductMetrics);
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Product Analytics</h1>
        <p className="text-zinc-400 mt-1">Analyze user engagement and feature adoption.</p>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productMetrics.map(item => (
                <KpiWidget 
                  key={item.id} 
                  title={item.metric} 
                  value={item.value} 
                  change={item.change || ''}
                  icon={iconMap[item.metric] || GaugeIcon}
                />
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">User Journey Funnel</h2>
        <Card>
            <CardHeader><CardTitle>Onboarding Funnel Conversion</CardTitle></CardHeader>
            <CardContent>
                <div className="text-center py-12 text-zinc-500">
                    <p>User funnel visualization will be displayed here.</p>
                    <p className="text-xs mt-1">This chart shows drop-off points in key user flows.</p>
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
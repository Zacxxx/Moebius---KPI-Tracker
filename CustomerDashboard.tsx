
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { TrendingUpIcon, TrendingDownIcon, ScaleIcon, UsersIcon } from './components/Icons';
import type { CustomerMetric } from './types';
import { KpiWidget } from './components/KpiWidget';
import { initialCustomerMetrics } from './data';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Customer Lifetime Value (LTV)': TrendingUpIcon,
    'Customer Churn Rate': TrendingDownIcon,
    'LTV to CAC Ratio': ScaleIcon,
    'Active Subscribers': UsersIcon,
};

const iconColorMap: { [key: string]: string } = {
    'Customer Lifetime Value (LTV)': 'text-emerald-400',
    'Customer Churn Rate': 'text-emerald-400',
    'LTV to CAC Ratio': 'text-emerald-400',
    'Active Subscribers': 'text-violet-400',
};

export default function CustomerDashboard({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
  const [customerMetrics] = useState<CustomerMetric[]>(initialCustomerMetrics);
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Customer Dashboard</h1>
        <p className="text-zinc-400 mt-1">Understand customer behavior, retention, and value.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="fluid-widget-grid">
            {customerMetrics.map(metric => (
                <KpiWidget
                    key={metric.id}
                    title={metric.metric}
                    value={metric.value}
                    change={metric.change}
                    icon={iconMap[metric.metric] || UsersIcon}
                    iconColor={iconColorMap[metric.metric] || 'text-violet-400'}
                    inverse={metric.inverse}
                    isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
                />
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Cohort Retention Analysis</h2>
        <Card>
            <CardHeader><CardTitle>Monthly Retention by Signup Cohort</CardTitle></CardHeader>
            <CardContent>
                <div className="text-center py-12 text-zinc-500">
                    <p>Cohort retention heatmap will be displayed here.</p>
                    <p className="text-xs mt-1">This chart shows the percentage of users who remain active over time.</p>
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}

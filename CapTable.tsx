

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { PieChartIcon, UsersIcon } from './components/Icons';
import type { CapTableMetric } from './types';
import { KpiWidget } from './components/KpiWidget';
import { initialCapTableMetrics } from './data';

export default function CapTable({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
  const [capTableMetrics] = useState<CapTableMetric[]>(initialCapTableMetrics);
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Cap Table & Ownership</h1>
        <p className="text-zinc-400 mt-1">Visualize and manage your company's ownership structure.</p>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Ownership Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {capTableMetrics.map(item => (
                <KpiWidget 
                  key={item.id} 
                  title={item.metric} 
                  value={item.value} 
                  icon={item.metric.includes('Ownership') ? UsersIcon : PieChartIcon}
                  isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
                />
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Capitalization Table</h2>
        <Card>
            <CardHeader><CardTitle>Ownership Breakdown</CardTitle></CardHeader>
            <CardContent>
                <div className="text-center py-12 text-zinc-500">
                    <PieChartIcon className="mx-auto h-12 w-12 text-zinc-600" />
                    <p className="mt-4">Ownership pie chart and detailed cap table will be displayed here.</p>
                    <p className="text-xs mt-1">This table shows the equity stake of all shareholders.</p>
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
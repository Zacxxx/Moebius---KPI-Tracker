import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { DataSourceCard } from './components/DataSourceCard';
import { PlaceholderCard } from './components/ui/PlaceholderCard';

export default function CustomerInsights() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Customer Insights</h1>
        <p className="text-zinc-400 mt-1">Understand customer behavior, retention, and value.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <PlaceholderCard>Customer Lifetime Value (LTV)</PlaceholderCard>
          <PlaceholderCard>Customer Churn Rate</PlaceholderCard>
          <PlaceholderCard>LTV to CAC Ratio</PlaceholderCard>
          <PlaceholderCard>Active Subscribers</PlaceholderCard>
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

      <section>
        <DataSourceCard title="Manage Customer Data Sources" />
      </section>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { TrendingUpIcon } from './components/Icons';
import { fmtEuro, EURO } from './utils';
import type { RevenueStream } from './types';
import { initialRevenueStreams } from './data';

export default function Revenue() {
  const [revenueStreams] = useState<RevenueStream[]>(initialRevenueStreams);
  const totalRevenue = useMemo(() => revenueStreams.reduce((sum, item) => sum + (item.mrr || 0), 0), [revenueStreams]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Revenue Streams</h1>
        <p className="text-zinc-400 mt-1">Manage and track all sources of monthly recurring income.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
            <Card>
                 <CardHeader>
                    <CardTitle>Income Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Revenue Stream</th>
                                    <th scope="col" className="px-6 py-3 text-right">Monthly Revenue (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueStreams.map((item) => (
                                    <tr key={item.id} className="border-b border-zinc-800">
                                        <td className="px-6 py-4 text-zinc-200">{item.stream}</td>
                                        <td className="px-6 py-4 text-zinc-300 text-right">{EURO.format(item.mrr)}</td>
                                    </tr>
                                ))}
                            </tbody>
                             <tfoot className="text-zinc-200 font-semibold">
                                <tr>
                                    <td className="px-6 py-4 text-right">Total Monthly Revenue</td>
                                    <td className="px-6 py-4 text-right text-lg">{EURO.format(totalRevenue)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </main>
        <aside className="lg:col-span-1">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total MRR</CardTitle>
                    <TrendingUpIcon className="h-5 w-5 text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-white">{fmtEuro(totalRevenue)}</div>
                    <p className="text-xs text-zinc-500 mt-1">Calculated from Data Sources</p>
                </CardContent>
            </Card>
        </aside>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { EURO } from './utils';
import type { CrmDataItem } from './types';
import { initialCrmData } from './data';

const statusVariants: { [key: string]: 'violet' | 'blue' | 'emerald' | 'red' | 'default' } = {
    'Proposal': 'violet',
    'Negotiation': 'blue',
    'Contacted': 'default',
    'Lead': 'default',
    'Closed - Won': 'emerald',
    'Closed - Lost': 'red',
};

export default function CustomerCRM() {
  const [crmData] = useState<CrmDataItem[]>(initialCrmData);
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Customer Relationship Management</h1>
            <p className="text-zinc-400 mt-1">Track and manage your sales pipeline. Data can be edited in the Data Sources page.</p>
        </div>
      </header>

      <Card>
        <CardContent className="!p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Contact Name</th>
                            <th scope="col" className="px-6 py-3">Company</th>
                            <th scope="col" className="px-6 py-3">Deal Value</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crmData.map((deal) => (
                            <tr key={deal.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{deal.name}</th>
                                <td className="px-6 py-4 text-zinc-300">{deal.company}</td>
                                <td className="px-6 py-4 text-zinc-300">{EURO.format(deal.value)}</td>
                                <td className="px-6 py-4"><Badge variant={statusVariants[deal.status] || 'default'}>{deal.status}</Badge></td>
                                <td className="px-6 py-4 text-zinc-400 hover:text-violet-400"><a href={`mailto:${deal.contact}`}>{deal.contact}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
    </div>
  );
}
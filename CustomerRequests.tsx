
import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import type { RequestDataItem } from './types';
import { initialRequestData } from './data';

const statusVariants: { [key: string]: 'violet' | 'blue' | 'emerald' | 'default' } = {
    'Shipped': 'emerald',
    'In Progress': 'blue',
    'Planned': 'violet',
    'Under Review': 'default',
};

export default function CustomerRequests() {
  const [requestData] = useState<RequestDataItem[]>(initialRequestData);
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Feature Requests</h1>
            <p className="text-zinc-400 mt-1">Track and prioritize customer feature requests. Data can be edited in the Data Sources page.</p>
        </div>
      </header>

      <Card>
        <CardContent className="!p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Feature Request</th>
                            <th scope="col" className="px-6 py-3">Requested By</th>
                            <th scope="col" className="px-6 py-3 text-center">Votes</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestData.map((req) => (
                            <tr key={req.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{req.title}</th>
                                <td className="px-6 py-4 text-zinc-300">{req.user}</td>
                                <td className="px-6 py-4 text-zinc-300 font-semibold text-center">{req.votes}</td>
                                <td className="px-6 py-4"><Badge variant={statusVariants[req.status] || 'default'}>{req.status}</Badge></td>
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
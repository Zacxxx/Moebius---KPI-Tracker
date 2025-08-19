import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { Campaign } from '../../types';
import { initialCampaigns } from '../../data';
import { Badge } from '../ui/Badge';
import { EURO } from '../../utils';

const campaignStatusVariants: { [key: string]: 'emerald' | 'violet' | 'default' } = {
    'Active': 'emerald',
    'Paused': 'violet',
    'Completed': 'default',
};

export const CampaignPerformanceWidget: React.FC = () => {
    const [campaigns] = useState<Campaign[]>(initialCampaigns);
    return (
         <Card>
            <CardHeader><CardTitle>Campaign Performance</CardTitle></CardHeader>
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
    )
}

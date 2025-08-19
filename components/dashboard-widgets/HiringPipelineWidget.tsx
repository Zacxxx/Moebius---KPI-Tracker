import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { HiringPipelineItem } from '../../types';
import { initialHiringPipeline } from '../../data';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusClasses: { [key: string]: string } = {
        'Interviewing': 'bg-violet-500/20 text-violet-300',
        'Sourcing': 'bg-blue-500/20 text-blue-300',
        'Offer Extended': 'bg-emerald-500/20 text-emerald-300',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-zinc-700 text-zinc-300'}`}>
            {status}
        </span>
    );
};

export const HiringPipelineWidget: React.FC = () => {
    const [hiringPipeline] = useState<HiringPipelineItem[]>(initialHiringPipeline);

    return (
         <Card>
            <CardHeader><CardTitle>Hiring Pipeline</CardTitle></CardHeader>
            <CardContent className="!p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Department</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Candidates</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hiringPipeline.map((job) => (
                                <tr key={job.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{job.role}</th>
                                    <td className="px-6 py-4 text-zinc-300">{job.department}</td>
                                    <td className="px-6 py-4"><StatusBadge status={job.status} /></td>
                                    <td className="px-6 py-4 text-zinc-300 text-right">{job.candidates}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

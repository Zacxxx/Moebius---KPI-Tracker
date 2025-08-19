
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { UsersIcon, ClockIcon, TrendingDownIcon, SmileIcon } from './components/Icons';
import type { HiringPipelineItem } from './types';
import { KpiWidget } from './components/KpiWidget';
import { initialHiringPipeline } from './data';

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


export default function Internal() {
  const [hiringPipeline] = useState<HiringPipelineItem[]>(initialHiringPipeline);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">People</h1>
        <p className="text-zinc-400 mt-1">Monitor team growth, hiring, and key HR metrics.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiWidget title="Headcount" value="42" change="+2 this month" icon={UsersIcon} iconColor="text-violet-400" />
          <KpiWidget title="Avg. Time to Hire" value="38 days" change="-5 days vs last quarter" icon={ClockIcon} iconColor="text-emerald-400" />
          <KpiWidget title="Quarterly Turnover" value="3.1%" change="+0.5% vs last quarter" icon={TrendingDownIcon} iconColor="text-red-400" />
          <KpiWidget title="eNPS" value="75" change="Last surveyed in Q2" icon={SmileIcon} iconColor="text-emerald-400" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Hiring Pipeline</h2>
        <Card>
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
      </section>
    </div>
  );
}
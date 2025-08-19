
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { initialCompetitors, initialFeatureComparison } from './data';
import type { Competitor, FeatureComparison } from './types';
import { CheckIcon, XIcon } from './components/Icons';

const FeatureCheck: React.FC<{ supported: boolean }> = ({ supported }) => {
    return supported ? <CheckIcon className="h-5 w-5 text-emerald-400 mx-auto" /> : <XIcon className="h-5 w-5 text-red-500 mx-auto" />;
};

export default function Competition() {
    const [competitors] = useState<Competitor[]>(initialCompetitors);
    const [features] = useState<FeatureComparison[]>(initialFeatureComparison);

    const competitorNames = ['Moebius', ...competitors.map(c => c.name)];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">Competitive Landscape</h1>
                <p className="text-zinc-400 mt-1">Analyze key competitors and compare feature offerings.</p>
            </header>
            
            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Competitors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitors.map(item => (
                        <Card key={item.id}>
                            <CardContent className="p-6 text-center">
                                <img src={item.logoUrl} alt={`${item.name} logo`} className="h-12 w-12 mx-auto mb-4 rounded-full"/>
                                <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                                <div className="mt-4 grid grid-cols-3 divide-x divide-zinc-700/50">
                                    <div className="px-2"><p className="text-xs text-zinc-400">Funding</p><p className="font-semibold text-zinc-200">{item.funding}</p></div>
                                    <div className="px-2"><p className="text-xs text-zinc-400">Employees</p><p className="font-semibold text-zinc-200">{item.employees}</p></div>
                                    <div className="px-2"><p className="text-xs text-zinc-400">Founded</p><p className="font-semibold text-zinc-200">{item.founded}</p></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Feature Comparison</h2>
                <Card>
                    <CardContent className="!p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Feature</th>
                                        {competitorNames.map(name => (
                                            <th key={name} scope="col" className="px-6 py-3 text-center">{name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((item, index) => (
                                        <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.feature}</th>
                                            {competitorNames.map(name => (
                                                <td key={name} className="px-6 py-4 text-center">
                                                    <FeatureCheck supported={!!item[name]} />
                                                </td>
                                            ))}
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

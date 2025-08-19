
import React from 'react';
import { Modal } from './ui/Modal';
import { CheckIcon, PlusCircleIcon } from './Icons';
import type { SelectableKpi, ShowcaseKpi } from '../types';

interface AddKpiModalProps {
    isOpen: boolean;
    onClose: () => void;
    allKpis: SelectableKpi[];
    showcaseKpis: ShowcaseKpi[];
    onAddKpi: (kpi: ShowcaseKpi) => void;
}

export default function AddKpiModal({ isOpen, onClose, allKpis, showcaseKpis, onAddKpi }: AddKpiModalProps) {
    const groupedKpis = React.useMemo(() => {
        return allKpis.reduce<Record<string, SelectableKpi[]>>((acc, kpi) => {
            (acc[kpi.source] = acc[kpi.source] || []).push(kpi);
            return acc;
        }, {});
    }, [allKpis]);

    const showcaseKpiMetrics = React.useMemo(() => new Set(showcaseKpis.map(k => k.metric)), [showcaseKpis]);

    if (!isOpen) return null;

    return (
        <Modal title="Add KPI to Dashboard" onClose={onClose}>
            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6">
                {Object.entries(groupedKpis).map(([source, kpis]) => (
                    <section key={source}>
                        <h3 className="text-base font-semibold text-zinc-200 mb-3">{source}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {kpis.map(kpi => {
                                const isAdded = showcaseKpiMetrics.has(kpi.metric);
                                return (
                                    <button
                                        key={`${source}-${kpi.metric}`}
                                        onClick={() => onAddKpi(kpi)}
                                        disabled={isAdded}
                                        className={`p-3 rounded-xl border text-left transition-colors w-full h-full flex items-center justify-between
                                            ${isAdded 
                                                ? 'bg-zinc-800/50 border-zinc-700 cursor-not-allowed' 
                                                : 'bg-zinc-900/40 border-zinc-700/50 hover:border-violet-500 hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        <div>
                                            <p className={`font-medium text-sm ${isAdded ? 'text-zinc-500' : 'text-zinc-100'}`}>{kpi.metric}</p>
                                            <p className={`text-xs ${isAdded ? 'text-zinc-600' : 'text-zinc-400'}`}>Value: {kpi.value}</p>
                                        </div>
                                        {isAdded ? (
                                            <CheckIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                            <PlusCircleIcon className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </Modal>
    );
}
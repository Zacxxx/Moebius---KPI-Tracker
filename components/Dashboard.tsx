import React, { useState, useMemo } from 'react';
import { PlusCircleIcon, TrendingUpIcon, UsersIcon, TrendingDownIcon, SmileIcon, EditIcon } from './Icons';
import type { ShowcaseKpi, SelectableKpi, Widget, WidgetType } from '../types';
import { KpiWidget } from './KpiWidget';
import AddKpiModal from './AddKpiModal';
import { Button } from './ui/Button';
import { WidgetSelectionPanel } from './WidgetSelectionPanel';
import { ALL_WIDGETS } from '../data-widgets';

// This is a generic icon map. Specific dashboards can provide their own.
const defaultIconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Annual Recurring Revenue': TrendingUpIcon,
    'Customer Lifetime Value (LTV)': TrendingUpIcon,
    'Burn Rate': TrendingDownIcon,
    'Net Promoter Score (NPS)': SmileIcon,
    'Active Users': UsersIcon,
    'Leads': UsersIcon,
    'Conversion Rate': TrendingUpIcon,
    'Customer Acquisition Cost (CAC)': TrendingDownIcon,
    'System Uptime': TrendingUpIcon,
    'Avg. Ticket Resolution Time': TrendingUpIcon,
    'Customer Churn Rate': TrendingDownIcon,
    'LTV to CAC Ratio': TrendingUpIcon,
    'Active Subscribers': UsersIcon,
    'DAU / MAU Ratio': TrendingUpIcon,
    'Key Feature Adoption Rate': TrendingUpIcon,
    'Avg. Session Duration': TrendingUpIcon,
    'Total Shares Outstanding': TrendingUpIcon,
    'Founder Ownership %': UsersIcon,
    'Investor Ownership %': UsersIcon,
    'ESOP Pool %': UsersIcon,
};

interface DashboardProps {
    title: string;
    description: string;
    initialShowcaseKpis: ShowcaseKpi[];
    allKpisForModal: SelectableKpi[];
    iconMap?: { [key: string]: React.FC<{ className?: string }> };
    iconColorMap?: { [key: string]: string };
    availableWidgets: Widget[];
    visibleWidgetIds: WidgetType[];
    setVisibleWidgetIds: (ids: WidgetType[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    title,
    description,
    initialShowcaseKpis,
    allKpisForModal,
    iconMap = defaultIconMap,
    iconColorMap = {},
    availableWidgets,
    visibleWidgetIds,
    setVisibleWidgetIds,
}) => {
    const [isAddKpiModalOpen, setIsAddKpiModalOpen] = useState(false);
    const [showcaseKpis, setShowcaseKpis] = useState<ShowcaseKpi[]>(initialShowcaseKpis);
    const [isEditing, setIsEditing] = useState(false);

    const handleAddKpi = (kpi: ShowcaseKpi) => {
        if (!showcaseKpis.some(existingKpi => existingKpi.metric === kpi.metric)) {
            setShowcaseKpis(prev => [...prev, kpi]);
        }
        setIsAddKpiModalOpen(false);
    };
    
    const visibleWidgets = useMemo(() => {
        return availableWidgets.filter(widget => visibleWidgetIds.includes(widget.id));
    }, [availableWidgets, visibleWidgetIds]);

    return (
        <>
            <div className="space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                        <p className="text-zinc-400 mt-1">{description}</p>
                    </div>
                    <Button variant="secondary" onClick={() => setIsEditing(true)}>
                        <EditIcon className="h-4 w-4 mr-2" />
                        Edit Dashboard
                    </Button>
                </header>
                
                <section>
                    <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Performance Indicators</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {showcaseKpis.map(metric => (
                            <KpiWidget 
                                key={`${metric.id}-${metric.metric}`}
                                title={metric.metric} 
                                value={metric.value} 
                                change={'change' in metric ? metric.change : undefined}
                                icon={iconMap[metric.metric] || TrendingUpIcon} 
                                iconColor={iconColorMap[metric.metric]} 
                            />
                        ))}
                        
                        <button onClick={() => setIsAddKpiModalOpen(true)} className="flex items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:bg-zinc-800/50 hover:border-zinc-600 transition-colors duration-200" aria-label="Add new widget">
                            <div className="text-center">
                                <PlusCircleIcon className="mx-auto h-10 w-10" />
                                <p className="mt-2 text-base font-semibold">Add KPI Widget</p>
                            </div>
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {visibleWidgets.map(widget => {
                        const WidgetComponent = widget.component;
                        const gridSpan = `lg:col-span-${widget.gridWidth || 1}`;
                        return (
                            <div key={widget.id} className={gridSpan}>
                                <WidgetComponent {...widget.defaultProps} />
                            </div>
                        )
                    })}
                </section>
            </div>

            {isAddKpiModalOpen && (
                <AddKpiModal
                    isOpen={isAddKpiModalOpen}
                    onClose={() => setIsAddKpiModalOpen(false)}
                    allKpis={allKpisForModal}
                    showcaseKpis={showcaseKpis}
                    onAddKpi={handleAddKpi}
                />
            )}

            <WidgetSelectionPanel
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                availableWidgets={availableWidgets}
                visibleWidgetIds={visibleWidgetIds}
                setVisibleWidgetIds={setVisibleWidgetIds}
            />
        </>
    );
};

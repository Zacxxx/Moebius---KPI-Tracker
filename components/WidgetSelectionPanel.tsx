import React, { useState, useMemo } from 'react';
import type { WidgetInstance, PremadeWidgetInfo, GenericWidget, DashboardSection, SelectableKpi } from '../types';
import { Card, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, PlusCircleIcon, SettingsIcon, Trash2Icon, ChevronUpIcon, ChevronDownIcon } from './Icons';
import { Checkbox } from './ui/Checkbox';
import { PREMADE_WIDGETS, GENERIC_WIDGETS } from '../data-widgets';
import { Label } from './ui/Label';
import { Input } from './ui/Input';


interface WidgetSelectionPanelProps {
    isOpen: boolean;
    onClose: () => void;
    widgets: WidgetInstance[];
    setWidgets: React.Dispatch<React.SetStateAction<WidgetInstance[]>>;
    sections: DashboardSection[];
    setSections: React.Dispatch<React.SetStateAction<DashboardSection[]>>;
    onConfigureWidget: (widget: WidgetInstance) => void;
    allKpis: SelectableKpi[];
}

export const WidgetSelectionPanel: React.FC<WidgetSelectionPanelProps> = ({ isOpen, onClose, widgets, setWidgets, sections, setSections, onConfigureWidget, allKpis }) => {
    const [activeTab, setActiveTab] = useState<'current' | 'kpis' | 'premade' | 'custom'>('current');

    const handlePremadeToggle = (premade: PremadeWidgetInfo) => {
        const isVisible = widgets.some(w => w.id === premade.id);
        const lastSectionId = sections.length > 0 ? sections[sections.length - 1].id : 'main';
        if (isVisible) {
            setWidgets(prev => prev.filter(w => w.id !== premade.id));
        } else {
            const newWidget: WidgetInstance = {
                id: premade.id,
                ...premade.instance,
                sectionId: lastSectionId,
            };
            setWidgets(prev => [...prev, newWidget]);
        }
    };
    
    const handleCustomAdd = (generic: GenericWidget) => {
        const lastSectionId = sections.length > 0 ? sections[sections.length - 1].id : 'main';
        const newWidget: WidgetInstance = {
            id: `${generic.type}-${Date.now()}`,
            widgetType: generic.type,
            sectionId: lastSectionId,
            config: {
                ...generic.defaultConfig,
                title: generic.defaultConfig.title || `New ${generic.name}`
            }
        };
        setWidgets(prev => [...prev, newWidget]);
    };

    const handleKpiToggle = (kpi: SelectableKpi) => {
        const kpiWidgetId = `kpi-${kpi.source.replace(/\s+/g, '-')}-${kpi.id}`;
        const isVisible = widgets.some(w => w.id === kpiWidgetId);

        if (isVisible) {
            setWidgets(prev => prev.filter(w => w.id !== kpiWidgetId));
        } else {
            const kpiSection = sections.find(s => s.id === 'kpis' || s.title.toLowerCase().includes('key performance')) || sections[0];
            const sectionId = kpiSection ? kpiSection.id : (sections[0]?.id || 'main');

            const newWidget: WidgetInstance = {
                id: kpiWidgetId,
                widgetType: 'KPI_VIEW',
                sectionId: sectionId,
                config: {
                    title: kpi.metric,
                    selectedKpiId: kpi.id,
                    selectedKpiSource: kpi.source,
                    gridWidth: 1,
                }
            };
            setWidgets(prev => [...prev, newWidget]);
        }
    };
    
    const groupedKpis = useMemo(() => {
        return allKpis.reduce<Record<string, SelectableKpi[]>>((acc, kpi) => {
            (acc[kpi.source] = acc[kpi.source] || []).push(kpi);
            return acc;
        }, {});
    }, [allKpis]);

    const handleMoveWidget = (widgetId: string, direction: 'up' | 'down') => {
        const newWidgets = [...widgets];
        const currentIndex = newWidgets.findIndex(w => w.id === widgetId);
        if (currentIndex === -1) return;

        const currentWidget = newWidgets[currentIndex];
        
        // Get widgets in the same section, preserving their original order from the global array
        const sectionWidgets = newWidgets.filter(w => w.sectionId === currentWidget.sectionId);
        const positionInSection = sectionWidgets.findIndex(w => w.id === widgetId);

        let swapTarget: WidgetInstance | undefined;
        if (direction === 'up' && positionInSection > 0) {
            swapTarget = sectionWidgets[positionInSection - 1];
        } else if (direction === 'down' && positionInSection < sectionWidgets.length - 1) {
            swapTarget = sectionWidgets[positionInSection + 1];
        }

        if (swapTarget) {
            const swapTargetIndex = newWidgets.findIndex(w => w.id === swapTarget!.id);
            // Perform the swap in the main array
            [newWidgets[currentIndex], newWidgets[swapTargetIndex]] = [newWidgets[swapTargetIndex], newWidgets[currentIndex]];
            setWidgets(newWidgets);
        }
    };
    
    const handleResizeWidget = (widgetId: string, dimension: 'gridWidth' | 'gridHeight', value: number) => {
        setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, config: { ...w.config, [dimension]: value } } : w));
    };

    const handleAddSection = () => {
        const newSection = { id: `section-${Date.now()}`, title: 'New Section' };
        setSections(prev => [...prev, newSection]);
    };

    const handleRenameSection = (id: string, newTitle: string) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    };

    const handleDeleteSection = (idToDelete: string) => {
        if (sections.length <= 1) {
            alert("You must have at least one section.");
            return;
        }
        const firstSectionId = sections.find(s => s.id !== idToDelete)?.id;
        if (firstSectionId) {
            setWidgets(prev => prev.map(w => w.sectionId === idToDelete ? { ...w, sectionId: firstSectionId } : w));
        }
        setSections(prev => prev.filter(s => s.id !== idToDelete));
    };

    const handleWidgetSectionChange = (widgetId: string, newSectionId: string) => {
        setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, sectionId: newSectionId } : w));
    };

    const handleWidgetTitleChange = (widgetId: string, newTitle: string) => {
      setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, config: { ...w.config, title: newTitle }} : w));
    };

    if (!isOpen) return null;
    
    return (
         <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}>
            <div 
                className="fixed top-0 right-0 h-full w-[380px] max-w-full bg-zinc-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
                onClick={e => e.stopPropagation()}
            >
                <Card className="h-full flex flex-col rounded-none border-y-0 border-r-0 border-l border-zinc-700/50 bg-transparent backdrop-blur-none shadow-none">
                    <div className="p-4 border-b border-zinc-700/50 flex items-center justify-between">
                        <CardTitle>Edit Dashboard</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="h-5 w-5"/></Button>
                    </div>
                     <div className="px-4 border-b border-zinc-700/50">
                        <div className="flex items-center gap-2">
                             <button
                                onClick={() => setActiveTab('current')}
                                className={`px-3 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                    activeTab === 'current' ? 'border-violet-400 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                Current Layout
                            </button>
                            <button
                                onClick={() => setActiveTab('kpis')}
                                className={`px-3 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                    activeTab === 'kpis' ? 'border-violet-400 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                KPIs
                            </button>
                            <button
                                onClick={() => setActiveTab('premade')}
                                className={`px-3 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                    activeTab === 'premade' ? 'border-violet-400 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                Premade
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                className={`px-3 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                    activeTab === 'custom' ? 'border-violet-400 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                Custom
                            </button>
                        </div>
                    </div>
                    <CardContent className="flex-1 overflow-y-auto space-y-4 px-4 pt-6 pb-4">
                         {activeTab === 'current' && (
                            <div className="space-y-6">
                                <div className="space-y-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                                    <h3 className="text-base font-semibold text-zinc-100">Sections</h3>
                                    {sections.map(section => (
                                        <div key={section.id} className="flex items-center gap-2">
                                            <Input 
                                                value={section.title}
                                                onChange={e => handleRenameSection(section.id, e.target.value)}
                                                className="h-9"
                                            />
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400/70 hover:text-red-400" onClick={() => handleDeleteSection(section.id)} aria-label="Delete section" disabled={sections.length <= 1}>
                                                <Trash2Icon className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="secondary" onClick={handleAddSection} className="w-full">
                                        <PlusCircleIcon className="h-4 w-4 mr-2" />
                                        Add Section
                                    </Button>
                                </div>
                                {sections.map(section => {
                                    const sectionWidgets = widgets.filter(w => w.sectionId === section.id);
                                    return (
                                    <div key={section.id}>
                                        <h4 className="text-sm font-semibold text-zinc-300 mb-2">{section.title}</h4>
                                        {sectionWidgets.length > 0 ? sectionWidgets.map(widget => (
                                            <div key={widget.id} className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 space-y-3 mb-3">
                                                <div className="flex items-start justify-between">
                                                    <Input 
                                                        value={widget.config.title}
                                                        onChange={e => handleWidgetTitleChange(widget.id, e.target.value)}
                                                        className="h-9 text-sm font-semibold !bg-transparent border-0 focus:!bg-zinc-700 focus:ring-1 focus:ring-violet-500 flex-1"
                                                    />
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveWidget(widget.id, 'up')} aria-label="Move up"><ChevronUpIcon className="h-4 w-4"/></Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveWidget(widget.id, 'down')} aria-label="Move down"><ChevronDownIcon className="h-4 w-4"/></Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onConfigureWidget(widget)} aria-label="Configure"><SettingsIcon className="h-4 w-4"/></Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <Label htmlFor={`widget-section-${widget.id}`} className="text-xs">Section</Label>
                                                        <select
                                                            id={`widget-section-${widget.id}`}
                                                            value={widget.sectionId}
                                                            onChange={e => handleWidgetSectionChange(widget.id, e.target.value)}
                                                            className="mt-1 h-8 w-full rounded-md border border-zinc-700 bg-zinc-900/50 px-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                                        >
                                                            {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor={`widget-width-${widget.id}`} className="text-xs">Width</Label>
                                                            <select
                                                                id={`widget-width-${widget.id}`}
                                                                value={widget.config.gridWidth || 1}
                                                                onChange={e => handleResizeWidget(widget.id, 'gridWidth', parseInt(e.target.value))}
                                                                className="mt-1 h-8 w-full rounded-md border border-zinc-700 bg-zinc-900/50 px-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                                            >
                                                                {[1, 2, 3, 4].map(span => (
                                                                    <option key={span} value={span}>{span} Column{span > 1 ? 's' : ''}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`widget-height-${widget.id}`} className="text-xs">Height</Label>
                                                            <select
                                                                id={`widget-height-${widget.id}`}
                                                                value={widget.config.gridHeight || 1}
                                                                onChange={e => handleResizeWidget(widget.id, 'gridHeight', parseInt(e.target.value))}
                                                                className="mt-1 h-8 w-full rounded-md border border-zinc-700 bg-zinc-900/50 px-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                                            >
                                                                {[1, 2, 3, 4].map(span => (
                                                                    <option key={span} value={span}>{span} Row{span > 1 ? 's' : ''}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-center text-xs text-zinc-500 py-4">No widgets in this section.</p>
                                        )}
                                    </div>
                                )})}
                            </div>
                        )}
                        {activeTab === 'kpis' && (
                             <div className="space-y-4">
                                {Object.entries(groupedKpis).map(([source, kpis]) => (
                                    <div key={source}>
                                        <h4 className="text-sm font-semibold text-zinc-300 mb-2 px-1">{source}</h4>
                                        <div className="space-y-3">
                                            {kpis.map(kpi => (
                                                <div key={`${kpi.source}-${kpi.id}`} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                                    <Checkbox
                                                        id={`kpi-toggle-${kpi.id}`}
                                                        label={kpi.metric}
                                                        checked={widgets.some(w => w.id === `kpi-${kpi.source.replace(/\s+/g, '-')}-${kpi.id}`)}
                                                        onChange={() => handleKpiToggle(kpi)}
                                                    />
                                                     {kpi.value && <p className="text-xs text-zinc-400 mt-2 pl-8">{kpi.value} {kpi.change && <span className="text-zinc-500">({kpi.change})</span>}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'premade' && (
                             <div className="space-y-4">
                                {PREMADE_WIDGETS.map(widget => (
                                    <div key={widget.id} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                        <Checkbox
                                            id={`widget-toggle-${widget.id}`}
                                            label={widget.title}
                                            checked={widgets.some(w => w.id === widget.id)}
                                            onChange={() => handlePremadeToggle(widget)}
                                        />
                                        <p className="text-xs text-zinc-400 mt-2 pl-8">{widget.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                         {activeTab === 'custom' && (
                            <div className="space-y-3">
                                {GENERIC_WIDGETS.map(widget => (
                                     <button 
                                        key={widget.type} 
                                        onClick={() => handleCustomAdd(widget)}
                                        className="w-full text-left p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-violet-500 transition-colors flex items-center justify-between"
                                     >
                                        <div>
                                            <p className="font-semibold text-white">{widget.name}</p>
                                            <p className="text-xs text-zinc-400 mt-1">{widget.description}</p>
                                        </div>
                                        <PlusCircleIcon className="h-6 w-6 text-zinc-500 flex-shrink-0 ml-4" />
                                     </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-zinc-700/50">
                        <Button onClick={onClose} className="w-full">Done</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

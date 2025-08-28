
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { SparklesIcon } from './components/Icons';
import { ConfigurableKpiWidget } from './components/dashboard-widgets/ConfigurableKpiWidget';
import { getAllKpis } from './data';
import type { WidgetInstance, SelectableKpi, Page } from './types';
import {
    TrendingUpIcon, UsersIcon, ShoppingCartIcon, ClockIcon, TrendingDownIcon,
    PieChartIcon, SmileIcon, BarChartIcon, SearchIcon, MegaphoneIcon, GaugeIcon,
} from './components/Icons';
import { ActionCenterLayout } from './ActionCenterLayout';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const kpiWidgetConfigSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: 'A concise, descriptive title for the widget, reflecting the user\'s prompt and the KPI metric name.'
        },
        selectedKpiId: {
            type: Type.INTEGER,
            description: 'The numeric ID of the selected KPI from the provided list.'
        },
        selectedKpiSource: {
            type: Type.STRING,
            description: 'The source string of the selected KPI from the provided list.'
        }
    },
    required: ['title', 'selectedKpiId', 'selectedKpiSource']
};

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            widgetType: {
                type: Type.STRING,
                description: 'The type of widget to generate. Must be "KPI_VIEW".',
                enum: ['KPI_VIEW'],
            },
            config: kpiWidgetConfigSchema
        },
        required: ['widgetType', 'config']
    }
};

const KpiPreview: React.FC<{
    widgetInstance: WidgetInstance;
    allKpis: SelectableKpi[];
}> = ({ widgetInstance, allKpis }) => {
    const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
        'Annual Recurring Revenue': TrendingUpIcon, 'Active Users': UsersIcon, 'Customer Lifetime Value (LTV)': TrendingUpIcon,
        'Customer Churn Rate': TrendingDownIcon, 'Leads': UsersIcon, 'Conversion Rate': BarChartIcon,
        'System Uptime': TrendingUpIcon, 'Avg. Ticket Resolution Time': ClockIcon, 'Burn Rate': TrendingDownIcon,
        'DAU / MAU Ratio': GaugeIcon, 'Key Feature Adoption Rate': TrendingUpIcon, 'Headcount': UsersIcon, 'eNPS': SmileIcon,
        'Gross Merchandise Volume': ShoppingCartIcon, 'Average Order Value': TrendingUpIcon, 'Cart Abandonment Rate': TrendingDownIcon,
        'Organic Traffic': SearchIcon, 'Social Media Reach': UsersIcon, 'Media Mentions': MegaphoneIcon, 'Net Income (Monthly)': TrendingUpIcon,
        'Gross Profit Margin': PieChartIcon, 'Total Shares Outstanding': PieChartIcon, 'Founder Ownership %': UsersIcon,
    };
    const iconColorMap: { [key: string]: string } = { 'Burn Rate': 'text-red-400', 'Cart Abandonment Rate': 'text-red-400' };

    return (
        <ConfigurableKpiWidget
            instance={widgetInstance}
            allKpis={allKpis}
            iconMap={iconMap}
            iconColorMap={iconColorMap}
            onConfigure={() => {}}
            onConfigChange={() => {}}
            onOpenChart={() => {}}
            isKpiSentimentColoringEnabled={true}
        />
    );
};

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[136px] bg-zinc-800/50 rounded-3xl p-4 animate-pulse">
                <div className="h-4 bg-zinc-700/50 rounded w-3/4"></div>
                <div className="h-8 bg-zinc-700/50 rounded w-1/2 mt-8"></div>
                <div className="h-3 bg-zinc-700/50 rounded w-1/3 mt-2"></div>
            </div>
        ))}
    </div>
);

interface GenerationMetricProps {
    page: Page;
    setPage: (page: Page) => void;
}

export default function GenerationMetric({ page, setPage }: GenerationMetricProps) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedWidgets, setGeneratedWidgets] = useState<WidgetInstance[] | null>(null);

    const allKpis = useMemo(() => getAllKpis(), []);

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please describe the KPIs you want to generate.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedWidgets(null);

        const kpisForPrompt = allKpis.map(k => ({
            id: k.id,
            source: k.source,
            metric: k.metric,
            description: `Current value: ${k.value}, Change: ${k.change}`
        }));

        const systemInstruction = `You are an expert dashboard assistant. Your task is to select relevant Key Performance Indicators (KPIs) from a provided list based on a user's request. You must return a valid JSON array of widget configurations, one for each selected KPI. The JSON must conform to the specified schema. For each widget, you must find the matching KPI from the list and use its 'id' and 'source' for the 'selectedKpiId' and 'selectedKpiSource' fields. Generate a relevant 'title' for each widget based on the user's prompt and the KPI metric name. Only select KPIs that are highly relevant to the user's prompt.`;
        const fullPrompt = `User request: "${prompt}"\n\nAvailable KPIs:\n${JSON.stringify(kpisForPrompt)}`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const widgetData = JSON.parse(response.text);
            const widgetsWithIds = widgetData.map((widget: Omit<WidgetInstance, 'id' | 'sectionId'>) => ({
                ...widget,
                id: `gen-${widget.config.selectedKpiSource}-${widget.config.selectedKpiId}-${Date.now()}`,
                sectionId: 'generated',
            }));
            setGeneratedWidgets(widgetsWithIds);

        } catch (e) {
            console.error(e);
            setError('Failed to generate widgets. The model returned an unexpected format or could not find relevant KPIs. Please try rephrasing your request.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscard = () => {
        setGeneratedWidgets(null);
        setPrompt('');
        setError(null);
    };

    const handleAddToDashboard = () => {
        alert(`(Simulation) ${generatedWidgets?.length || 0} widget(s) added to a dashboard.`);
        handleDiscard();
    };
    
    const examplePrompts = [
        "Show me our main financial KPIs",
        "What's our user growth and churn?",
        "Create KPIs for marketing leads and conversion rate",
    ];

    return (
        <ActionCenterLayout
            page={page}
            setPage={setPage}
            pageDescription="Generate new dashboard KPIs using natural language based on your connected data."
        >
            <Card>
                <CardHeader>
                    <CardTitle>1. Describe what you need</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g., Show me our main financial KPIs, user growth, and churn rate"
                        className="h-28 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 resize-none"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-xs text-zinc-500">
                            Try: {examplePrompts.map((p, i) => (
                                <button key={i} onClick={() => setPrompt(p)} className="text-left hover:text-violet-400 transition-colors">
                                    "{p}"{i < examplePrompts.length -1 && ', '}
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
                            <SparklesIcon className="h-4 w-4 mr-2" />
                            {isLoading ? 'Generating...' : 'Generate KPIs'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-200">2. Review Generated KPIs</h2>
                {isLoading && <SkeletonLoader />}
                {error && <p className="text-red-400 text-sm text-center py-10">{error}</p>}

                {generatedWidgets && generatedWidgets.length > 0 && (
                     <div className="space-y-6 animate-fade-in-fast">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {generatedWidgets.map(widget => (
                                <KpiPreview key={widget.id} widgetInstance={widget} allKpis={allKpis} />
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-zinc-700/50">
                            <Button variant="secondary" onClick={handleDiscard}>Discard</Button>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select
                                    className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                                >
                                    <option>Add to Platform Home</option>
                                    <option>Add to Financial Dashboard</option>
                                    <option>Add to Sales Dashboard</option>
                                </select>
                                <Button onClick={handleAddToDashboard} className="flex-shrink-0">Add to Dashboard</Button>
                            </div>
                        </div>
                    </div>
                )}
                
                {generatedWidgets && generatedWidgets.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-zinc-500">
                         <p>No relevant KPIs were found for your request.</p>
                         <p className="text-xs mt-1">Please try being more specific or check your available KPIs.</p>
                    </div>
                )}

                {!isLoading && !generatedWidgets && !error && (
                    <div className="text-center py-10 text-zinc-500">
                         <p>Your generated KPI previews will appear here.</p>
                    </div>
                )}
            </div>
        </ActionCenterLayout>
    );
}

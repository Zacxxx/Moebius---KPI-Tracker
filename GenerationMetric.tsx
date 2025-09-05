import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration, Tool, Part } from '@google/genai';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { SparklesIcon, ChevronDownIcon } from './components/Icons';
import { ConfigurableKpiWidget } from './components/dashboard-widgets/ConfigurableKpiWidget';
import { getAllMetrics, ALL_DATA_SOURCES } from './data';
import type { WidgetInstance, SelectableKpi, Page } from './types';
import {
    TrendingUpIcon, UsersIcon, ShoppingCartIcon, ClockIcon, TrendingDownIcon,
    PieChartIcon, SmileIcon, BarChartIcon, SearchIcon, MegaphoneIcon, GaugeIcon,
} from './components/Icons';
import { ActionCenterLayout } from './ActionCenterLayout';
import { evaluateMathExpression, formatValue } from './utils';
import { GenerationSettingsPanel, GenerationSettings } from './components/GenerationSettingsPanel';
import { MissingDataInput, MissingDataField } from './components/MissingDataInput';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const calculateMetricTool: Tool = {
    functionDeclarations: [
        {
            name: 'calculate_metric',
            description: "Performs mathematical calculations on aggregated data source fields when all necessary data is available internally. Can use SUM, AVG, COUNT aggregations on columns like 'revenue_streams.mrr'. Can also perform basic arithmetic (+, -, *, /) on the results of these aggregations.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    expression: {
                        type: Type.STRING,
                        description: "The mathematical expression to evaluate. Example: 'SUM(revenue_streams.mrr) - SUM(expenses.cost)' to calculate net income."
                    }
                },
                required: ['expression']
            } as FunctionDeclaration,
        }
    ]
};

const requestUserDataTool: Tool = {
    functionDeclarations: [
        {
            name: 'request_user_data',
            description: "Use this function when the user's request requires data that is not available in the provided data sources. It prompts the user to input the missing values manually.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    fields: {
                        type: Type.ARRAY,
                        description: "An array of objects, where each object represents a piece of missing information needed from the user.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: {
                                    type: Type.STRING,
                                    description: "A machine-readable key for the data point (e.g., 'pigs_in_china')."
                                },
                                description: {
                                    type: Type.STRING,
                                    description: "A user-friendly label for the input field (e.g., 'Number of Pigs in China')."
                                }
                            },
                            required: ['name', 'description']
                        }
                    },
                    formula: {
                        type: Type.STRING,
                        description: "The mathematical formula that will be used once the user provides the missing data. e.g., '(pigs_in_china / population_of_china) * 100'."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief, user-friendly explanation of what this metric represents and how the requested data will be used."
                    }
                },
                required: ['fields', 'formula', 'explanation']
            } as FunctionDeclaration,
        }
    ]
};

const MetricPreview: React.FC<{
    widgetInstance: WidgetInstance;
    allMetrics: SelectableKpi[];
}> = ({ widgetInstance, allMetrics }) => {
    const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
        'Annual Recurring Revenue': TrendingUpIcon, 'Active Users': UsersIcon, 'Customer Lifetime Value (LTV)': TrendingUpIcon,
        'Customer Churn Rate': TrendingDownIcon, 'Leads': UsersIcon, 'Conversion Rate': BarChartIcon,
        'System Uptime': TrendingUpIcon, 'Avg. Ticket Resolution Time': ClockIcon, 'Burn Rate': TrendingDownIcon,
        'DAU / MAU Ratio': GaugeIcon, 'Key Feature Adoption Rate': TrendingUpIcon, 'Headcount': UsersIcon, 'eNPS': SmileIcon,
        'Gross Merchandise Volume': ShoppingCartIcon, 'Average Order Value': TrendingUpIcon, 'Cart Abandonment Rate': TrendingDownIcon,
        'Organic Traffic': SearchIcon, 'Social Media Reach': UsersIcon, 'Media Mentions': MegaphoneIcon, 'Net Income (Monthly)': TrendingUpIcon,
        'Gross Profit Margin': PieChartIcon, 'Total Shares Outstanding': PieChartIcon, 'Founder Ownership %': UsersIcon,
        'Net Income': TrendingUpIcon,
    };
    const iconColorMap: { [key: string]: string } = { 'Burn Rate': 'text-red-400', 'Cart Abandonment Rate': 'text-red-400' };

    return (
        <ConfigurableKpiWidget
            instance={widgetInstance}
            allMetrics={allMetrics}
            iconMap={iconMap}
            iconColorMap={iconColorMap}
            onConfigure={() => {}}
            onConfigChange={() => {}}
            onOpenChart={() => {}}
            isMetricSentimentColoringEnabled={true}
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

const LoadingState: React.FC<{ status: GenerationState }> = ({ status }) => (
    <div>
        <p className="text-center text-zinc-400 mb-4">{status.message}</p>
        <SkeletonLoader />
    </div>
);

type GenerationState = {
    step: 'idle' | 'thinking' | 'awaiting_input' | 'calculating' | 'generating' | 'error' | 'success';
    message?: string;
};

export default function GenerationMetric({ page, setPage }: GenerationMetricProps) {
    const [prompt, setPrompt] = useState('');
    const [generationState, setGenerationState] = useState<GenerationState>({ step: 'idle' });
    const [generatedWidgets, setGeneratedWidgets] = useState<WidgetInstance[] | null>(null);
    const [tempMetrics, setTempMetrics] = useState<SelectableKpi[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [missingDataInfo, setMissingDataInfo] = useState<{ fields: MissingDataField[], formula: string, explanation: string } | null>(null);
    const [settings, setSettings] = useState<GenerationSettings>({
        mode: 'guided',
        complexity: 'standard',
        dataSourcePreference: [],
        maxMetrics: 4,
        metricFormat: 'any',
        dataStrategy: 'prompt_for_missing',
    });

    const allMetrics = useMemo(() => getAllMetrics(), []);
    const metricsForPreview = useMemo(() => [...allMetrics, ...tempMetrics], [allMetrics, tempMetrics]);

    const handleSettingsChange = (newSettings: Partial<GenerationSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const finalizeWidgets = (widgetsArray: any[]) => {
        const widgetsWithIds = widgetsArray.map((widget: Omit<WidgetInstance, 'id' | 'sectionId'>, index: number) => {
            const metricId = widget.config.selectedMetricId ?? `calc-${index}`;
            const metricSource = widget.config.selectedMetricSource ?? 'unknown';
            return {
                ...widget,
                id: `gen-${metricSource}-${metricId}-${Date.now()}`,
                sectionId: 'generated',
            };
        });
        setGeneratedWidgets(widgetsWithIds);
        setGenerationState({ step: 'success' });
    };

    const handleDataProvided = async (providedData: Record<string, string>) => {
        setGenerationState({ step: 'generating', message: 'Calculating from provided data...' });
        setMissingDataInfo(null);

        const systemInstruction = `You are a dashboard assistant. The user's original goal was to calculate "${prompt}". You determined a formula of "${missingDataInfo?.formula}" but were missing data. The user has now provided it: ${JSON.stringify(providedData)}. Your task is now to:
1. Calculate the result of that formula using the provided data. The keys in the provided data object correspond to the variable names in the formula.
2. Generate a single METRIC_VIEW widget configuration in JSON format.
- The 'title' should be descriptive and match the original prompt (e.g., 'Pigs per Capita in China').
- The 'selectedMetricId' must be a unique negative integer (e.g., -1).
- The 'selectedMetricSource' must be 'user_provided'.
Return ONLY the JSON for the widget configuration, including the calculated value.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Please proceed with the calculation and widget generation based on the provided data.",
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            widgetType: { type: Type.STRING, enum: ['KPI_VIEW'] },
                            config: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    selectedMetricId: { type: Type.INTEGER },
                                    selectedMetricSource: { type: Type.STRING, enum: ['user_provided'] }
                                },
                                required: ['title', 'selectedMetricId', 'selectedMetricSource']
                            },
                            calculatedValue: {
                                type: Type.OBJECT,
                                properties: {
                                    value: { type: Type.NUMBER },
                                    change: { type: Type.STRING }
                                },
                                required: ['value', 'change']
                            }
                        },
                        required: ['widgetType', 'config', 'calculatedValue']
                    }
                }
            });

            const resultJson = JSON.parse(response.text);
            const { widgetType, config, calculatedValue } = resultJson;

            const newMetric: SelectableKpi = {
                id: config.selectedMetricId,
                source: config.selectedMetricSource,
                metric: config.title,
                value: formatValue(calculatedValue.value, settings.metricFormat !== 'any' ? settings.metricFormat : undefined),
                change: calculatedValue.change
            };
            setTempMetrics([newMetric]);
            finalizeWidgets([{ widgetType, config }]);

        } catch (e) {
            console.error(e);
            setGenerationState({ step: 'error', message: 'Failed to generate metric from provided data. Please check your inputs and try again.' });
        }
    };


    const handleGenerate = async () => {
        if (!prompt) {
            setGenerationState({ step: 'error', message: 'Please describe the metrics you want to generate.' });
            return;
        }

        setIsSettingsOpen(false);
        setGenerationState({ step: 'thinking', message: 'Analyzing your request...' });
        setGeneratedWidgets(null);
        setTempMetrics([]);

        const metricsForPrompt = allMetrics.map(k => ({ id: k.id, source: k.source, metric: k.metric, description: `Current value: ${k.value}, Change: ${k.change}` }));
        const dataSourcesSummary = Object.entries(ALL_DATA_SOURCES).map(([key, value]) => {
            const columns = value.schema?.map(c => c.accessorKey).join(', ') || 'N/A';
            return `- ${key}: [${columns}]`;
        }).join('\n');
        
        let systemInstruction = `You are an expert dashboard assistant. Analyze the user's request to select or calculate metrics.`;

        systemInstruction += `\nIf the request requires data not present in the available sources, call 'request_user_data'.`;
        if (settings.dataStrategy === 'available_only') {
            systemInstruction += `\nThe user has requested to ONLY use available data. DO NOT call 'request_user_data'. If data is missing, respond by selecting the closest available metrics or stating you cannot fulfill the request.`;
        }

        systemInstruction += `\nIf all data is available, call 'calculate_metric' for calculations or select existing metrics. Available data sources:\n${dataSourcesSummary}`;
        systemInstruction += `\nAfter a tool call, you will be called again to finalize the output.`;
        
        const fullPrompt = `User request: "${prompt}"\n\nAvailable existing metrics:\n${JSON.stringify(metricsForPrompt)}`;

        try {
            const firstResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { systemInstruction, tools: [calculateMetricTool, requestUserDataTool] } });
            
            const functionCalls = firstResponse.functionCalls;

            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                if (call.name === 'calculate_metric') {
                    const expression = call.args.expression as string;
                    setGenerationState({ step: 'calculating', message: `Calculating: ${expression}` });
                    const result = evaluateMathExpression(expression);

                    setGenerationState({ step: 'generating', message: 'Generating metric from calculated value...' });
                    
                    const systemInstruction2 = `The user asked for '${prompt}'. The calculated result is ${result}. Create a single KPI_VIEW widget for this. 'selectedMetricId' MUST be a unique negative number, and 'selectedMetricSource' MUST be "calculated". The 'title' should describe the metric.`;

                    const secondResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `Result: ${result}`,
                        config: {
                            systemInstruction: systemInstruction2, responseMimeType: "application/json", responseSchema: {
                                type: Type.ARRAY, items: {
                                    type: Type.OBJECT, properties: {
                                        widgetType: { type: Type.STRING, enum: ['KPI_VIEW'] },
                                        config: {
                                            type: Type.OBJECT,
                                            properties: {
                                                title: { type: Type.STRING },
                                                selectedMetricId: { type: Type.INTEGER },
                                                selectedMetricSource: { type: Type.STRING, enum: ['calculated'] }
                                            },
                                            required: ['title', 'selectedMetricId', 'selectedMetricSource']
                                        }
                                    },
                                    required: ['widgetType', 'config']
                                }
                            }
                        }
                    });

                    const widgetData = JSON.parse(secondResponse.text);
                    if (!widgetData || widgetData.length === 0 || !widgetData[0].config) {
                        throw new Error("Model failed to generate a widget from the calculated data.");
                    }
                    const newMetric = { id: widgetData[0].config.selectedMetricId, source: 'calculated', metric: widgetData[0].config.title, value: formatValue(result, settings.metricFormat !== 'any' ? settings.metricFormat : undefined), change: 'From live data' };
                    setTempMetrics([newMetric]);
                    finalizeWidgets(widgetData);

                } else if (call.name === 'request_user_data') {
                    setMissingDataInfo({
                        fields: call.args.fields as MissingDataField[],
                        formula: call.args.formula as string,
                        explanation: call.args.explanation as string,
                    });
                    setGenerationState({ step: 'awaiting_input', message: "The AI needs more information to proceed." });
                }
            } else {
                 setGenerationState({ step: 'generating', message: 'Formatting metric definitions...' });
                const jsonEnforcerResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `User prompt: "${prompt}"\n\nAvailable Metrics:\n${JSON.stringify(metricsForPrompt)}\n\nBased on the user prompt and available metrics, create a JSON array of relevant KPI_VIEW widgets.`,
                    config: {
                        systemInstruction, responseMimeType: "application/json", responseSchema: {
                            type: Type.ARRAY, items: {
                                type: Type.OBJECT, properties: {
                                    widgetType: { type: Type.STRING, enum: ['KPI_VIEW'] },
                                    config: {
                                        type: Type.OBJECT, properties: {
                                            title: { type: Type.STRING },
                                            selectedMetricId: { type: Type.INTEGER },
                                            selectedMetricSource: { type: Type.STRING }
                                        },
                                        required: ['title', 'selectedMetricId', 'selectedMetricSource']
                                    }
                                },
                                required: ['widgetType', 'config']
                            }
                        }
                    }
                });
                finalizeWidgets(JSON.parse(jsonEnforcerResponse.text));
            }

        } catch (e) {
            console.error(e);
            setGenerationState({ step: 'error', message: 'Failed to generate widgets. The model may have returned an unexpected format or could not find relevant metrics. Please try rephrasing your request.' });
        }
    };

    const handleDiscard = () => {
        setGeneratedWidgets(null);
        setPrompt('');
        setGenerationState({ step: 'idle' });
        setTempMetrics([]);
        setMissingDataInfo(null);
    };

    const handleAddToDashboard = () => {
        alert(`(Simulation) ${generatedWidgets?.length || 0} widget(s) added to a dashboard.`);
        handleDiscard();
    };
    
    const examplePrompts = [
        "What's our net income?",
        "Number of pigs per person in China",
        "Show me user growth and churn",
    ];
    
    const isLoading = ['thinking', 'calculating', 'generating'].includes(generationState.step);

    return (
        <ActionCenterLayout
            page={page}
            setPage={setPage}
            pageDescription="Generate new dashboard metrics using natural language. The AI can perform calculations on your data sources or ask for missing information to create new metrics."
        >
            <Card>
                <CardHeader>
                    <CardTitle>1. Describe what you need</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g., Show me our main financial metrics, user growth, and churn rate"
                        className="h-28 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 resize-none"
                        disabled={isLoading || generationState.step === 'awaiting_input'}
                    />
                     <div className="border border-zinc-700/50 rounded-lg">
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="flex items-center justify-between w-full p-3 text-left"
                            disabled={isLoading || generationState.step === 'awaiting_input'}
                        >
                            <span className="text-sm font-medium text-zinc-200">Generation Options</span>
                            <ChevronDownIcon className={`h-5 w-5 text-zinc-400 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSettingsOpen && (
                            <div className="p-4 border-t border-zinc-700/50 animate-fade-in-fast">
                                <GenerationSettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-xs text-zinc-500">
                            Try: {examplePrompts.map((p, i) => (
                                <button key={i} onClick={() => setPrompt(p)} className="text-left hover:text-violet-400 transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed" disabled={isLoading || generationState.step === 'awaiting_input'}>
                                    "{p}"{i < examplePrompts.length -1 && ', '}
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading || generationState.step === 'awaiting_input'} className="w-full sm:w-auto">
                            <SparklesIcon className="h-4 w-4 mr-2" />
                            {isLoading ? 'Generating...' : 'Generate Metrics'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-200">2. Review Generated Metrics</h2>
                {isLoading && <LoadingState status={generationState} />}
                {generationState.step === 'error' && <p className="text-red-400 text-sm text-center py-10">{generationState.message}</p>}
                
                {generationState.step === 'awaiting_input' && missingDataInfo && (
                    <MissingDataInput
                        fields={missingDataInfo.fields}
                        formula={missingDataInfo.formula}
                        explanation={missingDataInfo.explanation}
                        onSubmit={handleDataProvided}
                        onCancel={handleDiscard}
                    />
                )}

                {generatedWidgets && generatedWidgets.length > 0 && (
                     <div className="space-y-6 animate-fade-in-fast">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {generatedWidgets.map(widget => (
                                <MetricPreview key={widget.id} widgetInstance={widget} allMetrics={metricsForPreview} />
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
                
                {generationState.step === 'success' && (!generatedWidgets || generatedWidgets.length === 0) && (
                    <div className="text-center py-10 text-zinc-500">
                         <p>No relevant metrics were found for your request.</p>
                         <p className="text-xs mt-1">Please try being more specific or check your available metrics.</p>
                    </div>
                )}

                {generationState.step === 'idle' && (
                    <div className="text-center py-10 text-zinc-500">
                         <p>Your generated metric previews will appear here.</p>
                    </div>
                )}
            </div>
        </ActionCenterLayout>
    );
}
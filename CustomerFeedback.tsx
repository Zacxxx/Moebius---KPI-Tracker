

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { SmileIcon, TrendingUpIcon, TrendingDownIcon, SparklesIcon } from './components/Icons';
import type { FeedbackItem } from './types';
import { Button } from './components/ui/Button';
import { initialFeedbackData } from './data';

const FeedbackCard: React.FC<{ score: number, comment: string, user: string, type: string }> = ({ score, comment, user, type }) => {
    const scoreColor = type === 'promoter' ? 'text-emerald-400' : type === 'passive' ? 'text-yellow-400' : 'text-red-400';
    const borderColor = type === 'promoter' ? 'border-emerald-500/20' : type === 'passive' ? 'border-yellow-500/20' : 'border-red-500/20';
    return (
        <Card className={`bg-zinc-900/40 ${borderColor} flex flex-col`}>
            <CardContent className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <p className="text-zinc-300 italic">"{comment}"</p>
                        <div className={`flex-shrink-0 ml-4 text-2xl font-bold ${scoreColor}`}>{score}</div>
                    </div>
                    <p className="text-right text-xs text-zinc-500 mt-2">- {user}</p>
                </div>
                <div className="flex justify-end mt-2">
                    <Button 
                        variant="ghost" 
                        size="default" 
                        className="h-auto py-1 px-2 text-xs"
                        onClick={() => alert(`Analyzing feedback from ${user}...`)}
                    >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Analyze with AI
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

const KPIWidget: React.FC<{ title: string; value: string; icon: React.FC<{ className?: string }>; iconColor: string; sentiment?: 'positive' | 'negative'; isKpiSentimentColoringEnabled?: boolean; }> = ({ title, value, icon: Icon, iconColor, sentiment, isKpiSentimentColoringEnabled = true }) => {
    const valueColor = isKpiSentimentColoringEnabled && sentiment === 'positive' ? 'text-emerald-400' : isKpiSentimentColoringEnabled && sentiment === 'negative' ? 'text-red-400' : 'text-white';
    return (
        <Card className="h-full">
            <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div className="mt-auto text-left">
                    <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
                </div>
            </div>
        </Card>
    );
};

export default function CustomerFeedback({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
  const [feedbackData] = useState<FeedbackItem[]>(initialFeedbackData);
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Customer Feedback & NPS</h1>
        <p className="text-zinc-400 mt-1">Gauge customer satisfaction and review their feedback.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Net Promoter Score</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <KPIWidget title="Overall NPS" value="45" icon={SmileIcon} iconColor="text-emerald-400" sentiment="positive" isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
            <KPIWidget title="Promoters" value="60%" icon={TrendingUpIcon} iconColor="text-emerald-400" sentiment="positive" isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
            <KPIWidget title="Detractors" value="15%" icon={TrendingDownIcon} iconColor="text-red-400" sentiment="negative" isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Recent Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbackData.map((fb) => <FeedbackCard key={fb.id} {...fb} />)}
        </div>
      </section>

    </div>
  );
}
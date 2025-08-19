
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export interface KpiWidgetProps {
  title: string;
  value: string;
  change?: string;
  icon: React.FC<{className?: string}>;
  iconColor?: string;
}

export const KpiWidget: React.FC<KpiWidgetProps> = ({ title, value, change, icon: Icon, iconColor = 'text-violet-400' }) => (
    <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${iconColor}`} />
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold text-white">{value}</div>
            {change && <p className="text-xs text-zinc-500 mt-1">{change}</p>}
        </CardContent>
    </Card>
);

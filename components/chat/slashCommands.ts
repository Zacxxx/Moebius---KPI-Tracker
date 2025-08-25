
import React from 'react';
import { 
    BriefcaseIcon, HomeIcon, LineChartIcon, MegaphoneIcon, RocketIcon, 
    ShoppingCartIcon, SlidersIcon, UsersIcon, TrendingUpIcon, TrendingDownIcon,
    FileTextIcon, SmileIcon, MessageSquareIcon
} from "../Icons";

export interface SlashCommand {
    id: string;
    icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
    subCommands?: SlashCommand[];
}

export const slashCommands: SlashCommand[] = [
  { id: 'dashboard', icon: HomeIcon, title: 'Dashboard', description: 'Reference home dashboard KPIs' },
  { 
    id: 'financial', 
    icon: RocketIcon, 
    title: 'Financial', 
    description: 'Reference key financial metrics',
    subCommands: [
        { id: 'financial.revenue', icon: TrendingUpIcon, title: 'Revenue', description: 'Attach revenue stream data' },
        { id: 'financial.expenses', icon: TrendingDownIcon, title: 'Expenses', description: 'Attach expense breakdown' }
    ]
  },
  { id: 'simulation', icon: LineChartIcon, title: 'Simulation', description: 'Reference simulation parameters' },
  { id: 'sales', icon: ShoppingCartIcon, title: 'Sales', description: 'Reference e-commerce sales metrics' },
  { 
    id: 'customer', 
    icon: UsersIcon, 
    title: 'Customer', 
    description: 'Reference customer-related metrics',
    subCommands: [
        { id: 'customer.crm', icon: BriefcaseIcon, title: 'CRM Data', description: 'Attach CRM deal information' },
        { id: 'customer.feedback', icon: SmileIcon, title: 'Feedback', description: 'Attach customer feedback scores' },
        { id: 'customer.requests', icon: MessageSquareIcon, title: 'Feature Requests', description: 'Attach feature request list' }
    ]
  },
  { 
    id: 'internal', 
    icon: BriefcaseIcon, 
    title: 'Internal', 
    description: 'Reference internal team metrics',
    subCommands: [
        { id: 'internal.hiring', icon: UsersIcon, title: 'Hiring Pipeline', description: 'Attach hiring pipeline summary' }
    ]
  },
  { id: 'marketing', icon: MegaphoneIcon, title: 'Marketing', description: 'Reference marketing performance' },
  { id: 'operational', icon: SlidersIcon, title: 'Operational', description: 'Reference operational efficiency' },
];

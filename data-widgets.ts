import React, { useMemo } from 'react';
import type { Widget } from './types';
import { ProjectionGraphic } from './components/dashboard-widgets/ProjectionGraphic';
import { SalesTrendChart } from './components/dashboard-widgets/SalesTrendChart';
import { TopItemsList } from './components/dashboard-widgets/TopItemsList';
import { SalesFunnel } from './components/dashboard-widgets/SalesFunnel';
import { TrafficSourcesChart } from './components/dashboard-widgets/TrafficSourcesChart';
import { HiringPipelineWidget } from './components/dashboard-widgets/HiringPipelineWidget';
import { CampaignPerformanceWidget } from './components/dashboard-widgets/CampaignPerformanceWidget';
import ActivityFeed from './components/ActivityFeed';
import { initialRevenueStreams, initialExpenses, initialActivityFeed } from './data';

// Props for widgets that need them
const topProductsProps = {
    title: 'Top Selling Products',
    items: [
        { id: 1, name: 'Electric Guitar Standard', value: '€12,499.75' },
        { id: 2, name: 'Keyboard 88-Key', value: '€9,749.85' },
        { id: 3, name: 'Acoustic Guitar Pro', value: '€7,499.75' },
        { id: 4, name: 'Drum Kit Beginner', value: '€6,399.84' },
    ],
};

const topSourcesProps = {
    title: 'Top Referring Sources',
    items: [
        { id: 1, name: 'google.com', value: '3,281 visitors' },
        { id: 2, name: 'instagram.com', value: '2,150 visitors' },
        { id: 3, name: 'facebook.com', value: '1,567 visitors' },
        { id: 4, name: 'organic', value: '1,204 visitors' },
    ],
};

const useProjectionGraphicProps = () => {
    return useMemo(() => {
        const monthlyRevenue = initialRevenueStreams.reduce((sum, item) => sum + (item.mrr || 0), 0);
        const monthlyExpenses = initialExpenses.reduce((sum, item) => sum + (item.cost || 0), 0);
        return {
            monthlyRevenue,
            monthlyExpenses,
            initialCashBalance: 1200000,
        };
    }, []);
};

// Define wrapper as a proper component to ensure Rules of Hooks are followed
const ProjectionGraphicWrapper: React.FC = () => {
    const dynamicProps = useProjectionGraphicProps();
    return React.createElement(ProjectionGraphic, dynamicProps);
};

export const ALL_WIDGETS: Widget[] = [
    { 
        id: 'PROJECTION_GRAPHIC', 
        title: 'Projection Graphic',
        description: 'Interactive cash runway and financial projection chart.',
        component: ProjectionGraphicWrapper,
        gridWidth: 3,
    },
    { 
        id: 'SALES_TREND', 
        title: 'Sales Trend',
        description: 'Chart showing year-to-date sales trends.',
        component: SalesTrendChart,
        gridWidth: 2,
    },
    { 
        id: 'TOP_PRODUCTS', 
        title: 'Top Products',
        description: 'List of the current top-selling products.',
        component: TopItemsList,
        defaultProps: topProductsProps,
        gridWidth: 1,
    },
    { 
        id: 'TOP_SOURCES', 
        title: 'Top Sources',
        description: 'List of top referring traffic sources.',
        component: TopItemsList,
        defaultProps: topSourcesProps,
        gridWidth: 1,
    },
    {
        id: 'SALES_FUNNEL',
        title: 'Sales Funnel',
        description: 'Visualization of the sales funnel from visitors to customers.',
        component: SalesFunnel,
        gridWidth: 1,
    },
    {
        id: 'TRAFFIC_SOURCES',
        title: 'Traffic Sources',
        description: 'Pie chart breakdown of website traffic sources.',
        component: TrafficSourcesChart,
        gridWidth: 2,
    },
    {
        id: 'HIRING_PIPELINE',
        title: 'Hiring Pipeline',
        description: 'Table showing the current status of the hiring pipeline.',
        component: HiringPipelineWidget,
        gridWidth: 2,
    },
    {
        id: 'CAMPAIGN_PERFORMANCE',
        title: 'Campaign Performance',
        description: 'Table showing performance data for marketing campaigns.',
        component: CampaignPerformanceWidget,
        gridWidth: 3,
    },
    {
        id: 'ACTIVITY_FEED',
        title: 'Activity Feed',
        description: 'A feed of recent activities across the platform.',
        component: ActivityFeed,
        defaultProps: { activities: initialActivityFeed },
        gridWidth: 1,
    }
];
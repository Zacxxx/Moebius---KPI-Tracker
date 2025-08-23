import type { GenericWidget, PremadeWidgetInfo, WidgetInstance, GenericWidgetType } from './types';
import { ProjectionGraphic } from './components/dashboard-widgets/ProjectionGraphic';
import { TrendGraphicWidget } from './components/dashboard-widgets/SalesTrendChart';
import { ListViewWidget } from './components/dashboard-widgets/TopItemsList';
import { FunnelGraphicWidget } from './components/dashboard-widgets/SalesFunnel';
import { PieChartWidget } from './components/dashboard-widgets/TrafficSourcesChart';
import { TableViewWidget } from './components/dashboard-widgets/HiringPipelineWidget';
import ActivityFeed from './components/ActivityFeed';
import { QuickActionsWidget } from './components/dashboard-widgets/QuickActionsWidget';
import { ConfigurableKpiWidget } from './components/dashboard-widgets/ConfigurableKpiWidget';
export { ALL_DATA_SOURCES } from './data';

// Defines the blank, configurable widgets that can be added to a dashboard.
export const GENERIC_WIDGETS: GenericWidget[] = [
    {
        type: 'KPI_VIEW',
        name: 'KPI',
        description: 'Display a single, configurable Key Performance Indicator.',
        component: ConfigurableKpiWidget,
        defaultConfig: { title: 'New KPI', gridWidth: 1, gridHeight: 2 },
    },
    { 
        type: 'PROJECTION_GRAPHIC', 
        name: 'Projection Graphic',
        description: 'Interactive cash runway and financial projection chart.',
        component: ProjectionGraphic,
        defaultConfig: { title: 'New Projection', gridWidth: 3, gridHeight: 4 },
    },
    { 
        type: 'TREND_GRAPHIC', 
        name: 'Trend Graphic',
        description: 'An area chart to show trends over time.',
        component: TrendGraphicWidget,
        defaultConfig: { title: 'New Trend Chart', gridWidth: 2, gridHeight: 4, timeConfig: { type: 'preset', preset: '1y', granularity: 'monthly', offset: 0 } },
    },
    {
        type: 'TABLE_VIEW',
        name: 'Table View',
        description: 'Display any tabular data source.',
        component: TableViewWidget,
        defaultConfig: { title: 'New Table', gridWidth: 2, gridHeight: 4 },
    },
    {
        type: 'LIST_VIEW',
        name: 'List View',
        description: 'A ranked list of items.',
        component: ListViewWidget,
        defaultConfig: { title: 'New List', gridWidth: 1, gridHeight: 4 },
    },
    {
        type: 'PIE_CHART',
        name: 'Pie Chart',
        description: 'A pie chart to show proportional data.',
        component: PieChartWidget,
        defaultConfig: { title: 'New Pie Chart', gridWidth: 2, gridHeight: 4 },
    },
    {
        type: 'FUNNEL_GRAPHIC',
        name: 'Funnel Graphic',
        description: 'A vertical funnel to show stage-based data.',
        component: FunnelGraphicWidget,
        defaultConfig: { title: 'New Funnel', gridWidth: 1, gridHeight: 4 },
    },
    {
        type: 'ACTIVITY_FEED',
        name: 'Activity Feed',
        description: 'A feed of recent activities.',
        component: ActivityFeed,
        defaultConfig: { title: 'Activity Feed', gridWidth: 1, gridHeight: 4 },
    },
     {
        type: 'STATIC_QUICK_ACTIONS',
        name: 'Quick Actions',
        description: 'A set of common action buttons.',
        component: QuickActionsWidget,
        defaultConfig: { title: 'Quick Actions', gridWidth: 1, gridHeight: 2 },
    },
];

// Defines pre-configured widgets that can be added with one click.
export const PREMADE_WIDGETS: PremadeWidgetInfo[] = [
     {
        id: 'premade_sales_trend',
        title: 'Sales Trend',
        description: 'Chart showing sales trends over time.',
        instance: {
            widgetType: 'TREND_GRAPHIC',
            config: { title: 'Sales Trend', dataSourceKey: 'sales_trend_data', gridWidth: 2, gridHeight: 4, timeConfig: { type: 'preset', preset: '1y', granularity: 'monthly', offset: 0 } },
        }
    },
    {
        id: 'premade_top_products',
        title: 'Top Products',
        description: 'List of the current top-selling products.',
        instance: {
            widgetType: 'LIST_VIEW',
            config: { title: 'Top Selling Products', dataSourceKey: 'top_products_by_sales', gridWidth: 1, gridHeight: 4 },
        }
    },
    {
        id: 'premade_top_sources',
        title: 'Top Sources',
        description: 'List of top referring traffic sources.',
        instance: {
            widgetType: 'LIST_VIEW',
            config: { title: 'Top Referring Sources', dataSourceKey: 'top_referring_sources', gridWidth: 1, gridHeight: 4 },
        }
    },
     {
        id: 'premade_sales_funnel',
        title: 'Sales Funnel',
        description: 'Visualization of the sales funnel from visitors to customers.',
        instance: {
            widgetType: 'FUNNEL_GRAPHIC',
            config: { title: 'Sales Funnel', dataSourceKey: 'sales_funnel_data', gridWidth: 1, gridHeight: 4 },
        }
    },
    {
        id: 'premade_traffic_sources',
        title: 'Traffic Sources',
        description: 'Pie chart breakdown of website traffic sources.',
        instance: {
            widgetType: 'PIE_CHART',
            config: { title: 'Traffic Sources', dataSourceKey: 'traffic_sources_data', gridWidth: 2, gridHeight: 4 },
        }
    },
    {
        id: 'premade_hiring_pipeline',
        title: 'Hiring Pipeline',
        description: 'Table showing the current status of the hiring pipeline.',
        instance: {
            widgetType: 'TABLE_VIEW',
            config: { title: 'Hiring Pipeline', dataSourceKey: 'hiring_pipeline', gridWidth: 2, gridHeight: 4 },
        }
    },
    {
        id: 'premade_campaign_performance',
        title: 'Campaign Performance',
        description: 'Table showing performance data for marketing campaigns.',
        instance: {
            widgetType: 'TABLE_VIEW',
            config: { title: 'Campaign Performance', dataSourceKey: 'campaign_performance', gridWidth: 3, gridHeight: 4 },
        }
    },
     {
        id: 'premade_activity_feed',
        title: 'Activity Feed',
        description: 'A feed of recent activities across the platform.',
        instance: {
            widgetType: 'ACTIVITY_FEED',
            config: { title: 'Activity Feed', dataSourceKey: 'activity_feed_home', gridWidth: 1, gridHeight: 4 },
        }
    },
    {
        id: 'premade_external_activity_feed',
        title: 'External Activity Feed',
        description: 'A feed of recent external events like PR mentions.',
        instance: {
            widgetType: 'ACTIVITY_FEED',
            config: { title: 'External Activity', dataSourceKey: 'activity_feed_external', gridWidth: 1, gridHeight: 4 },
        }
    },
     {
        id: 'premade_recent_orders',
        title: 'Recent Orders',
        description: 'A table view of the 5 most recent orders.',
        instance: {
            widgetType: 'TABLE_VIEW',
            config: { title: 'Recent Orders', dataSourceKey: 'orders', gridWidth: 2, gridHeight: 4 },
        }
    },
     {
        id: 'premade_low_stock',
        title: 'Low Stock Products',
        description: 'A list of products that are low on stock or out of stock.',
        instance: {
            widgetType: 'LIST_VIEW',
            config: { title: 'Low Stock Products', dataSourceKey: 'low_stock_products', gridWidth: 1, gridHeight: 4 },
        }
    }
];

// A map for easy component lookup
export const WIDGET_COMPONENT_MAP: Record<GenericWidgetType, React.FC<any>> = GENERIC_WIDGETS.reduce((acc, widget) => {
    acc[widget.type] = widget.component;
    return acc;
}, {} as Record<GenericWidgetType, React.FC<any>>);
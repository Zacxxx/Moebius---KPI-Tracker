import type { Chat } from '@google/genai';
import React from 'react';

export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cellType?: 'text' | 'number' | 'badge' | 'currency';
  badgeOptions?: { [key: string]: 'default' | 'violet' | 'blue' | 'emerald' | 'red' };
}

export interface DashboardSection {
  id: string;
  title: string;
}

export type Page = 
  'dashboard' | 
  'simulation-dashboard' |
  'simulation-revenue' |
  'simulation-pnl' |
  'simulation-balance-sheet' |
  'financial-dashboard' | 
  'financial-revenue' |
  'financial-expenses' |
  'customer-dashboard' |
  'customer-crm' |
  'customer-requests' |
  'customer-feedback' |
  'product-analytics' |
  'marketing' |
  'operational-dashboard' |
  'operational-efficiency' |
  'operational-status' |
  'operational-costs' |
  'internal-dashboard' |
  'internal-people' |
  'internal-culture' |
  'internal-cap-table' |
  'data-sources' |
  'sales-dashboard' |
  'sales-orders' |
  'sales-inventory' |
  'sales-promotions' |
  'coordination-dashboard' |
  'coordination-contractors' |
  'coordination-agents' |
  'coordination-services' |
  'studio-dashboard' |
  'studio-projects' |
  'studio-tasks' |
  'studio-entities' |
  'studio-systems' |
  'studio-essences' |
  'marketplace-dashboard' |
  'marketplace-performances' |
  'marketplace-requests' |
  'marketplace-contracts' |
  'marketplace-prospection' |
  'external-dashboard' |
  'external-content' |
  'external-seo' |
  'external-partners' |
  'external-pr' |
  'external-branding' |
  'external-competition' |
  'conversations' |
  'team-management' |
  'profile' |
  'notifications' |
  'chat';

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    isBookmarked?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  geminiChat?: Chat;
  isGeneratingTitle?: boolean;
}

export interface Bookmark {
  message: Message;
  sessionId: string;
  sessionTitle: string;
}

// Data interfaces
export interface RevenueStream { id: number; stream: string; mrr: number; }
export interface ExpenseItem { id: number; category: string; cost: number; }
export interface HiringPipelineItem { id: number, role: string; department: string; status: 'Interviewing' | 'Sourcing' | 'Offer Extended'; candidates: number; }
export interface CrmDataItem { id: number, name: string; company: string; value: number; status: 'Proposal' | 'Negotiation' | 'Contacted' | 'Lead' | 'Closed - Won' | 'Closed - Lost'; contact: string; }
export interface RequestDataItem { id: number; title: string; user: string; votes: number; status: 'Shipped' | 'In Progress' | 'Planned' | 'Under Review'; }

type KpiFormat = 'currency' | 'percent' | 'number' | 'days' | 'hours' | 'ratio';
type KpiAggregation = 'sum' | 'avg' | 'end_value';
interface TimeSeries { date: string; value: number; }

export interface KpiMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface MarketingMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface OperationalMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface CustomerMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface FeedbackItem { id: number; score: number; comment: string; user: string; type: 'promoter' | 'passive' | 'detractor'; }
export interface ProductMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface CapTableMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface CoordinationMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface ActivityTextPart { text: string; strong?: boolean; }
export interface ActivityItem {
  id: number;
  icon: React.FC<{className?: string}>;
  iconColor?: string;
  descriptionParts: ActivityTextPart[];
  timestamp: string;
}
export interface Campaign {
  id: number;
  name: string;
  channel: 'Google Ads' | 'Facebook' | 'LinkedIn';
  status: 'Active' | 'Paused' | 'Completed';
  budget: number;
  cpa: number;
  roas: string;
}
export interface Team {
  id: string;
  name: string;
  channelId: string;
}
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  avatarUrl?: string; // Optional avatar URL
  lastActive: string;
  timezone: string;
  activityData: number[];
  teamIds: string[];
}
export interface TeamActivity {
  id: number;
  memberId: number;
  memberName: string;
  action: string;
  timestamp: string;
}
export interface ConversationUser {
  id: number;
  name: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
}
export interface ConversationMessage {
  id: string;
  text: string;
  timestamp: string;
  userId: number;
  userName: string;
  userAvatarUrl?: string;
}
export interface ConversationChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  unreadCount: number;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  members?: number[]; // user ids for DMs
}
export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
}

export interface DmToastState {
  channelId: string;
  isMinimized: boolean;
}

// E-commerce types
export interface EcommerceMetric { id: number; metric: string; value: string; change: string; series?: TimeSeries[]; format?: KpiFormat; aggregation?: KpiAggregation; target?: number; inverse?: boolean; }
export interface OrderItem { id: number; customer: string; date: string; total: number; status: 'New' | 'Processing' | 'Shipped' | 'Delivered'; items: number; }
export interface ProductItem { id: number; name: string; sku: string; stock: number; price: number; status: 'In Stock' | 'Low Stock' | 'Out of Stock'; }
export interface PromotionItem { id: number; code: string; type: 'Percentage' | 'Fixed Amount'; value: number; status: 'Active' | 'Expired'; usageCount: number; }

// New types for dynamic dashboard
export type ShowcaseKpi = KpiMetric | CustomerMetric | OperationalMetric | ProductMetric | MarketingMetric | CapTableMetric | CoordinationMetric | EcommerceMetric;
export type SelectableKpi = ShowcaseKpi & {
  source: string;
};

// New types for External section pages
export interface ContentMetric { id: number; metric: string; value: string; change: string; inverse?: boolean; }
export interface ContentItem { id: number; title: string; type: 'Blog Post' | 'Whitepaper' | 'Case Study'; date: string; views: number; engagement: string; }

export interface SeoMetric { id: number; metric: string; value: string; change: string; inverse?: boolean; }
export interface KeywordItem { id: number; keyword: string; position: number; change: number; volume: string; }
export interface BacklinkItem { id: number; domain: string; authority: number; date: string; }

export interface PartnerMetric { id: number; metric: string; value: string; change: string; inverse?: boolean; }
export interface PartnerItem { id: number; name: string; tier: 'Gold' | 'Silver' | 'Bronze'; leads: number; revenue: number; commission: number; }

export interface PrMetric { id: number; metric: string; value: string; change: string; inverse?: boolean; }
export interface MediaMentionItem { id: number; publication: string; title: string; date: string; url: string; }

export interface BrandingMetric { id: number; metric: string; value: string; change: string; inverse?: boolean; }
export interface BrandMentionData { name: string; Twitter: number; LinkedIn: number; News: number; }

export interface Competitor { id: number; name: string; funding: string; employees: string; founded: number; logoUrl: string; }
export interface FeatureComparison { feature: string; [competitorName: string]: boolean | string; }

// GENERIC WIDGET SYSTEM TYPES
export type GenericWidgetType = 
  'PROJECTION_GRAPHIC' | 
  'TREND_GRAPHIC' | 
  'LIST_VIEW' | 
  'PIE_CHART' |
  'FUNNEL_GRAPHIC' |
  'TABLE_VIEW' |
  'ACTIVITY_FEED' |
  'STATIC_QUICK_ACTIONS' |
  'KPI_VIEW';

export type DataSourceKey =
  | 'revenue_streams'
  | 'expenses'
  | 'hiring_pipeline'
  | 'crm_deals'
  | 'feature_requests'
  | 'orders'
  | 'products'
  | 'promotions'
  | 'sales_trend_data'
  | 'top_products_by_sales'
  | 'top_referring_sources'
  | 'sales_funnel_data'
  | 'traffic_sources_data'
  | 'campaign_performance'
  | 'activity_feed_home'
  | 'activity_feed_external'
  | 'low_stock_products';

export interface TimeConfig {
    type: 'preset' | 'custom';
    preset?: '3m' | '6m' | '1y' | 'all';
    custom?: {
        from: string; // ISO date string 'YYYY-MM-DD'
        to: string; // ISO date string 'YYYY-MM-DD'
    };
    granularity: 'daily' | 'weekly' | 'monthly' | 'yearly';
    offset?: number;
}

// Configuration for a widget instance
export interface WidgetConfig {
    title: string;
    dataSourceKey?: DataSourceKey;
    gridWidth?: number;
    gridHeight?: number;
    timeConfig?: TimeConfig;
    isTimeLocked?: boolean;
    style?: string; // e.g., 'default', 'subtle', 'highlighted', 'transparent'
    form?: string; // e.g., 'default', 'gauge', 'sparkline', 'comparison'
    // For KPI_VIEW
    selectedKpiId?: number;
    selectedKpiSource?: string;
}

// Represents a widget placed on a dashboard
export interface WidgetInstance {
    id: string; // unique instance ID, e.g., 'widget-1688886' or a premade ID
    widgetType: GenericWidgetType;
    config: WidgetConfig;
    sectionId: string;
}

// Describes a generic widget that can be added from the "Blank Widgets" tab
export interface GenericWidget {
  type: GenericWidgetType;
  name: string;
  description: string;
  component: React.FC<any>;
  defaultConfig: Partial<WidgetConfig>;
}

// Describes a premade, fully configured widget for one-click adding
export interface PremadeWidgetInfo {
    id: string; // unique ID for the premade widget, e.g. 'premade_sales_trend'
    title: string;
    description: string;
    instance: Omit<WidgetInstance, 'id' | 'sectionId'>;
}

// Prop type for generic widget components
export interface GenericWidgetProps {
  instance: WidgetInstance;
  onConfigure: () => void;
  onConfigChange: (newConfig: Partial<WidgetConfig>) => void;
  onCite?: () => void;
  // data is resolved in Dashboard.tsx and passed directly
  data?: any; 
  globalTimeConfig?: TimeConfig;
  isKpiSentimentColoringEnabled?: boolean;
}

export interface BaseWidgetConfigFormProps {
    config: WidgetInstance['config'];
    onConfigChange: (newConfig: Partial<WidgetInstance['config']>) => void;
    widgetType: GenericWidgetType;
}

export interface WidgetContext {
    id: string; // widget instance id
    title: string;
    icon: React.FC<{ className?: string }>;
    data: string;
}

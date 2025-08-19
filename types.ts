import type { Chat } from '@google/genai';
import React from 'react';

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
export interface KpiMetric { id: number; metric: string; value: string; change: string; }
export interface MarketingMetric { id: number; metric: string; value: string; change: string; }
export interface OperationalMetric { id: number; metric: string; value: string; change: string; }
export interface CustomerMetric { id: number; metric: string; value: string; change: string; }
export interface FeedbackItem { id: number; score: number; comment: string; user: string; type: 'promoter' | 'passive' | 'detractor'; }
export interface ProductMetric { id: number; metric: string; value: string; change: string; }
export interface CapTableMetric { id: number; metric: string; value: string; }
export interface CoordinationMetric { id: number; metric: string; value: string; change: string; }
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
export interface EcommerceMetric { id: number; metric: string; value: string; change: string; }
export interface OrderItem { id: number; customer: string; date: string; total: number; status: 'New' | 'Processing' | 'Shipped' | 'Delivered'; items: number; }
export interface ProductItem { id: number; name: string; sku: string; stock: number; price: number; status: 'In Stock' | 'Low Stock' | 'Out of Stock'; }
export interface PromotionItem { id: number; code: string; type: 'Percentage' | 'Fixed Amount'; value: number; status: 'Active' | 'Expired'; usageCount: number; }

// New types for dynamic dashboard
export type ShowcaseKpi = KpiMetric | CustomerMetric | OperationalMetric | ProductMetric | MarketingMetric | CapTableMetric | CoordinationMetric;
export type SelectableKpi = ShowcaseKpi & {
  source: string;
};

// New types for External section pages
export interface ContentMetric { id: number; metric: string; value: string; change: string; }
export interface ContentItem { id: number; title: string; type: 'Blog Post' | 'Whitepaper' | 'Case Study'; date: string; views: number; engagement: string; }

export interface SeoMetric { id: number; metric: string; value: string; change: string; }
export interface KeywordItem { id: number; keyword: string; position: number; change: number; volume: string; }
export interface BacklinkItem { id: number; domain: string; authority: number; date: string; }

export interface PartnerMetric { id: number; metric: string; value: string; change: string; }
export interface PartnerItem { id: number; name: string; tier: 'Gold' | 'Silver' | 'Bronze'; leads: number; revenue: number; commission: number; }

export interface PrMetric { id: number; metric: string; value: string; change: string; }
export interface MediaMentionItem { id: number; publication: string; title: string; date: string; url: string; }

export interface BrandingMetric { id: number; metric: string; value: string; change: string; }
export interface BrandMentionData { name: string; Twitter: number; LinkedIn: number; News: number; }

export interface Competitor { id: number; name: string; funding: string; employees: string; founded: number; logoUrl: string; }
export interface FeatureComparison { feature: string; [competitorName: string]: boolean | string; }

// Widget Types
export type WidgetType = 
  'PROJECTION_GRAPHIC' | 
  'SALES_TREND' | 
  'TOP_PRODUCTS' | 
  'TOP_SOURCES' | 
  'SALES_FUNNEL' | 
  'TRAFFIC_SOURCES' | 
  'HIRING_PIPELINE' | 
  'CAMPAIGN_PERFORMANCE' |
  'ACTIVITY_FEED';

export interface Widget {
  id: WidgetType;
  title: string;
  description: string;
  component: React.FC<any>;
  defaultProps?: any;
  gridWidth?: number; // e.g., 1, 2, or 3 for column span
}


import type { Chat } from '@google/genai';

export type Page = 
  'dashboard' | 
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
  'operational-efficiency' |
  'operational-status' |
  'operational-costs' |
  'internal-people' |
  'internal-culture' |
  'internal-cap-table' |
  'data-sources' |
  'sales-dashboard' |
  'sales-orders' |
  'sales-inventory' |
  'sales-promotions' |
  'coordination-contractors' |
  'coordination-agents' |
  'coordination-services' |
  'external-content' |
  'external-seo' |
  'external-partners' |
  'external-pr' |
  'external-branding' |
  'external-competition' |
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

// E-commerce types
export interface EcommerceMetric { id: number; metric: string; value: string; change: string; }
export interface OrderItem { id: number; customer: string; date: string; total: number; status: 'New' | 'Processing' | 'Shipped' | 'Delivered'; items: number; }
export interface ProductItem { id: number; name: string; sku: string; stock: number; price: number; status: 'In Stock' | 'Low Stock' | 'Out of Stock'; }
export interface PromotionItem { id: number; code: string; type: 'Percentage' | 'Fixed Amount'; value: number; status: 'Active' | 'Expired'; usageCount: number; }

// New types for dynamic dashboard
export type ShowcaseKpi = KpiMetric | CustomerMetric | OperationalMetric | ProductMetric | MarketingMetric | CapTableMetric;
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


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
  'marketing-funnel' |
  'operational-efficiency' |
  'operational-status' |
  'operational-costs' |
  'internal-people' |
  'internal-culture' |
  'internal-cap-table' |
  'data-sources' |
  'ecommerce-dashboard' |
  'ecommerce-orders' |
  'ecommerce-inventory' |
  'ecommerce-promotions' |
  'coordination-contractors' |
  'coordination-agents' |
  'coordination-services' |
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

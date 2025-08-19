
import type { 
    RevenueStream,
    ExpenseItem,
    HiringPipelineItem,
    CrmDataItem,
    RequestDataItem,
    KpiMetric,
    MarketingMetric,
    OperationalMetric,
    CustomerMetric,
    FeedbackItem,
    ProductMetric,
    CapTableMetric,
    EcommerceMetric,
    OrderItem,
    ProductItem,
    PromotionItem,
    ActivityItem 
} from './types';


// Initial Data
export const initialRevenueStreams: RevenueStream[] = [
    { id: 1, stream: 'SaaS Subscriptions - Tier 1', mrr: 45000 },
    { id: 2, stream: 'SaaS Subscriptions - Tier 2', mrr: 30000 },
    { id: 3, stream: 'Professional Services', mrr: 10000 },
];
export const initialExpenses: ExpenseItem[] = [
  { id: 1, category: 'Salaries & Benefits', cost: 75000 },
  { id: 2, category: 'Marketing & Advertising', cost: 25000 },
  { id: 3, category: 'Software & Tools (SaaS)', cost: 8000 },
  { id: 4, category: 'Rent & Utilities', cost: 12000 },
  { id: 5, category: 'Other', cost: 20000 },
];
export const initialHiringPipeline: HiringPipelineItem[] = [
    { id: 1, role: 'Senior Frontend Engineer', department: 'Engineering', status: 'Interviewing', candidates: 5 },
    { id: 2, role: 'Product Manager', department: 'Product', status: 'Sourcing', candidates: 12 },
    { id: 3, role: 'Head of Sales', department: 'Sales', status: 'Offer Extended', candidates: 1 },
    { id: 4, role: 'UX/UI Designer', department: 'Design', status: 'Interviewing', candidates: 3 },
];
export const initialCrmData: CrmDataItem[] = [
    { id: 1, name: 'Alice Johnson', company: 'Innovate Corp', value: 25000, status: 'Proposal', contact: 'alice@innovate.com' },
    { id: 2, name: 'Bob Smith', company: 'Data Solutions', value: 40000, status: 'Negotiation', contact: 'bob@data.com' },
    { id: 3, name: 'Charlie Brown', company: 'Future Tech', value: 15000, status: 'Contacted', contact: 'charlie@future.tech' },
    { id: 4, name: 'Diana Prince', company: 'Global Synergy', value: 60000, status: 'Lead', contact: 'diana@synergy.com' },
    { id: 5, name: 'Eve Adams', company: 'Quantum Leap', value: 32000, status: 'Closed - Won', contact: 'eve@quantum.com' },
    { id: 6, name: 'Frank Miller', company: 'Apex Industries', value: 22000, status: 'Closed - Lost', contact: 'frank@apex.com' },
];
export const initialRequestData: RequestDataItem[] = [
    { id: 1, title: 'Add dark mode toggle to user settings', user: 'Alice J.', votes: 128, status: 'Shipped' },
    { id: 2, title: 'Integrate with third-party calendar apps', user: 'Bob S.', votes: 92, status: 'In Progress' },
    { id: 3, title: 'Export data to CSV/Excel', user: 'Charlie B.', votes: 75, status: 'Planned' },
    { id: 4, title: 'Improve mobile responsiveness of dashboard', user: 'Diana P.', votes: 61, status: 'In Progress' },
    { id: 5, title: 'Add more chart customization options', user: 'Eve A.', votes: 45, status: 'Under Review' },
    { id: 6, title: 'API access for enterprise customers', user: 'Frank M.', votes: 33, status: 'Under Review' },
];
export const initialKpiMetrics: KpiMetric[] = [
    { id: 1, metric: 'Annual Recurring Revenue', value: '€1.2M', change: '+20.1% from last month' },
    { id: 2, metric: 'Active Users', value: '11,600', change: '+180 since last week' },
    { id: 3, metric: 'Marketing ROI', value: '+320%', change: '+5% from last campaign' },
];
export const initialMarketingMetrics: MarketingMetric[] = [
    { id: 1, metric: 'Leads', value: '3,450', change: '+15% this month' },
    { id: 2, metric: 'Conversion Rate', value: '4.2%', change: '-0.2% this month' },
    { id: 3, metric: 'Customer Acquisition Cost (CAC)', value: '€120', change: '+€5 from last month' },
];
export const initialOperationalMetrics: OperationalMetric[] = [
    { id: 1, metric: 'System Uptime', value: '99.98%', change: 'Last 30 days' },
    { id: 2, metric: 'Avg. Ticket Resolution Time', value: '4.2 hours', change: '-10% from last week' },
    { id: 3, metric: 'Burn Rate', value: '€85k/month', change: 'Based on last month' },
];
export const initialCustomerMetrics: CustomerMetric[] = [
    { id: 1, metric: 'Customer Lifetime Value (LTV)', value: '€2,480', change: '+12% from last month' },
    { id: 2, metric: 'Customer Churn Rate', value: '2.1%', change: '-0.3% from last month' },
    { id: 3, metric: 'LTV to CAC Ratio', value: '4.2 : 1', change: 'Healthy ratio' },
    { id: 4, metric: 'Active Subscribers', value: '8,921', change: '+210 this month' },
];
export const initialFeedbackData: FeedbackItem[] = [
    { id: 1, score: 10, comment: "Absolutely love the new dashboard design! It's so much more intuitive and visually appealing. Keep up the great work!", user: 'Sarah K.', type: 'promoter' },
    { id: 2, score: 9, comment: "The recent performance improvements are very noticeable. The app feels much faster now. Great job!", user: 'Michael B.', type: 'promoter' },
    { id: 3, score: 7, comment: "The product is good, but I wish there was better documentation for the API. It was a bit hard to get started.", user: 'Jessica L.', type: 'passive' },
    { id: 4, score: 5, comment: "I've experienced a few bugs with the data export feature. It sometimes fails without a clear error message.", user: 'David C.', type: 'detractor' },
    { id: 5, score: 9, comment: "Customer support was fantastic! They helped me solve my issue within minutes.", user: 'Emily R.', type: 'promoter' },
];
export const initialProductMetrics: ProductMetric[] = [
    { id: 1, metric: 'DAU / MAU Ratio', value: '35%', change: '+2% week-over-week' },
    { id: 2, metric: 'Key Feature Adoption Rate', value: '62%', change: 'Target: 70%' },
    { id: 3, metric: 'Net Promoter Score (NPS)', value: '45', change: 'Last surveyed in Q2' },
    { id: 4, metric: 'Avg. Session Duration', value: '8m 12s', change: '+30s from last month' },
];
export const initialCapTableMetrics: CapTableMetric[] = [
    { id: 1, metric: 'Total Shares Outstanding', value: '10,000,000' },
    { id: 2, metric: 'Founder Ownership %', value: '60%' },
    { id: 3, metric: 'Investor Ownership %', value: '30%' },
    { id: 4, metric: 'ESOP Pool %', value: '10%' },
];
export const initialActivityFeed: ActivityItem[] = [];

// E-commerce mock data
export const initialEcommerceMetrics: EcommerceMetric[] = [
    { id: 1, metric: 'Gross Merchandise Volume', value: '€212,450', change: '+12.5% this month' },
    { id: 2, metric: 'Average Order Value', value: '€84.98', change: '+€2.10 this month' },
    { id: 3, metric: 'Conversion Rate', value: '3.1%', change: '-0.1% this month' },
    { id: 4, metric: 'Cart Abandonment Rate', value: '68.2%', change: '-2.5% this month' },
];
export const initialOrders: OrderItem[] = [
    { id: 1, customer: 'Liam Gallagher', date: '2024-07-21', total: 75.50, status: 'Shipped', items: 3 },
    { id: 2, customer: 'Noel Gallagher', date: '2024-07-21', total: 120.00, status: 'Processing', items: 2 },
    { id: 3, customer: 'Damon Albarn', date: '2024-07-20', total: 45.99, status: 'Delivered', items: 1 },
    { id: 4, customer: 'Jarvis Cocker', date: '2024-07-21', total: 88.25, status: 'New', items: 4 },
    { id: 5, customer: 'Richard Ashcroft', date: '2024-07-19', total: 210.75, status: 'Delivered', items: 5 },
    { id: 6, customer: 'Ian Brown', date: '2024-07-21', total: 65.00, status: 'Processing', items: 2 },
];
export const initialProducts: ProductItem[] = [
    { id: 1, name: 'Acoustic Guitar Pro', sku: 'AGP-001', stock: 15, price: 299.99, status: 'In Stock' },
    { id: 2, name: 'Electric Guitar Standard', sku: 'EGS-002', stock: 8, price: 499.99, status: 'Low Stock' },
    { id: 3, name: 'Bass Guitar Vintage', sku: 'BGV-003', stock: 0, price: 799.99, status: 'Out of Stock' },
    { id: 4, name: 'Drum Kit Beginner', sku: 'DKB-004', stock: 25, price: 399.99, status: 'In Stock' },
    { id: 5, name: 'Keyboard 88-Key', sku: 'K88-005', stock: 12, price: 649.99, status: 'In Stock' },
];
export const initialPromotions: PromotionItem[] = [
    { id: 1, code: 'SUMMER20', type: 'Percentage', value: 20, status: 'Active', usageCount: 142 },
    { id: 2, code: 'FREESHIP', type: 'Fixed Amount', value: 10, status: 'Active', usageCount: 310 },
    { id: 3, code: 'SPRING15', type: 'Percentage', value: 15, status: 'Expired', usageCount: 88 },
];

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
    ActivityItem,
    Campaign,
    Team,
    TeamMember,
    TeamActivity,
    ContentMetric,
    ContentItem,
    SeoMetric,
    KeywordItem,
    BacklinkItem,
    PartnerMetric,
    PartnerItem,
    PrMetric,
    MediaMentionItem,
    BrandingMetric,
    BrandMentionData,
    Competitor,
    FeatureComparison,
    ConversationUser,
    ConversationChannel,
    ConversationMessage,
    NotificationItem,
    CoordinationMetric,
    ColumnDef,
    DataSourceKey,
    GenericWidgetType,
    SelectableKpi,
} from './types';
import { FileTextIcon, MegaphoneIcon, MessageSquareIcon, SearchIcon, TrendingUpIcon, UsersIcon } from './components/Icons';

const generateTimeSeriesData = (base: number, trend: number, seasonality: number, days: number, noise: number = 0.05) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 86400000;
        const seasonalMultiplier = 1 + (Math.sin((dayOfYear / 365.25) * 2 * Math.PI - Math.PI / 2) * seasonality);
        
        const trendValue = base + (days - i) * trend;
        const randomFluctuation = Math.random() * (base * noise) - (base * noise / 2);
        
        const value = trendValue * seasonalMultiplier + randomFluctuation;
        
        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.max(0, value),
        });
    }
    return data;
};


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
];
export const initialRequestData: RequestDataItem[] = [
    { id: 1, title: 'Add dark mode toggle to user settings', user: 'Alice J.', votes: 128, status: 'Shipped' },
    { id: 2, title: 'Integrate with third-party calendar apps', user: 'Bob S.', votes: 92, status: 'In Progress' },
    { id: 3, title: 'Export data to CSV/Excel', user: 'Charlie B.', votes: 75, status: 'Planned' },
];
export const initialKpiMetrics: KpiMetric[] = [
    { id: 1, metric: 'Annual Recurring Revenue', value: '€1.2M', change: '+20.1% from last month', format: 'currency', aggregation: 'end_value', series: generateTimeSeriesData(900000, 500, 0.05, 730), target: 1500000 },
    { id: 2, metric: 'Active Users', value: '11,600', change: '+180 since last week', format: 'number', aggregation: 'end_value', series: generateTimeSeriesData(8000, 5, 0.1, 730), target: 15000 },
    { id: 3, metric: 'Customer Lifetime Value (LTV)', value: '€2,480', change: '+12% from last month', format: 'currency', aggregation: 'avg', series: generateTimeSeriesData(2000, 0.8, 0.05, 730), target: 2600 },
    { id: 4, metric: 'Customer Churn Rate', value: '2.1%', change: '-0.3% from last month', format: 'percent', aggregation: 'avg', series: generateTimeSeriesData(2.5, -0.001, 0.1, 730, 0.3), target: 2, inverse: true },
];
export const initialMarketingMetrics: MarketingMetric[] = [
    { id: 1, metric: 'Leads', value: '3,450', change: '+15% this month', format: 'number', aggregation: 'sum', series: generateTimeSeriesData(80, 0.1, 0.15, 730), target: 4000 },
    { id: 2, metric: 'Conversion Rate', value: '4.2%', change: '-0.2% this month', format: 'percent', aggregation: 'avg', series: generateTimeSeriesData(4, 0.001, 0.05, 730, 0.2), target: 5 },
];
export const initialOperationalMetrics: OperationalMetric[] = [
    { id: 1, metric: 'System Uptime', value: '99.98%', change: 'Last 30 days', target: 99.99 },
    { id: 2, metric: 'Avg. Ticket Resolution Time', value: '4.2 hours', change: '-10% from last week', target: 4, inverse: true },
    { id: 3, metric: 'Burn Rate', value: '€85k/month', change: 'Based on last month', target: 80000, inverse: true },
];
export const initialCustomerMetrics: CustomerMetric[] = [
    { id: 1, metric: 'Customer Lifetime Value (LTV)', value: '€2,480', change: '+12% from last month', format: 'currency', aggregation: 'avg', series: generateTimeSeriesData(2000, 0.8, 0.05, 730), target: 2600 },
    { id: 2, metric: 'Customer Churn Rate', value: '2.1%', change: '-0.3% from last month', format: 'percent', aggregation: 'avg', series: generateTimeSeriesData(2.5, -0.001, 0.1, 730, 0.3), target: 2, inverse: true },
];
export const initialFeedbackData: FeedbackItem[] = [
    { id: 1, score: 10, comment: "Absolutely love the new dashboard design! It's so much more intuitive and visually appealing. Keep up the great work!", user: 'Sarah K.', type: 'promoter' },
    { id: 2, score: 9, comment: "The recent performance improvements are very noticeable. The app feels much faster now. Great job!", user: 'Michael B.', type: 'promoter' },
];
export const initialProductMetrics: ProductMetric[] = [
    { id: 1, metric: 'DAU / MAU Ratio', value: '35%', change: '+2% week-over-week', format: 'percent', aggregation: 'avg', series: generateTimeSeriesData(30, 0.01, 0.1, 730, 0.2), target: 40 },
    { id: 2, metric: 'Key Feature Adoption Rate', value: '62%', change: 'Target: 70%', format: 'percent', aggregation: 'avg', series: generateTimeSeriesData(45, 0.05, 0.05, 730), target: 70 },
];
export const initialCapTableMetrics: CapTableMetric[] = [
    { id: 1, metric: 'Total Shares Outstanding', value: '10,000,000', change: '' },
    { id: 2, metric: 'Founder Ownership %', value: '60%', change: '' },
];
export const initialCoordinationMetrics: CoordinationMetric[] = [
    { id: 1, metric: 'Active Contractors', value: '12', change: '+2 this month' },
    { id: 2, metric: 'Avg. Project Completion Time', value: '28 days', change: '-3 days vs last quarter' },
];
export const initialTeams: Team[] = [
    { id: 'eng', name: 'Engineering', channelId: 'eng-channel' },
    { id: 'prod', name: 'Product', channelId: 'prod-channel' },
    { id: 'sales', name: 'Sales', channelId: 'sales-channel' },
];
export const initialTeamMembers: TeamMember[] = [
    { id: 1, name: 'John Doe', role: 'CEO, Founder', status: 'online', avatarUrl: undefined, lastActive: 'Online', timezone: 'PST', activityData: [5, 6, 8, 7, 9, 7, 8], teamIds: ['eng', 'prod', 'sales'] },
    { id: 2, name: 'Alice Johnson', role: 'Lead Engineer', status: 'online', avatarUrl: undefined, lastActive: 'Online', timezone: 'GMT', activityData: [9, 8, 10, 9, 11, 10, 9], teamIds: ['eng'] },
];
export const initialTeamActivity: TeamActivity[] = [
    { id: 1, memberId: 2, memberName: 'Alice Johnson', action: 'Deployed version 2.1.0 to production.', timestamp: '15m ago' },
    { id: 2, memberId: 5, memberName: 'Diana Prince', action: 'Closed a $50,000 deal with Future Tech.', timestamp: '1h ago' },
];
export const initialActivityFeed: ActivityItem[] = [
    {
        id: 1,
        icon: TrendingUpIcon,
        iconColor: 'text-emerald-400',
        descriptionParts: [{ text: "Annual Recurring Revenue", strong: true }, { text: " increased by " }, { text: "€15,000", strong: true }, { text: "." }],
        timestamp: "2 hours ago"
    },
    {
        id: 2,
        icon: UsersIcon,
        iconColor: 'text-violet-400',
        descriptionParts: [{ text: "New user ", strong: true }, { text: "John Doe" }, { text: " signed up." }],
        timestamp: "1 day ago"
    }
];

export const initialExternalActivityFeed: ActivityItem[] = [
    {
        id: 1,
        icon: MegaphoneIcon,
        iconColor: 'text-blue-400',
        descriptionParts: [{ text: "New media mention in ", strong: true }, { text: "TechCrunch", strong: false }, { text: "." }],
        timestamp: "45 minutes ago"
    },
    {
        id: 2,
        icon: SearchIcon,
        iconColor: 'text-emerald-400',
        descriptionParts: [{ text: "Organic traffic increased by ", strong: false }, { text: "15%", strong: true }, { text: " this month." }],
        timestamp: "3 hours ago"
    },
];

export const initialCampaigns: Campaign[] = [
    { id: 1, name: 'Summer Sale 2024', channel: 'Google Ads', status: 'Active', budget: 5000, cpa: 85, roas: '5.2:1' },
    { id: 2, name: 'Q3 Lead Generation', channel: 'Facebook', status: 'Active', budget: 7500, cpa: 110, roas: '4.1:1' },
];

export const initialNotifications: NotificationItem[] = [
    { id: 1, type: 'new_users', title: '5 new users signed up', detail: 'Your user base grew by 0.5% today.', time: '10m ago', unread: true, icon: UsersIcon, iconColor: 'text-violet-400' },
    { id: 2, type: 'report_ready', title: 'Q2 Financial Report is ready', detail: 'The quarterly report has been generated.', time: '1h ago', unread: true, icon: FileTextIcon, iconColor: 'text-emerald-400' },
];

// E-commerce mock data
export const initialEcommerceMetrics: EcommerceMetric[] = [
    { id: 1, metric: 'Gross Merchandise Volume', value: '€212,450', change: '+12.5% this month', format: 'currency', aggregation: 'sum', series: generateTimeSeriesData(5000, 10, 0.2, 730), target: 250000 },
    { id: 2, metric: 'Average Order Value', value: '€84.98', change: '+€2.10 this month', format: 'currency', aggregation: 'avg', series: generateTimeSeriesData(80, 0.01, 0.05, 730), target: 90 },
    { id: 3, metric: 'Conversion Rate', value: '3.5%', change: '+0.2% this month', format: 'percent', aggregation: 'avg', series: generateTimeSeriesData(3, 0.001, 0.1, 730, 0.2), target: 4 },
    { id: 4, metric: 'Cart Abandonment Rate', value: '28%', change: '-1.5% this month', format: 'percent', aggregation: 'avg', inverse: true, series: generateTimeSeriesData(35, -0.01, 0.1, 730, 0.3), target: 25 },
];
export const initialOrders: OrderItem[] = [
    { id: 1, customer: 'Liam Gallagher', date: '2024-07-21', total: 75.50, status: 'Shipped', items: 3 },
    { id: 2, customer: 'Noel Gallagher', date: '2024-07-21', total: 120.00, status: 'Processing', items: 2 },
    { id: 3, customer: 'Damon Albarn', date: '2024-07-20', total: 45.99, status: 'Delivered', items: 1 },
];
export const initialProducts: ProductItem[] = [
    { id: 1, name: 'Acoustic Guitar Pro', sku: 'AGP-001', stock: 15, price: 299.99, status: 'In Stock' },
    { id: 2, name: 'Electric Guitar Standard', sku: 'EGS-002', stock: 8, price: 499.99, status: 'Low Stock' },
];
export const initialPromotions: PromotionItem[] = [
    { id: 1, code: 'SUMMER20', type: 'Percentage', value: 20, status: 'Active', usageCount: 142 },
    { id: 2, code: 'FREESHIP', type: 'Fixed Amount', value: 10, status: 'Active', usageCount: 310 },
];

// Content Page Data
export const initialContentMetrics: ContentMetric[] = [
    { id: 1, metric: 'Total Content Pieces', value: '128', change: '+12 this quarter' },
    { id: 2, metric: 'Avg. Engagement Rate', value: '4.8%', change: '+0.3% vs last month' },
];
export const initialContentItems: ContentItem[] = [
    { id: 1, title: "The Ultimate Guide to SaaS Metrics", type: "Blog Post", date: "2024-07-15", views: 12500, engagement: "8.2%" },
    { id: 2, title: "State of AI in Business Report", type: "Whitepaper", date: "2024-07-01", views: 8200, engagement: "15.3%" },
];

// SEO Page Data
export const initialSeoMetrics: SeoMetric[] = [
    { id: 1, metric: 'Organic Traffic', value: '82.1k', change: '+15% MoM' },
    { id: 2, metric: 'Avg. Keyword Position', value: '8.2', change: '-0.5 this month', inverse: true },
];
export const initialKeywordItems: KeywordItem[] = [
    { id: 1, keyword: "saas dashboard", position: 3, change: 1, volume: "12.1k" },
    { id: 2, keyword: "financial simulation tool", position: 5, change: -1, volume: "8.5k" },
];
export const initialBacklinkItems: BacklinkItem[] = [
    { id: 1, domain: "techcrunch.com", authority: 94, date: "2024-07-18" },
    { id: 2, domain: "forbes.com", authority: 95, date: "2024-07-15" },
];

// Partners Page Data
export const initialPartnerMetrics: PartnerMetric[] = [
    { id: 1, metric: 'Total Active Partners', value: '42', change: '+3 this quarter' },
    { id: 2, metric: 'Partner-Sourced Leads', value: '158', change: 'Current Month' },
];
export const initialPartnerItems: PartnerItem[] = [
    { id: 1, name: "SaaSy Solutions", tier: "Gold", leads: 45, revenue: 18500, commission: 4625 },
    { id: 2, name: "Growth Gurus", tier: "Gold", leads: 38, revenue: 15200, commission: 3800 },
];

// PR Page Data
export const initialPrMetrics: PrMetric[] = [
    { id: 1, metric: 'Media Mentions', value: '28', change: 'Last 30 days' },
    { id: 2, metric: 'Share of Voice', value: '18%', change: '+2% vs last month' },
];
export const initialMediaMentionItems: MediaMentionItem[] = [
    { id: 1, publication: "TechCrunch", title: "Moebius secures $10M in Series A funding to revolutionize business analytics.", date: "2024-07-18", url: "#" },
    { id: 2, publication: "Forbes", title: "The Founder of Moebius on Building a Data-Driven Culture.", date: "2024-07-15", url: "#" },
];

// Branding Page Data
export const initialBrandingMetrics: BrandingMetric[] = [
    { id: 1, metric: 'Social Media Reach', value: '4.2M', change: '+18% MoM' },
    { id: 2, metric: 'Social Engagement', value: '12.3k', change: '+5% MoM' },
];
export const initialBrandMentionData: BrandMentionData[] = [
    { name: 'Jan', Twitter: 400, LinkedIn: 240, News: 100 },
    { name: 'Feb', Twitter: 300, LinkedIn: 139, News: 80 },
    { name: 'Mar', Twitter: 500, LinkedIn: 480, News: 120 },
];

// Competition Page Data
export const initialCompetitors: Competitor[] = [
    { id: 1, name: "Competitor A", funding: "$50M", employees: "250", founded: 2018, logoUrl: "https://tailwindui.com/img/logos/48x48/transistor.svg" },
    { id: 2, name: "Competitor B", funding: "$25M", employees: "150", founded: 2019, logoUrl: "https://tailwindui.com/img/logos/48x48/reform.svg" },
];
export const initialFeatureComparison: FeatureComparison[] = [
    { feature: "AI-Powered Insights", "Moebius": true, "Competitor A": true, "Competitor B": false, "Competitor C": true },
    { feature: "Real-time Dashboards", "Moebius": true, "Competitor A": true, "Competitor B": true, "Competitor C": true },
];

// Conversations Data
export const initialConversationUsers: ConversationUser[] = [
    { id: 1, name: 'John Doe', status: 'online' },
    { id: 2, name: 'Alice Johnson', status: 'online' },
];

export const initialConversationChannels: ConversationChannel[] = [
    { id: '1', name: 'general', type: 'public', unreadCount: 2, lastMessage: 'Just a reminder about the all-hands meeting tomorrow!', lastMessageTimestamp: '2:45 PM' },
    { id: 'eng-channel', name: 'team-engineering', type: 'private', unreadCount: 1, lastMessage: 'Staging is ready for testing.', lastMessageTimestamp: '1:10 PM' },
    { id: 'dm-alice', name: 'Alice Johnson', type: 'dm', unreadCount: 1, members: [2], lastMessage: 'Hey! Do you have a moment to review my PR?', lastMessageTimestamp: '2:50 PM' },
];

export const initialConversationMessages: Record<string, ConversationMessage[]> = {
    '1': [
        { id: 'm1-1', text: 'Hey team, what\'s the status on the Q3 report?', userId: 1, userName: 'John Doe', timestamp: '2:30 PM' },
        { id: 'm1-2', text: 'Almost done! Just waiting for the final numbers from sales.', userId: 3, userName: 'Bob Smith', timestamp: '2:31 PM' },
    ],
    'dm-alice': [
        { id: 'dm1-1', text: 'Hey! Do you have a moment to review my PR?', userId: 2, userName: 'Alice Johnson', timestamp: '2:50 PM' },
    ],
};

// DATA SOURCE DEFINITIONS
const revenueColumns: ColumnDef<RevenueStream>[] = [
    { accessorKey: 'stream', header: 'Revenue Stream', cellType: 'text' },
    { accessorKey: 'mrr', header: 'Monthly Revenue (€)', cellType: 'currency' },
];
const expensesColumns: ColumnDef<ExpenseItem>[] = [
    { accessorKey: 'category', header: 'Expense Category', cellType: 'text' },
    { accessorKey: 'cost', header: 'Monthly Cost (€)', cellType: 'currency' },
];
const hiringColumns: ColumnDef<HiringPipelineItem>[] = [
    { accessorKey: 'role', header: 'Role', cellType: 'text' },
    { accessorKey: 'department', header: 'Department', cellType: 'text' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Interviewing': 'violet', 'Sourcing': 'blue', 'Offer Extended': 'emerald' } },
    { accessorKey: 'candidates', header: 'Candidates', cellType: 'number' },
];
const crmColumns: ColumnDef<CrmDataItem>[] = [
    { accessorKey: 'name', header: 'Contact Name', cellType: 'text' },
    { accessorKey: 'company', header: 'Company', cellType: 'text' },
    { accessorKey: 'value', header: 'Deal Value (€)', cellType: 'currency' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Proposal': 'violet', 'Negotiation': 'blue', 'Contacted': 'default', 'Lead': 'default', 'Closed - Won': 'emerald', 'Closed - Lost': 'red'} },
];
const requestsColumns: ColumnDef<RequestDataItem>[] = [
    { accessorKey: 'title', header: 'Feature Request', cellType: 'text' },
    { accessorKey: 'user', header: 'Requested By', cellType: 'text' },
    { accessorKey: 'votes', header: 'Votes', cellType: 'number' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Shipped': 'emerald', 'In Progress': 'blue', 'Planned': 'violet', 'Under Review': 'default'} },
];
const ordersColumns: ColumnDef<OrderItem>[] = [
    { accessorKey: 'customer', header: 'Customer', cellType: 'text' },
    { accessorKey: 'date', header: 'Date', cellType: 'text' },
    { accessorKey: 'total', header: 'Total (€)', cellType: 'currency' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'New': 'blue', 'Processing': 'violet', 'Shipped': 'default', 'Delivered': 'emerald' } },
];
const productsColumns: ColumnDef<ProductItem>[] = [
    { accessorKey: 'name', header: 'Product Name', cellType: 'text' },
    { accessorKey: 'sku', header: 'SKU', cellType: 'text' },
    { accessorKey: 'price', header: 'Price (€)', cellType: 'currency' },
    { accessorKey: 'stock', header: 'Stock', cellType: 'number' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'In Stock': 'emerald', 'Low Stock': 'violet', 'Out of Stock': 'red' } },
];
const promotionsColumns: ColumnDef<PromotionItem>[] = [
    { accessorKey: 'code', header: 'Code', cellType: 'text' },
    { accessorKey: 'type', header: 'Type', cellType: 'badge', badgeOptions: { 'Percentage': 'blue', 'Fixed Amount': 'violet' } },
    { accessorKey: 'value', header: 'Value', cellType: 'number' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Active': 'emerald', 'Expired': 'default' } },
];
const campaignColumns: ColumnDef<Campaign>[] = [
    { accessorKey: 'name', header: 'Campaign', cellType: 'text' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Active': 'emerald', 'Paused': 'violet', 'Completed': 'default' } },
    { accessorKey: 'roas', header: 'ROAS', cellType: 'text' },
];

const generateSalesData = () => {
    const data = [];
    const today = new Date();
    const daysInPast = 24 * 30; // Approx 24 months

    for (let i = daysInPast - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        // Simulate weekly cycle (lower sales on weekends)
        const dayOfWeek = date.getDay();
        const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.1;

        // Simulate yearly seasonality (e.g., higher sales in Q4)
        const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 86400000;
        const seasonalMultiplier = 1 + (Math.sin((dayOfYear / 365.25) * 2 * Math.PI - Math.PI / 2) * 0.25); // Varies by +/- 25%

        // Base sales with a slight upward trend + random fluctuation
        const baseSales = 150 + (daysInPast - i) * 0.1;
        const randomFluctuation = Math.random() * 60 - 30;

        const sales = (baseSales * weekendMultiplier * seasonalMultiplier) + randomFluctuation;
        
        data.push({
            date: date.toISOString().split('T')[0], // 'YYYY-MM-DD'
            Sales: Math.max(0, Math.round(sales * 10)), // Ensure sales are not negative
        });
    }
    return data;
};

export const salesTrendData = generateSalesData();

const topProductsBySales = initialProducts.sort((a,b) => b.price * (50 - b.stock) - a.price * (50-a.stock)).slice(0,5).map(p => ({id: p.id, name: p.name, value: `${p.stock} units left`}));
const topReferringSources = [
    { id: 1, name: 'google.com', value: '3,281 visitors' }, { id: 2, name: 'instagram.com', value: '2,150 visitors' },
    { id: 3, name: 'facebook.com', value: '1,567 visitors' }, { id: 4, name: 'organic', value: '1,204 visitors' },
];
const salesFunnelData = [
    { title: "Visitors", value: 125340, conversion: 11.2, color: "border-violet-500" },
    { title: "Leads", value: 14038, conversion: 24.6, color: "border-violet-600" },
    { title: "Qualified Leads", value: 3450, conversion: 12.8, color: "border-emerald-500" },
    { title: "Customers", value: 442, color: "border-emerald-600" },
];
const trafficSourcesData = [
    { name: 'Organic Search', value: 4200 }, { name: 'Social Media', value: 2800 },
    { name: 'Paid Ads', value: 1500 }, { name: 'Referral', value: 1200 }, { name: 'Direct', value: 800 },
];
const lowStockProducts = initialProducts.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').map(p => ({...p, value: `${p.stock} units`}));

export const ALL_DATA_SOURCES: Record<DataSourceKey, { data: any[], schema?: ColumnDef<any>[], section: string, name: string, compatibleWidgets: GenericWidgetType[] }> = {
    'revenue_streams': { data: initialRevenueStreams, schema: revenueColumns, section: 'Financial', name: 'Revenue Streams', compatibleWidgets: ['TABLE_VIEW'] },
    'expenses': { data: initialExpenses, schema: expensesColumns, section: 'Financial', name: 'Expenses', compatibleWidgets: ['TABLE_VIEW'] },
    'orders': { data: initialOrders, schema: ordersColumns, section: 'Sales', name: 'Orders', compatibleWidgets: ['TABLE_VIEW'] },
    'products': { data: initialProducts, schema: productsColumns, section: 'Sales', name: 'Products', compatibleWidgets: ['TABLE_VIEW'] },
    'promotions': { data: initialPromotions, schema: promotionsColumns, section: 'Sales', name: 'Promotions', compatibleWidgets: ['TABLE_VIEW'] },
    'crm_deals': { data: initialCrmData, schema: crmColumns, section: 'Customer', name: 'CRM Deals', compatibleWidgets: ['TABLE_VIEW'] },
    'feature_requests': { data: initialRequestData, schema: requestsColumns, section: 'Customer', name: 'Feature Requests', compatibleWidgets: ['TABLE_VIEW'] },
    'hiring_pipeline': { data: initialHiringPipeline, schema: hiringColumns, section: 'Internal', name: 'Hiring Pipeline', compatibleWidgets: ['TABLE_VIEW'] },
    'campaign_performance': { data: initialCampaigns, schema: campaignColumns, section: 'External', name: 'Campaign Performance', compatibleWidgets: ['TABLE_VIEW'] },
    'sales_trend_data': { data: salesTrendData, section: 'Sales', name: 'Sales Trend', compatibleWidgets: ['TREND_GRAPHIC'] },
    'top_products_by_sales': { data: topProductsBySales, section: 'Sales', name: 'Top Products by Sales', compatibleWidgets: ['LIST_VIEW'] },
    'low_stock_products': { data: lowStockProducts, section: 'Sales', name: 'Low Stock Products', compatibleWidgets: ['LIST_VIEW'] },
    'top_referring_sources': { data: topReferringSources, section: 'External', name: 'Top Referring Sources', compatibleWidgets: ['LIST_VIEW'] },
    'sales_funnel_data': { data: salesFunnelData, section: 'Sales', name: 'Sales Funnel', compatibleWidgets: ['FUNNEL_GRAPHIC'] },
    'traffic_sources_data': { data: trafficSourcesData, section: 'External', name: 'Traffic Sources', compatibleWidgets: ['PIE_CHART'] },
    'activity_feed_home': { data: initialActivityFeed, section: 'Home', name: 'Home Activity Feed', compatibleWidgets: ['ACTIVITY_FEED'] },
    'activity_feed_external': { data: initialExternalActivityFeed, section: 'External', name: 'External Activity Feed', compatibleWidgets: ['ACTIVITY_FEED'] },
};

export const getAllKpis = (): SelectableKpi[] => [
    ...initialKpiMetrics.map(k => ({ ...k, source: 'Home' })),
    ...initialCustomerMetrics.map(k => ({ ...k, source: 'Customer' })),
    ...initialOperationalMetrics.map(k => ({ ...k, source: 'Operational' })),
    ...initialProductMetrics.map(k => ({ ...k, source: 'Product Analytics' })),
    ...initialMarketingMetrics.map(k => ({ ...k, source: 'Marketing' })),
    ...initialCapTableMetrics.map(k => ({ ...k, source: 'Cap Table' })),
    ...initialCoordinationMetrics.map(k => ({ ...k, source: 'Coordination' })),
    ...initialEcommerceMetrics.map(k => ({ ...k, source: 'E-commerce' })),
    ...initialContentMetrics.map(k => ({...k, source: 'Content'})),
    ...initialSeoMetrics.map(k => ({...k, source: 'SEO'})),
    ...initialPartnerMetrics.map(k => ({...k, source: 'Partners'})),
    ...initialPrMetrics.map(k => ({...k, source: 'PR'})),
    ...initialBrandingMetrics.map(k => ({...k, source: 'Branding'})),
];

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
} from './types';
import { FileTextIcon, MegaphoneIcon, MessageSquareIcon, SearchIcon, TrendingUpIcon, UsersIcon } from './components/Icons';


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
];
export const initialMarketingMetrics: MarketingMetric[] = [
    { id: 1, metric: 'Leads', value: '3,450', change: '+15% this month' },
    { id: 2, metric: 'Conversion Rate', value: '4.2%', change: '-0.2% this month' },
    { id: 3, metric: 'Customer Acquisition Cost (CAC)', value: '€120', change: '+€5 from last month' },
    { id: 4, metric: 'Website Traffic', value: '125,340', change: '+8.2% this month' },
    { id: 5, metric: 'Return on Ad Spend (ROAS)', value: '4.5:1', change: 'Exceeds target' },
    { id: 6, metric: 'Click-Through Rate (CTR)', value: '2.8%', change: 'Avg. across all campaigns' },
    { id: 7, metric: 'Cost Per Click (CPC)', value: '€1.25', change: 'Avg. across all campaigns' },
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
export const initialCoordinationMetrics: CoordinationMetric[] = [
    { id: 1, metric: 'Active Contractors', value: '12', change: '+2 this month' },
    { id: 2, metric: 'Avg. Project Completion Time', value: '28 days', change: '-3 days vs last quarter' },
    { id: 3, metric: 'Services Uptime', value: '99.95%', change: 'Last 30 days' },
    { id: 4, metric: 'Open Service Tickets', value: '5', change: '-1 from yesterday' },
];
export const initialTeams: Team[] = [
    { id: 'eng', name: 'Engineering', channelId: 'eng-channel' },
    { id: 'prod', name: 'Product', channelId: 'prod-channel' },
    { id: 'sales', name: 'Sales', channelId: 'sales-channel' },
];
export const initialTeamMembers: TeamMember[] = [
    { id: 1, name: 'John Doe', role: 'CEO, Founder', status: 'online', avatarUrl: undefined, lastActive: 'Online', timezone: 'PST', activityData: [5, 6, 8, 7, 9, 7, 8], teamIds: ['eng', 'prod', 'sales'] },
    { id: 2, name: 'Alice Johnson', role: 'Lead Engineer', status: 'online', avatarUrl: undefined, lastActive: 'Online', timezone: 'GMT', activityData: [9, 8, 10, 9, 11, 10, 9], teamIds: ['eng'] },
    { id: 3, name: 'Bob Smith', role: 'Product Manager', status: 'away', avatarUrl: undefined, lastActive: '15m ago', timezone: 'EST', activityData: [4, 5, 3, 5, 4, 6, 5], teamIds: ['prod'] },
    { id: 4, name: 'Charlie Brown', role: 'UX/UI Designer', status: 'offline', avatarUrl: undefined, lastActive: '8h ago', timezone: 'PST', activityData: [2, 3, 2, 1, 4, 3, 2], teamIds: ['prod'] },
    { id: 5, name: 'Diana Prince', role: 'Head of Sales', status: 'online', avatarUrl: undefined, lastActive: '3m ago', timezone: 'GMT', activityData: [7, 8, 6, 9, 8, 7, 9], teamIds: ['sales'] },
    { id: 6, name: 'Frank Castle', role: 'Backend Engineer', status: 'offline', avatarUrl: undefined, lastActive: '2h ago', timezone: 'EST', activityData: [8, 9, 7, 8, 6, 7, 8], teamIds: ['eng'] },
];
export const initialTeamActivity: TeamActivity[] = [
    { id: 1, memberId: 2, memberName: 'Alice Johnson', action: 'Deployed version 2.1.0 to production.', timestamp: '15m ago' },
    { id: 2, memberId: 5, memberName: 'Diana Prince', action: 'Closed a $50,000 deal with Future Tech.', timestamp: '1h ago' },
    { id: 3, memberId: 3, memberName: 'Bob Smith', action: 'Updated the Q4 product roadmap.', timestamp: '3h ago' },
    { id: 4, memberId: 2, memberName: 'Alice Johnson', action: 'Resolved 5 critical bugs.', timestamp: '5h ago' },
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
    {
        id: 3,
        icon: TrendingUpIcon,
        iconColor: 'text-violet-400',
        descriptionParts: [{ text: "Summer Sale 2024", strong: true }, { text: " campaign went live." }],
        timestamp: "1 day ago"
    }
];

export const initialCampaigns: Campaign[] = [
    { id: 1, name: 'Summer Sale 2024', channel: 'Google Ads', status: 'Active', budget: 5000, cpa: 85, roas: '5.2:1' },
    { id: 2, name: 'Q3 Lead Generation', channel: 'Facebook', status: 'Active', budget: 7500, cpa: 110, roas: '4.1:1' },
    { id: 3, name: 'B2B Outreach', channel: 'LinkedIn', status: 'Paused', budget: 4000, cpa: 250, roas: 'N/A' },
    { id: 4, name: 'Spring Launch', channel: 'Google Ads', status: 'Completed', budget: 6000, cpa: 95, roas: '6.3:1' },
];

export const initialNotifications: NotificationItem[] = [
    { id: 1, type: 'new_users', title: '5 new users signed up', detail: 'Your user base grew by 0.5% today.', time: '10m ago', unread: true, icon: UsersIcon, iconColor: 'text-violet-400' },
    { id: 2, type: 'report_ready', title: 'Q2 Financial Report is ready', detail: 'The quarterly report has been generated.', time: '1h ago', unread: true, icon: FileTextIcon, iconColor: 'text-emerald-400' },
    { id: 3, type: 'comment', title: 'Alice commented on your post', detail: '"Great insights on the new ARR projection!"', time: '3h ago', unread: false, icon: MessageSquareIcon, iconColor: 'text-blue-400' },
    { id: 4, type: 'new_users', title: '1 new user signed up', detail: 'Welcome your newest customer.', time: 'yesterday', unread: false, icon: UsersIcon, iconColor: 'text-violet-400' },
];

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

// Content Page Data
export const initialContentMetrics: ContentMetric[] = [
    { id: 1, metric: 'Total Content Pieces', value: '128', change: '+12 this quarter' },
    { id: 2, metric: 'Avg. Engagement Rate', value: '4.8%', change: '+0.3% vs last month' },
    { id: 3, metric: 'Content-Sourced Leads', value: '89', change: '+22 this month' },
    { id: 4, metric: 'Avg. Time on Page', value: '2m 45s', change: '+15s vs last month' },
];
export const initialContentItems: ContentItem[] = [
    { id: 1, title: "The Ultimate Guide to SaaS Metrics", type: "Blog Post", date: "2024-07-15", views: 12500, engagement: "8.2%" },
    { id: 2, title: "State of AI in Business Report", type: "Whitepaper", date: "2024-07-01", views: 8200, engagement: "15.3%" },
    { id: 3, title: "How InnovateCorp Increased ROI by 300%", type: "Case Study", date: "2024-06-20", views: 9800, engagement: "11.1%" },
    { id: 4, title: "5 Common Financial Planning Mistakes", type: "Blog Post", date: "2024-06-10", views: 7600, engagement: "6.5%" },
];

// SEO Page Data
export const initialSeoMetrics: SeoMetric[] = [
    { id: 1, metric: 'Organic Traffic', value: '82.1k', change: '+15% MoM' },
    { id: 2, metric: 'Avg. Keyword Position', value: '8.2', change: '-0.5 this month' },
    { id: 3, metric: 'Referring Domains', value: '1,204', change: '+58 new domains' },
    { id: 4, metric: 'Domain Authority', value: '72', change: '+2 from last check' },
];
export const initialKeywordItems: KeywordItem[] = [
    { id: 1, keyword: "saas dashboard", position: 3, change: 1, volume: "12.1k" },
    { id: 2, keyword: "financial simulation tool", position: 5, change: -1, volume: "8.5k" },
    { id: 3, keyword: "arr calculator", position: 2, change: 0, volume: "15.3k" },
    { id: 4, keyword: "business kpi tracking", position: 11, change: 2, volume: "9.8k" },
    { id: 5, keyword: "what is ltv", position: 7, change: -2, volume: "22.5k" },
];
export const initialBacklinkItems: BacklinkItem[] = [
    { id: 1, domain: "techcrunch.com", authority: 94, date: "2024-07-18" },
    { id: 2, domain: "forbes.com", authority: 95, date: "2024-07-15" },
    { id: 3, domain: "saastr.com", authority: 78, date: "2024-07-12" },
    { id: 4, domain: "producthunt.com", authority: 91, date: "2024-07-10" },
];

// Partners Page Data
export const initialPartnerMetrics: PartnerMetric[] = [
    { id: 1, metric: 'Total Active Partners', value: '42', change: '+3 this quarter' },
    { id: 2, metric: 'Partner-Sourced Leads', value: '158', change: 'Current Month' },
    { id: 3, metric: 'Partner-Driven Revenue', value: '€48,200', change: 'Current Month' },
    { id: 4, metric: 'Avg. Lead Conversion', value: '18.5%', change: 'All partners' },
];
export const initialPartnerItems: PartnerItem[] = [
    { id: 1, name: "SaaSy Solutions", tier: "Gold", leads: 45, revenue: 18500, commission: 4625 },
    { id: 2, name: "Growth Gurus", tier: "Gold", leads: 38, revenue: 15200, commission: 3800 },
    { id: 3, name: "The Agency Co.", tier: "Silver", leads: 22, revenue: 8800, commission: 1760 },
    { id: 4, name: "Cloud Catalysts", tier: "Silver", leads: 18, revenue: 7200, commission: 1440 },
    { id: 5, name: "ReferralRockstars", tier: "Bronze", leads: 12, revenue: 4800, commission: 720 },
];

// PR Page Data
export const initialPrMetrics: PrMetric[] = [
    { id: 1, metric: 'Media Mentions', value: '28', change: 'Last 30 days' },
    { id: 2, metric: 'Share of Voice', value: '18%', change: '+2% vs last month' },
    { id: 3, metric: 'Sentiment Score', value: '92%', change: 'Mostly Positive' },
    { id: 4, metric: 'Estimated Reach', value: '1.5M', change: 'Across all mentions' },
];
export const initialMediaMentionItems: MediaMentionItem[] = [
    { id: 1, publication: "TechCrunch", title: "Moebius secures $10M in Series A funding to revolutionize business analytics.", date: "2024-07-18", url: "#" },
    { id: 2, publication: "Forbes", title: "The Founder of Moebius on Building a Data-Driven Culture.", date: "2024-07-15", url: "#" },
    { id: 3, publication: "SaaS Mag", title: "10 SaaS Companies to Watch in 2024.", date: "2024-07-11", url: "#" },
    { id: 4, publication: "Business Insider", title: "How Moebius is using AI to give businesses a competitive edge.", date: "2024-07-05", url: "#" },
];

// Branding Page Data
export const initialBrandingMetrics: BrandingMetric[] = [
    { id: 1, metric: 'Social Media Reach', value: '4.2M', change: '+18% MoM' },
    { id: 2, metric: 'Social Engagement', value: '12.3k', change: '+5% MoM' },
    { id: 3, metric: 'Branded Search Volume', value: '22.1k', change: '+12% MoM' },
    { id: 4, metric: 'Brand Mentions', value: '1,800', change: '+250 this month' },
];
export const initialBrandMentionData: BrandMentionData[] = [
    { name: 'Jan', Twitter: 400, LinkedIn: 240, News: 100 },
    { name: 'Feb', Twitter: 300, LinkedIn: 139, News: 80 },
    { name: 'Mar', Twitter: 500, LinkedIn: 480, News: 120 },
    { name: 'Apr', Twitter: 478, LinkedIn: 390, News: 110 },
    { name: 'May', Twitter: 589, LinkedIn: 480, News: 150 },
    { name: 'Jun', Twitter: 439, LinkedIn: 380, News: 130 },
    { name: 'Jul', Twitter: 549, LinkedIn: 430, News: 180 },
];

// Competition Page Data
export const initialCompetitors: Competitor[] = [
    { id: 1, name: "Competitor A", funding: "$50M", employees: "250", founded: 2018, logoUrl: "https://tailwindui.com/img/logos/48x48/transistor.svg" },
    { id: 2, name: "Competitor B", funding: "$25M", employees: "150", founded: 2019, logoUrl: "https://tailwindui.com/img/logos/48x48/reform.svg" },
    { id: 3, name: "Competitor C", funding: "$80M", employees: "400", founded: 2017, logoUrl: "https://tailwindui.com/img/logos/48x48/tuple.svg" },
];
export const initialFeatureComparison: FeatureComparison[] = [
    { feature: "AI-Powered Insights", "Moebius": true, "Competitor A": true, "Competitor B": false, "Competitor C": true },
    { feature: "Real-time Dashboards", "Moebius": true, "Competitor A": true, "Competitor B": true, "Competitor C": true },
    { feature: "Financial Simulations", "Moebius": true, "Competitor A": false, "Competitor B": false, "Competitor C": true },
    { feature: "CRM Integration", "Moebius": true, "Competitor A": true, "Competitor B": true, "Competitor C": false },
    { feature: "Mobile App", "Moebius": true, "Competitor A": false, "Competitor B": true, "Competitor C": false },
    { feature: "API Access", "Moebius": true, "Competitor A": true, "Competitor B": true, "Competitor C": true },
];

// Conversations Data
export const initialConversationUsers: ConversationUser[] = [
    { id: 1, name: 'John Doe', status: 'online' },
    { id: 2, name: 'Alice Johnson', status: 'online' },
    { id: 3, name: 'Bob Smith', status: 'away' },
    { id: 4, name: 'Charlie Brown', status: 'offline' },
    { id: 5, name: 'Diana Prince', status: 'online' },
    { id: 6, name: 'Frank Castle', status: 'offline' },
];

export const initialConversationChannels: ConversationChannel[] = [
    { id: '1', name: 'general', type: 'public', unreadCount: 2, lastMessage: 'Just a reminder about the all-hands meeting tomorrow!', lastMessageTimestamp: '2:45 PM' },
    { id: 'eng-channel', name: 'team-engineering', type: 'private', unreadCount: 1, lastMessage: 'Staging is ready for testing.', lastMessageTimestamp: '1:10 PM' },
    { id: 'prod-channel', name: 'team-product', type: 'private', unreadCount: 5, lastMessage: 'I\'ve uploaded the new mockups to Figma.', lastMessageTimestamp: '3:02 PM' },
    { id: 'sales-channel', name: 'team-sales', type: 'private', unreadCount: 0, lastMessage: 'Q3 targets have been updated.', lastMessageTimestamp: '10:00 AM' },
    { id: '4', name: 'q4-planning', type: 'private', unreadCount: 0, lastMessage: 'Let\'s sync up on the final numbers.', lastMessageTimestamp: '11:20 AM' },
    { id: 'dm-john', name: 'John Doe', type: 'dm', unreadCount: 0, members: [1], lastMessage: 'Can we sync up later?', lastMessageTimestamp: 'Yesterday' },
    { id: 'dm-alice', name: 'Alice Johnson', type: 'dm', unreadCount: 1, members: [2], lastMessage: 'Hey! Do you have a moment to review my PR?', lastMessageTimestamp: '2:50 PM' },
    { id: 'dm-bob', name: 'Bob Smith', type: 'dm', unreadCount: 0, members: [3], lastMessage: 'Sounds good, thanks!', lastMessageTimestamp: 'Yesterday' },
    { id: 'dm-charlie', name: 'Charlie Brown', type: 'dm', unreadCount: 0, members: [4], lastMessage: 'Figma link sent.', lastMessageTimestamp: 'Monday' },
    { id: 'dm-diana', name: 'Diana Prince', type: 'dm', unreadCount: 2, members: [5], lastMessage: 'Just closed the deal!', lastMessageTimestamp: '1:30 PM' },
    { id: 'dm-frank', name: 'Frank Castle', type: 'dm', unreadCount: 0, members: [6], lastMessage: 'DB migration is complete.', lastMessageTimestamp: '9:00 AM' },
];

export const initialConversationMessages: Record<string, ConversationMessage[]> = {
    '1': [
        { id: 'm1-1', text: 'Hey team, what\'s the status on the Q3 report?', userId: 1, userName: 'John Doe', timestamp: '2:30 PM' },
        { id: 'm1-2', text: 'Almost done! Just waiting for the final numbers from sales.', userId: 3, userName: 'Bob Smith', timestamp: '2:31 PM' },
        { id: 'm1-3', text: 'I\'ve pushed the latest deployment fixes, so the staging environment is ready for testing.', userId: 2, userName: 'Alice Johnson', timestamp: '2:40 PM' },
        { id: 'm1-4', text: 'Great, thanks Alice! Diana, any update on those numbers?', userId: 1, userName: 'John Doe', timestamp: '2:41 PM' },
        { id: 'm1-5', text: 'Just sent them over to Bob. Should be all set.', userId: 5, userName: 'Diana Prince', timestamp: '2:44 PM' },
        { id: 'm1-6', text: 'Just a reminder about the all-hands meeting tomorrow!', userId: 1, userName: 'John Doe', timestamp: '2:45 PM' },
    ],
    '3': [
        { id: 'm3-1', text: 'I\'ve uploaded the new mockups to Figma.', userId: 4, userName: 'Charlie Brown', timestamp: '3:02 PM' },
        { id: 'm3-2', text: 'They look amazing! 🔥', userId: 2, userName: 'Alice Johnson', timestamp: '3:05 PM' },
    ],
    'dm-alice': [
        { id: 'dm1-1', text: 'Hey! Do you have a moment to review my PR?', userId: 2, userName: 'Alice Johnson', timestamp: '2:50 PM' },
    ],
    'dm-diana': [
        { id: 'dm2-1', text: 'The contract is signed!', userId: 5, userName: 'Diana Prince', timestamp: '1:29 PM' },
        { id: 'dm2-2', text: 'Just closed the deal!', userId: 5, userName: 'Diana Prince', timestamp: '1:30 PM' },
    ],
    'dm-john': [],
    'dm-bob': [],
    'dm-charlie': [],
    'dm-frank': [],
};
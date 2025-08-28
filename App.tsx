
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Layout from './Layout';
// Fix: Removed non-existent import 'HomeDashboard'. 'PlatformHome' will be used instead.
import SimulationDashboard from './SimulationDashboard';
import InternalDashboard from './InternalDashboard';
import OperationalDashboard from './OperationalDashboard';
import CoordinationDashboard from './CoordinationDashboard';
import FinancialSimulations from './FinancialSimulations';
import FinancialPlanning from './FinancialPlanning';
import Marketing from './Marketing';
import Operational from './Operational';
import Internal from './Internal';
import CustomerDashboard from './CustomerDashboard';
import CustomerCRM from './CustomerCRM';
import CustomerRequests from './CustomerRequests';
import CustomerFeedback from './CustomerFeedback';
import PNLStatement from './PNLStatement';
import BalanceSheet from './BalanceSheet';
import ProductAnalytics from './ProductAnalytics';
import CapTable from './CapTable';
import Revenue from './Revenue';
import Expenses from './Expenses';
import SystemStatus from './SystemStatus';
import CostAnalysis from './CostAnalysis';
import DataSources from './DataSources';
import SalesDashboard from './EcommerceDashboard';
import OrderFulfillment from './OrderFulfillment';
import InventoryManagement from './InventoryManagement';
import Promotions from './Promotions';
import Chat from './Chat';
import Conversations from './Conversations';
import TeamManagement from './TeamManagement';
import Profile from './Profile';
import Notifications from './Notifications';
import type { Page, ChatSession, Message, Bookmark, ConversationMessage, ConversationChannel, DmToastState, TimeConfig, WidgetContext, WidgetInstance, ContentSection } from './types';
import { GoogleGenAI, Chat as GeminiChat } from '@google/genai';
import PlaceholderPage from './PlaceholderPage';
import { PerpetualDiscussionToast } from './components/PerpetualDiscussionToast';
import { Command, CommandPalette } from './components/CommandPalette';
import { allNavItems } from './navigation';
// FIX: Import XIcon to resolve 'Cannot find name' errors.
import { DatabaseIcon, MessageSquareIcon, SparklesIcon, ChevronUpIcon, LineChartIcon, TrendingUpIcon, ClockIcon, LightningBoltIcon, XIcon } from './components/Icons';
import Content from './Content';
import Seo from './Seo';
import Partners from './Partners';
import PublicRelations from './PublicRelations';
import Branding from './Branding';
import Competition from './Competition';
import ExternalDashboard from './ExternalDashboard';
import { initialConversationChannels, initialConversationMessages, initialConversationUsers, initialKpiMetrics, initialRevenueStreams, initialExpenses, initialEcommerceMetrics, initialCustomerMetrics, initialHiringPipeline, initialMarketingMetrics, initialOperationalMetrics, initialCrmData, initialFeedbackData, initialRequestData } from './data';
import { PersonChatToast } from './components/PersonChatToast';
import { AiChatPanel } from './components/AiChatPanel';
import { fmtEuro, formatWidgetDataForAI } from './utils';
import { DEFAULTS as simulationDefaults } from './constants';
import PlatformHome from './PlatformHome';
import GenerationMetric from './GenerationMetric';
import { ActionCenterPlaceholder } from './ActionCenterPlaceholder';


// Helper hook to get the previous value of a state or prop
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default function App() {
  const [page, setPage] = useState<Page>('platform-home');
  const [activeContentSection, setActiveContentSection] = useState<ContentSection>('platform');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState<string>('eng');
  const [viewedProfileId, setViewedProfileId] = useState<number | null>(null);
  const [isKpiSentimentColoringEnabled, setIsKpiSentimentColoringEnabled] = useState(true);
  const [aiChatInterfaceStyle, setAiChatInterfaceStyle] = useState<'panel' | 'toast'>('panel');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [rightPanelWidth, setRightPanelWidth] = useState(() => {
    const minWidth = window.innerWidth * 0.28;
    const maxWidth = window.innerWidth * 0.50;
    const defaultWidth = window.innerWidth * 0.28;
    return Math.max(minWidth, Math.min(maxWidth, defaultWidth));
  });
  const [isResizing, setIsResizing] = useState(false);
  const [attachedWidgetContexts, setAttachedWidgetContexts] = useState<WidgetContext[]>([]);


  // AI Chat state
  const [aiChatSessions, setAiChatSessions] = useState<ChatSession[]>([]);
  const [activeAiChatId, setActiveAiChatId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [queuedAiMessage, setQueuedAiMessage] = useState<{ displayText: string, promptText: string } | null>(null);
  const [isAiChatToastOpen, setIsAiChatToastOpen] = useState(false);
  const [isAiChatToastMinimized, setIsAiChatToastMinimized] = useState(false);

  // Person-to-person DM Chat state
  const [conversationChannels, setConversationChannels] = useState(initialConversationChannels);
  const [conversationMessages, setConversationMessages] = useState(initialConversationMessages);
  const [openDmToasts, setOpenDmToasts] = useState<DmToastState[]>([]);
  const [activeConversationChannelId, setActiveConversationChannelId] = useState<string>('1');
  const [globalTimeConfig, setGlobalTimeConfig] = useState<TimeConfig>({
    type: 'preset',
    preset: '1y',
    granularity: 'monthly',
    offset: 0,
  });

  const prevPage = usePrevious(page);

  const handleRightPanelResize = (newWidth: number) => {
    const minWidth = window.innerWidth * 0.28;
    const maxWidth = window.innerWidth * 0.50;
    setRightPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
  };
  
  useEffect(() => {
    // When navigating away from the full-screen chat to a non-chat page,
    // open the toast in a minimized state if using the toast interface.
    if (prevPage === 'chat' && page !== 'chat' && activeAiChatId && aiChatInterfaceStyle === 'toast') {
      setIsAiChatToastOpen(true);
      setIsAiChatToastMinimized(true);
    }

    // When navigating TO a full-screen page, ensure toasts and panels are closed.
    if (page === 'chat' || page === 'conversations') {
        setIsAiChatToastOpen(false);
        setOpenDmToasts([]);
        setIsRightPanelOpen(false);
    }
    
    // When navigating away from the profile page, reset the viewed profile ID
    if (prevPage === 'profile' && page !== 'profile') {
        setViewedProfileId(null);
    }

    // Redirects for menu-only parent pages
    if (page === 'monitoring-action-center' || page === 'monitoring-generation') {
        setPage('monitoring-generation-metric');
    }
    if (page === 'monitoring-entities') {
        setPage('monitoring-entities-overview');
    }
  }, [page, prevPage, activeAiChatId, aiChatInterfaceStyle]);
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsCommandPaletteOpen(open => !open);
        }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);


  const generateChatTitle = async (sessionId: string, firstMessage: string) => {
    try {
      setAiChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isGeneratingTitle: true } : s));
      const prompt = `Summarize the following user query into a concise title of no more than 6 words: "${firstMessage}"`;
      // FIX: The `generateContent` call was missing the `contents` property. The prompt has been correctly assigned to it.
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });
      const newTitle = response.text.trim().replace(/"/g, '');
      setAiChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle, isGeneratingTitle: false } : s));
    } catch (error) {
      console.error("Error generating title:", error);
      setAiChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isGeneratingTitle: false } : s)); // Reset loading state on error
    }
  };

  const handleNewChat = useCallback(() => {
    const newChatSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ id: 1, text: "Hello! How can I assist with your business data today?", sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
      geminiChat: ai.chats.create({ model: 'gemini-2.5-flash' }),
    };
    setAiChatSessions(prev => [newChatSession, ...prev]);
    setActiveAiChatId(newChatSession.id);
    setPage('chat');
  }, []);
  
  const handleNewChatInPanel = useCallback(() => {
    const newChatSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ id: 1, text: "Hello! How can I assist with your business data today?", sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
      geminiChat: ai.chats.create({ model: 'gemini-2.5-flash' }),
    };
    setAiChatSessions(prev => [newChatSession, ...prev]);
    setActiveAiChatId(newChatSession.id);
  }, []);

  const handleDeleteChat = (sessionId: string) => {
    setAiChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeAiChatId === sessionId) {
      setActiveAiChatId(null);
      setPage('dashboard');
    }
  };

  const handleReloadChat = (sessionId: string) => {
    if (!sessionId) return;
    setAiChatSessions(prev =>
        prev.map(s => {
            if (s.id === sessionId) {
                // Return a new session object with initial messages and a new gemini chat instance.
                return {
                    ...s,
                    messages: [{ id: 1, text: "Hello! How can I assist with your business data today?", sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
                    geminiChat: ai.chats.create({ model: 'gemini-2.5-flash' }),
                };
            }
            return s;
        })
    );
  };
  
  const handleClearChat = (sessionId: string) => {
    if (!sessionId) return;
    handleReloadChat(sessionId);
  };

  const handleRegenerateLast = () => {
      if (!activeAiChatId) return;
      const session = aiChatSessions.find(s => s.id === activeAiChatId);
      if (!session) return;
      const lastAiMessage = [...session.messages].reverse().find(m => m.sender === 'ai');
      if (lastAiMessage) {
          handleRegenerate(lastAiMessage.id);
      }
  };

  const handleBookmarkLast = () => {
      if (!activeAiChatId) return;
      const session = aiChatSessions.find(s => s.id === activeAiChatId);
      if (!session) return;
      const lastAiMessage = [...session.messages].reverse().find(m => m.sender === 'ai');
      if (lastAiMessage) {
          handleToggleBookmark(lastAiMessage);
      }
  };


  const handleSendAiMessage = async (payload: { displayText: string, promptText: string }) => {
    if (isAiLoading) {
        setQueuedAiMessage(payload);
        return;
    }

    let sessionId = activeAiChatId;
    let session = aiChatSessions.find(s => s.id === sessionId);
    let chatInstance: GeminiChat | undefined;
    let isFirstUserMessageInSession = false;

    // If no active session, create one
    if (!session) {
        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            geminiChat: ai.chats.create({ model: 'gemini-2.5-flash' }),
        };
        
        setAiChatSessions(prev => [newSession, ...prev]);
        setActiveAiChatId(newSession.id);
        
        sessionId = newSession.id;
        session = newSession;
        chatInstance = newSession.geminiChat;
        isFirstUserMessageInSession = true;

        // Also open the chat UI if it's not open
        if (aiChatInterfaceStyle === 'toast' && !isAiChatToastOpen) {
            setIsAiChatToastOpen(true);
            setIsAiChatToastMinimized(false);
        } else if (aiChatInterfaceStyle === 'panel' && !isRightPanelOpen) {
            setIsRightPanelOpen(true);
        }
    } else {
        chatInstance = session.geminiChat;
        isFirstUserMessageInSession = session.messages.filter(m => m.sender === 'user').length === 0;
    }

    if (!sessionId || !session || !chatInstance) {
        console.error("handleSendAiMessage: Failed to find or create a valid chat session.");
        setIsAiLoading(false);
        return;
    }
    
    setIsAiLoading(true);

    const userMessage: Message = {
        id: Date.now(),
        text: payload.displayText,
        promptText: payload.promptText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const aiMessageId = Date.now() + 1;
    const aiMessagePlaceholder: Message = { id: aiMessageId, text: '', sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };

    setAiChatSessions(prevSessions =>
      prevSessions.map(s => {
        if (s.id === sessionId) {
          return { ...s, messages: [...s.messages, userMessage, aiMessagePlaceholder] };
        }
        return s;
      })
    );

    if (isFirstUserMessageInSession) {
        generateChatTitle(sessionId, payload.displayText);
    }
    
    try {
        const stream = await chatInstance.sendMessageStream({ message: payload.promptText });

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setAiChatSessions(prev =>
                prev.map(s => {
                    if (s.id === sessionId) {
                        const newMessages = s.messages.map(m =>
                            m.id === aiMessageId ? { ...m, text: m.text + chunkText } : m
                        );
                        return { ...s, messages: newMessages };
                    }
                    return s;
                })
            );
        }
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        setAiChatSessions(prev =>
            prev.map(s => {
                if (s.id === sessionId) {
                    const newMessages = s.messages.map(m =>
                        m.id === aiMessageId ? { ...m, text: "Sorry, I encountered an error. Please try again." } : m
                    );
                    return { ...s, messages: newMessages };
                }
                return s;
            })
        );
    } finally {
        setIsAiLoading(false);
        setQueuedAiMessage(currentQueuedMessage => {
            if (currentQueuedMessage) {
                setTimeout(() => handleSendAiMessage(currentQueuedMessage), 0);
                return null;
            }
            return null;
        });
    }
  };
  
  const handleRegenerate = async (messageId: number) => {
    if (!activeAiChatId) return;
    
    const session = aiChatSessions.find(s => s.id === activeAiChatId);
    if (!session || !session.geminiChat) return;
    
    // Find the last user message before the AI message that needs regenerating
    const messageIndex = session.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    let lastUserMessage: Message | undefined;
    for (let i = messageIndex - 1; i >= 0; i--) {
        if (session.messages[i].sender === 'user') {
            lastUserMessage = session.messages[i];
            break;
        }
    }

    if (!lastUserMessage) return;

    const messagesToResend = session.messages.slice(0, messageIndex);

    setAiChatSessions(prev =>
        prev.map(s => s.id === activeAiChatId ? { ...s, messages: messagesToResend } : s)
    );

    const payload = {
        displayText: lastUserMessage.text,
        promptText: lastUserMessage.promptText || lastUserMessage.text,
    };

    setTimeout(() => handleSendAiMessage(payload), 0);
  };

    const attachContext = (context: WidgetContext) => {
        if (attachedWidgetContexts.some(ctx => ctx.id === context.id)) return;

        setAttachedWidgetContexts(prev => [...prev, context]);

        if (aiChatInterfaceStyle === 'panel' && !isRightPanelOpen) {
            setIsRightPanelOpen(true);
        } else if (aiChatInterfaceStyle === 'toast' && !isAiChatToastOpen) {
            setIsAiChatToastOpen(true);
            setIsAiChatToastMinimized(false);
        }
    };

    const handleToggleBookmark = (message: Message) => {
        const session = aiChatSessions.find(s => s.messages.some(m => m.id === message.id));
        if (!session) return;

        setBookmarks(prev => {
            const isBookmarked = prev.some(b => b.message.id === message.id);
            if (isBookmarked) {
                return prev.filter(b => b.message.id !== message.id);
            } else {
                return [...prev, { message, sessionId: session.id, sessionTitle: session.title }];
            }
        });
    };
    
    const handleSendDmMessage = (channelId: string, text: string) => {
        const newMessage: ConversationMessage = {
            id: Date.now().toString(),
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            userId: 1, // Current user
            userName: 'John Doe',
        };
        setConversationMessages(prev => ({
            ...prev,
            [channelId]: [...(prev[channelId] || []), newMessage]
        }));
    };
    
    const handleOpenConversationToast = (channelId: string) => {
        setOpenDmToasts(prev => {
            if (prev.some(t => t.channelId === channelId)) {
                return prev.map(t => t.channelId === channelId ? { ...t, isMinimized: false } : t);
            }
            return [...prev, { channelId, isMinimized: false }];
        });
    };
    
    const handleStartDm = (memberId: number) => {
        const existingDm = conversationChannels.find(c => c.type === 'dm' && c.members?.includes(memberId));
        if (existingDm) {
            handleOpenConversationToast(existingDm.id);
        } else {
            const member = initialConversationUsers.find(u => u.id === memberId);
            if (!member) return;

            const newChannel: ConversationChannel = {
                id: `dm-${memberId}`,
                name: member.name,
                type: 'dm',
                unreadCount: 0,
                members: [memberId],
            };
            setConversationChannels(prev => [...prev, newChannel]);
            handleOpenConversationToast(newChannel.id);
        }
    };

    const chatActions = {
        new: handleNewChatInPanel,
        clear: () => activeAiChatId && handleClearChat(activeAiChatId),
        regenerate: handleRegenerateLast,
        bookmark: handleBookmarkLast,
        goto: (page: Page) => setPage(page),
        ui: (style: 'panel' | 'toast') => setAiChatInterfaceStyle(style),
        'kpi-colors': (state: 'on' | 'off') => setIsKpiSentimentColoringEnabled(state === 'on'),
    };

  const renderPage = () => {
    const dashboardProps = {
        globalTimeConfig,
        setGlobalTimeConfig,
        page,
        setPage,
        isKpiSentimentColoringEnabled,
        onAttachContext: attachContext,
    };
    const simpleDashboardProps = { isKpiSentimentColoringEnabled };

    switch (page) {
        case 'platform-home': return <PlatformHome {...dashboardProps} />;
        // Fix: Use PlatformHome for the 'dashboard' page as well.
        case 'dashboard': return <PlatformHome {...dashboardProps} />;
        case 'simulation-dashboard': return <SimulationDashboard {...dashboardProps} />;
        case 'simulation-revenue': return <FinancialSimulations />;
        case 'financial-dashboard': return <FinancialPlanning {...dashboardProps} />;
        case 'financial-revenue': return <Revenue />;
        case 'financial-expenses': return <Expenses />;
        case 'customer-dashboard': return <CustomerDashboard {...simpleDashboardProps} />;
        case 'customer-crm': return <CustomerCRM />;
        case 'customer-requests': return <CustomerRequests />;
        case 'customer-feedback': return <CustomerFeedback {...simpleDashboardProps} />;
        case 'product-analytics': return <ProductAnalytics {...simpleDashboardProps} />;
        case 'marketing': return <Marketing {...dashboardProps} />;
        case 'operational-dashboard': return <OperationalDashboard {...dashboardProps} />;
        case 'operational-efficiency': return <Operational {...simpleDashboardProps} />;
        case 'operational-status': return <SystemStatus />;
        case 'operational-costs': return <CostAnalysis />;
        case 'internal-dashboard': return <InternalDashboard {...dashboardProps} />;
        case 'internal-people': return <Internal {...dashboardProps} />;
        case 'internal-cap-table': return <CapTable {...simpleDashboardProps} />;
        case 'data-sources': return <DataSources />;
        case 'sales-dashboard': return <SalesDashboard {...dashboardProps} />;
        case 'sales-orders': return <OrderFulfillment />;
        case 'sales-inventory': return <InventoryManagement />;
        case 'monitoring-generation-metric': return <GenerationMetric page={page} setPage={setPage} />;
        case 'monitoring-generation-deliverables':
        case 'monitoring-generation-workflows':
        case 'monitoring-generation-surveys':
        case 'monitoring-entities-overview':
        case 'monitoring-entities-manager':
        case 'monitoring-entities-actions':
            return <ActionCenterPlaceholder page={page} setPage={setPage} />;
        case 'chat': return <Chat 
            session={activeAiChatSession}
            isLoading={isAiLoading}
            isMessageQueued={!!queuedAiMessage}
            onSend={handleSendAiMessage}
            onRegenerate={handleRegenerate}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            setActiveChatId={setActiveAiChatId}
            getAppContextData={getAppContextDataForAI}
            attachedWidgetContexts={attachedWidgetContexts}
            onRemoveWidgetContext={(id) => setAttachedWidgetContexts(prev => prev.filter(ctx => ctx.id !== id))}
            onClearWidgetContexts={() => setAttachedWidgetContexts([])}
            actions={chatActions}
        />;
        default: return <PlaceholderPage title={page} description="This page is under construction or does not exist." />;
    }
  };
  
    const activeAiChatSession = useMemo(() => {
        const session = aiChatSessions.find(s => s.id === activeAiChatId);
        if (!session) return undefined;
        return {
            ...session,
            messages: session.messages.map(m => ({
                ...m,
                isBookmarked: bookmarks.some(b => b.message.id === m.id)
            }))
        };
    }, [aiChatSessions, activeAiChatId, bookmarks]);
    
    const getAppContextDataForAI = useCallback((command: string) => {
        // This is a placeholder for a real implementation that would gather context
        // from the entire application state based on the command.
        switch(command) {
            case 'dashboard':
                return 'Current dashboard: "Financial Planning". Key KPIs: Cash Runway (3.5 months), Monthly Burn (€85k).';
            case 'financial.revenue':
                return `Current total MRR is ${fmtEuro(initialRevenueStreams.reduce((sum, item) => sum + item.mrr, 0))}.`;
            default:
                return `Data for command "${command}" is not available in this context.`;
        }
    }, []);

    const commandPaletteCommands = useMemo<Command[]>(() => [
        { id: 'search', icon: SparklesIcon, title: 'Ask AI...', action: () => {
             if (aiChatInterfaceStyle === 'panel') {
                setIsRightPanelOpen(true);
            } else {
                setIsAiChatToastOpen(true);
                setIsAiChatToastMinimized(false);
            }
            // Would need a way to focus the input field inside the panel/toast
        }},
        ...allNavItems.filter(item => !item.subItems).map(item => ({
            id: item.page,
            title: `Go to ${item.label}`,
            icon: item.icon || LineChartIcon,
            action: () => setPage(item.page),
        })),
        { id: 'new-chat', icon: MessageSquareIcon, title: 'New Chat', action: handleNewChat },
        { id: 'get-data', icon: DatabaseIcon, title: 'Get Data for...', action: () => alert('Get Data clicked') },
    ], [handleNewChat, aiChatInterfaceStyle]);
    

  return (
    <>
        <Layout 
            activePage={page} 
            setPage={setPage}
            chatSessions={aiChatSessions}
            activeChatId={activeAiChatId}
            setActiveChatId={(id) => setActiveAiChatId(id)}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onToggleAiChat={() => setIsRightPanelOpen(p => !p)}
            onSearchClick={() => setIsCommandPaletteOpen(true)}
            activeTeamId={activeTeamId}
            setActiveTeamId={setActiveTeamId}
            setViewedProfileId={setViewedProfileId}
            onStartDm={handleStartDm}
            onOpenConversationToast={handleOpenConversationToast}
            isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
            setIsKpiSentimentColoringEnabled={setIsKpiSentimentColoringEnabled}
            aiChatInterfaceStyle={aiChatInterfaceStyle}
            setAiChatInterfaceStyle={setAiChatInterfaceStyle}
            isRightPanelOpen={isRightPanelOpen}
            setIsRightPanelOpen={setIsRightPanelOpen}
            rightPanelWidth={rightPanelWidth}
            isResizing={isResizing}
            activeContentSection={activeContentSection}
            setActiveContentSection={setActiveContentSection}
        >
          {renderPage()}
        </Layout>

        {isRightPanelOpen && aiChatInterfaceStyle === 'panel' && (
            <AiChatPanel 
                session={activeAiChatSession}
                isLoading={isAiLoading}
                isMessageQueued={!!queuedAiMessage}
                onSend={handleSendAiMessage}
                onRegenerate={handleRegenerate}
                onNewChat={handleNewChatInPanel}
                onReload={() => activeAiChatId && handleReloadChat(activeAiChatId)}
                onClose={() => setIsRightPanelOpen(false)}
                onMaximize={() => setPage('chat')}
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
                setActiveChatId={setActiveAiChatId}
                getAppContextData={getAppContextDataForAI}
                width={rightPanelWidth}
                onResize={handleRightPanelResize}
                setIsResizing={setIsResizing}
                attachedWidgetContexts={attachedWidgetContexts}
                onRemoveWidgetContext={(id) => setAttachedWidgetContexts(prev => prev.filter(ctx => ctx.id !== id))}
                onClearWidgetContexts={() => setAttachedWidgetContexts([])}
                actions={chatActions}
            />
        )}
        
        {openDmToasts.map((toast, index) => {
            const channel = conversationChannels.find(c => c.id === toast.channelId);
            if (!channel) return null;

            const toastWidth = 384; // 24rem
            const margin = 16; // 1rem
            const rightPosition = (index * (toastWidth + margin)) + 24; // 1.5rem initial margin

            if(toast.isMinimized) {
                return (
                     <button 
                        key={channel.id}
                        onClick={() => setOpenDmToasts(prev => prev.map(t => t.channelId === channel.id ? {...t, isMinimized: false} : t))}
                        style={{ right: `${rightPosition}px` }}
                        className="fixed bottom-0 z-40 w-72 h-12 bg-zinc-800 border-t border-x border-zinc-700 rounded-t-lg shadow-2xl flex items-center justify-between px-3 text-white font-semibold hover:bg-zinc-700 transition-colors"
                    >
                       <span>{channel.name}</span>
                       <button onClick={(e) => { e.stopPropagation(); setOpenDmToasts(prev => prev.filter(t => t.channelId !== channel.id))}} className="p-1 rounded-full hover:bg-zinc-600"><XIcon className="h-4 w-4"/></button>
                    </button>
                )
            }
            
            return (
                <PersonChatToast
                    key={channel.id}
                    channel={channel}
                    messages={conversationMessages[channel.id] || []}
                    onSend={(text) => handleSendDmMessage(channel.id, text)}
                    onClose={() => setOpenDmToasts(prev => prev.filter(t => t.channelId !== channel.id))}
                    onMaximize={() => {
                        setActiveConversationChannelId(channel.id);
                        setPage('conversations');
                    }}
                    isMinimized={toast.isMinimized}
                    setIsMinimized={(minimized) => setOpenDmToasts(prev => prev.map(t => t.channelId === channel.id ? { ...t, isMinimized: minimized } : t))}
                    style={{ right: `${rightPosition}px` }}
                />
            );
        })}

        {isAiChatToastOpen && !isRightPanelOpen && aiChatInterfaceStyle === 'toast' && activeAiChatSession && (
            isAiChatToastMinimized ? (
                 <button 
                    onClick={() => setIsAiChatToastMinimized(false)}
                    className="fixed bottom-0 right-6 z-40 w-72 h-12 bg-zinc-800 border-t border-x border-zinc-700 rounded-t-lg shadow-2xl flex items-center justify-between px-3 text-white font-semibold hover:bg-zinc-700 transition-colors"
                >
                   <span className="flex items-center gap-2 truncate">
                        <SparklesIcon className="h-5 w-5 text-violet-400 flex-shrink-0" />
                        <span className="truncate">{(activeAiChatSession.title && activeAiChatSession.title !== 'New Chat') ? activeAiChatSession.title : 'Moebius'}</span>
                   </span>
                   <button onClick={(e) => { e.stopPropagation(); setIsAiChatToastOpen(false); }} className="p-1 rounded-full hover:bg-zinc-600"><XIcon className="h-4 w-4"/></button>
                </button>
            ) : (
                <PerpetualDiscussionToast
                    session={activeAiChatSession}
                    isLoading={isAiLoading}
                    isMessageQueued={!!queuedAiMessage}
                    onSend={handleSendAiMessage}
                    onRegenerate={handleRegenerate}
                    onClose={() => setIsAiChatToastOpen(false)}
                    onMaximize={() => setPage('chat')}
                    isMinimized={isAiChatToastMinimized}
                    setIsMinimized={setIsAiChatToastMinimized}
                    bookmarks={bookmarks}
                    onToggleBookmark={handleToggleBookmark}
                    setActiveChatId={setActiveAiChatId}
                    getAppContextData={getAppContextDataForAI}
                    attachedWidgetContexts={attachedWidgetContexts}
                    onRemoveWidgetContext={(id) => setAttachedWidgetContexts(prev => prev.filter(ctx => ctx.id !== id))}
                    onClearWidgetContexts={() => setAttachedWidgetContexts([])}
                    actions={chatActions}
                />
            )
        )}

        <CommandPalette 
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            commands={commandPaletteCommands}
        />
    </>
  );
}

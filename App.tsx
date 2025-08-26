

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Layout from './Layout';
import HomeDashboard from './Dashboard';
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
import { DatabaseIcon, MessageSquareIcon, SparklesIcon, ChevronUpIcon, LineChartIcon, TrendingUpIcon, ClockIcon, LightningBoltIcon } from './components/Icons';
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
    const minWidth = 320; // w-80
    const maxWidth = 800; // custom max width
    const fiftyPercent = window.innerWidth / 2;
    return Math.max(minWidth, Math.min(maxWidth, fiftyPercent));
  });
  const [isResizing, setIsResizing] = useState(false);
  const [attachedWidgetContexts, setAttachedWidgetContexts] = useState<WidgetContext[]>([]);


  // AI Chat state
  const [aiChatSessions, setAiChatSessions] = useState<ChatSession[]>([]);
  const [activeAiChatId, setActiveAiChatId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [queuedAiMessage, setQueuedAiMessage] = useState<string | null>(null);
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
    const minWidth = 320; // w-80
    const maxWidth = 800; // custom max width
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

  const handleSendAiMessage = async (messageText: string) => {
    if (isAiLoading) {
        setQueuedAiMessage(messageText);
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

    const userMessage: Message = { id: Date.now(), text: messageText, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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
        generateChatTitle(sessionId, messageText);
    }
    
    try {
        const stream = await chatInstance.sendMessageStream({ message: messageText });

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

    setTimeout(() => handleSendAiMessage(lastUserMessage!.text), 0);
  };

    const handleCiteWidget = (widgetInstance: WidgetInstance, widgetData: any) => {
        const newContext: WidgetContext = {
            id: widgetInstance.id,
            title: widgetInstance.config.title,
            icon: DatabaseIcon, // Default icon
            data: formatWidgetDataForAI(widgetInstance, widgetData),
        };

        if (attachedWidgetContexts.some(ctx => ctx.id === newContext.id)) return;

        setAttachedWidgetContexts(prev => [...prev, newContext]);

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

  const renderPage = () => {
    const dashboardProps = {
        globalTimeConfig,
        setGlobalTimeConfig,
        page,
        setPage,
        isKpiSentimentColoringEnabled,
        onCiteWidget: handleCiteWidget,
    };
    const simpleDashboardProps = { isKpiSentimentColoringEnabled };

    switch (page) {
        case 'platform-home': return <PlatformHome {...dashboardProps} />;
        case 'dashboard': return <HomeDashboard {...dashboardProps} />;
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
        case 'sales-promotions': return <Promotions />;
        case 'coordination-dashboard': return <CoordinationDashboard {...dashboardProps} />;
        case 'external-dashboard': return <ExternalDashboard {...dashboardProps} />;
        case 'external-content': return <Content {...simpleDashboardProps} />;
        case 'external-seo': return <Seo {...simpleDashboardProps} />;
        case 'external-partners': return <Partners {...simpleDashboardProps} />;
        case 'external-pr': return <PublicRelations {...simpleDashboardProps} />;
        case 'external-branding': return <Branding {...simpleDashboardProps} />;
        case 'external-competition': return <Competition />;
        
        case 'chat':
            const activeSession = aiChatSessions.find(s => s.id === activeAiChatId);
            return <Chat
                session={activeSession ? { ...activeSession, messages: activeSession.messages.map(m => ({ ...m, isBookmarked: bookmarks.some(b => b.message.id === m.id)})) } : undefined}
                isLoading={isAiLoading}
                isMessageQueued={!!queuedAiMessage}
                onSend={handleSendAiMessage}
                onRegenerate={handleRegenerate}
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
                setActiveChatId={setActiveAiChatId}
                getAppContextData={(command) => `Data for ${command}`}
                attachedWidgetContexts={attachedWidgetContexts}
                onRemoveWidgetContext={(id) => setAttachedWidgetContexts(p => p.filter(c => c.id !== id))}
                onClearWidgetContexts={() => setAttachedWidgetContexts([])}
            />;
        case 'conversations':
            return <Conversations
                activeTeamId={activeTeamId}
                setActiveTeamId={setActiveTeamId}
                channels={conversationChannels}
                messages={conversationMessages}
                activeChannelId={activeConversationChannelId}
                setActiveChannelId={setActiveConversationChannelId}
                onSendMessage={handleSendDmMessage}
            />;
        case 'team-management':
            return <TeamManagement activeTeamId={activeTeamId} setActiveTeamId={setActiveTeamId} setPage={setPage} />;
        case 'profile':
            return <Profile viewedProfileId={viewedProfileId} setPage={setPage} />;
        case 'notifications':
            return <Notifications />;

        default:
            return <PlaceholderPage title={String(page)} description={`This is a placeholder for the ${page} page.`} />;
    }
  };

  const commands = useMemo<Command[]>(() =>
    allNavItems.filter(item => !item.subItems).map(item => ({
        id: item.page,
        title: `Go to ${item.label}`,
        icon: item.icon || LineChartIcon,
        action: () => { setPage(item.page); setIsCommandPaletteOpen(false); },
    }))
  , [setPage]);

  const activeAiSession = aiChatSessions.find(s => s.id === activeAiChatId);
  const activeDmToasts = openDmToasts.map(toastState => {
      const channel = conversationChannels.find(c => c.id === toastState.channelId);
      return channel ? { ...toastState, channel } : null;
  }).filter(Boolean) as (DmToastState & { channel: ConversationChannel })[];

  return (
    <>
      <Layout
        activePage={page}
        setPage={setPage}
        chatSessions={aiChatSessions}
        activeChatId={activeAiChatId}
        setActiveChatId={setActiveAiChatId}
        onNewChat={handleNewChatInPanel}
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
            session={activeAiSession ? { ...activeAiSession, messages: activeAiSession.messages.map(m => ({ ...m, isBookmarked: bookmarks.some(b => b.message.id === m.id)})) } : undefined}
            isLoading={isAiLoading}
            isMessageQueued={!!queuedAiMessage}
            onSend={handleSendAiMessage}
            onRegenerate={handleRegenerate}
            onNewChat={handleNewChatInPanel}
            onReload={() => activeAiChatId && handleReloadChat(activeAiChatId)}
            onClose={() => setIsRightPanelOpen(false)}
            onMaximize={() => { if(activeAiChatId) setPage('chat'); }}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            setActiveChatId={setActiveAiChatId}
            getAppContextData={(command) => `Data for ${command}`}
            width={rightPanelWidth}
            onResize={handleRightPanelResize}
            setIsResizing={setIsResizing}
            attachedWidgetContexts={attachedWidgetContexts}
            onRemoveWidgetContext={(id) => setAttachedWidgetContexts(p => p.filter(c => c.id !== id))}
            onClearWidgetContexts={() => setAttachedWidgetContexts([])}
        />
      )}
      {isAiChatToastOpen && aiChatInterfaceStyle === 'toast' && activeAiSession && !isAiChatToastMinimized && (
          <PerpetualDiscussionToast
            session={{ ...activeAiSession, messages: activeAiSession.messages.map(m => ({ ...m, isBookmarked: bookmarks.some(b => b.message.id === m.id)})) }}
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
            getAppContextData={(command) => `Data for ${command}`}
            attachedWidgetContexts={attachedWidgetContexts}
            onRemoveWidgetContext={(id) => setAttachedWidgetContexts(p => p.filter(c => c.id !== id))}
            onClearWidgetContexts={() => setAttachedWidgetContexts([])}
          />
      )}
      {isAiChatToastOpen && aiChatInterfaceStyle === 'toast' && isAiChatToastMinimized && (
          <button onClick={() => setIsAiChatToastMinimized(false)} className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg flex items-center justify-center text-white">
              <SparklesIcon className="h-8 w-8" />
          </button>
      )}
      {activeDmToasts.map((toast, index) => (
          !toast.isMinimized ? (
              <PersonChatToast
                  key={toast.channelId}
                  style={{ right: `${6 + (index * 25)}rem` }}
                  channel={toast.channel}
                  messages={conversationMessages[toast.channelId] || []}
                  onSend={(text) => handleSendDmMessage(toast.channelId, text)}
                  onClose={() => setOpenDmToasts(prev => prev.filter(t => t.channelId !== toast.channelId))}
                  onMaximize={() => { setActiveConversationChannelId(toast.channelId); setPage('conversations'); }}
                  isMinimized={toast.isMinimized}
                  setIsMinimized={(minimized) => setOpenDmToasts(prev => prev.map(t => t.channelId === toast.channelId ? { ...t, isMinimized: minimized } : t))}
              />
          ) : (
              <button key={toast.channelId} onClick={() => setOpenDmToasts(prev => prev.map(t => t.channelId === toast.channelId ? { ...t, isMinimized: false } : t))} className="fixed bottom-6 z-40 h-14 w-14 rounded-full bg-zinc-700 hover:bg-zinc-600 shadow-lg flex items-center justify-center text-white" style={{ right: `${6 + (index * 5)}rem` }}>
                  <MessageSquareIcon className="h-7 w-7" />
              </button>
          )
      ))}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />
    </>
  );
}

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
import type { Page, ChatSession, Message, Bookmark, ConversationMessage, ConversationChannel, DmToastState, TimeConfig } from './types';
import { GoogleGenAI } from '@google/genai';
import PlaceholderPage from './PlaceholderPage';
import { PerpetualDiscussionToast } from './components/PerpetualDiscussionToast';
import { Command, CommandPalette } from './components/CommandPalette';
import { platformNavItems } from './navigation';
import { DatabaseIcon, MessageSquareIcon, SparklesIcon, ChevronUpIcon } from './components/Icons';
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
import { fmtEuro } from './utils';
import { DEFAULTS as simulationDefaults } from './constants';


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
  const [page, setPage] = useState<Page>('dashboard');
  const [activeContentSection, setActiveContentSection] = useState<'platform' | 'studio' | 'coordination' | 'marketplace'>('platform');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState<string>('eng');
  const [viewedProfileId, setViewedProfileId] = useState<number | null>(null);
  const [isKpiSentimentColoringEnabled, setIsKpiSentimentColoringEnabled] = useState(true);
  const [aiChatInterfaceStyle, setAiChatInterfaceStyle] = useState<'panel' | 'toast'>('panel');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);

  // AI Chat state
  const [aiChatSessions, setAiChatSessions] = useState<ChatSession[]>([]);
  const [activeAiChatId, setActiveAiChatId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
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
  
  const handleDeleteChat = (sessionId: string) => {
    setAiChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeAiChatId === sessionId) {
      setActiveAiChatId(null);
      setPage('dashboard');
    }
  };

  const handleSendAiMessage = async (messageText: string) => {
    if (!activeAiChatId) return;
    
    const sessionBeforeUpdate = aiChatSessions.find(s => s.id === activeAiChatId);
    const isFirstUserMessage = sessionBeforeUpdate?.messages.filter(m => m.sender === 'user').length === 0;

    setIsAiLoading(true);

    const userMessage: Message = { id: Date.now(), text: messageText, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
    setAiChatSessions(prevSessions =>
      prevSessions.map(s => {
        if (s.id === activeAiChatId) {
          return { ...s, messages: [...s.messages, userMessage] };
        }
        return s;
      })
    );
    
    const currentSession = aiChatSessions.find(s => s.id === activeAiChatId) || 
                           (aiChatSessions.length > 0 && aiChatSessions[0].id === activeAiChatId ? aiChatSessions[0] : null);

    if (!currentSession) {
      setIsAiLoading(false);
      return;
    }

    if (isFirstUserMessage) {
        generateChatTitle(activeAiChatId, messageText);
    }
    
    const geminiChat = currentSession.geminiChat;
    if (!geminiChat) {
      console.error("Gemini chat not initialized for session");
      setIsAiLoading(false);
      return;
    }

    const aiMessageId = Date.now() + 1;
    const aiMessagePlaceholder: Message = { id: aiMessageId, text: '', sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiChatSessions(prev =>
      prev.map(s => (s.id === activeAiChatId ? { ...s, messages: [...s.messages, aiMessagePlaceholder] } : s))
    );

    try {
        const stream = await geminiChat.sendMessageStream({ message: messageText });

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setAiChatSessions(prev =>
                prev.map(s => {
                    if (s.id === activeAiChatId) {
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
                if (s.id === activeAiChatId) {
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

    if (!lastUserMessage) {
        console.error("Could not find a user message to regenerate response from.");
        return;
    }
    
    setIsAiLoading(true);

    // Replace the old AI message with a new placeholder
    setAiChatSessions(prev => prev.map(s => {
      if (s.id === activeAiChatId) {
        const newMessages = s.messages.filter(m => m.id !== messageId);
        newMessages.push({ id: messageId, text: '', sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        return { ...s, messages: newMessages };
      }
      return s;
    }));

     try {
        const stream = await session.geminiChat.sendMessageStream({ message: lastUserMessage.text });

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setAiChatSessions(prev =>
                prev.map(s => {
                    if (s.id === activeAiChatId) {
                        const newMessages = s.messages.map(m =>
                            m.id === messageId ? { ...m, text: m.text + chunkText } : m
                        );
                        return { ...s, messages: newMessages };
                    }
                    return s;
                })
            );
        }
    } catch (error) {
         console.error("Error regenerating response:", error);
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleToggleAiChat = () => {
    const ensureChatExists = () => {
      if (!activeAiChatId) {
          if (aiChatSessions.length > 0) {
              setActiveAiChatId(aiChatSessions[0].id);
          } else {
              const newChatSession: ChatSession = {
                  id: Date.now().toString(),
                  title: 'New Chat',
                  messages: [{ id: 1, text: "Hello! How can I assist with your business data today?", sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
                  geminiChat: ai.chats.create({ model: 'gemini-2.5-flash' }),
              };
              setAiChatSessions(prev => [newChatSession, ...prev]);
              setActiveAiChatId(newChatSession.id);
          }
      }
    };

    if (aiChatInterfaceStyle === 'toast') {
        if (isAiChatToastOpen) {
            setIsAiChatToastOpen(false);
            return;
        }
        ensureChatExists();
        setIsAiChatToastOpen(true);
        setIsAiChatToastMinimized(false);
    } else { // 'panel' style
        if (!isRightPanelOpen) {
          ensureChatExists();
        }
        setIsRightPanelOpen(prev => !prev);
    }
  };
  
  const handleMaximizeAiChat = () => {
      setIsAiChatToastOpen(false);
      setIsRightPanelOpen(false);
      setPage('chat');
  };
  
  const handleToggleBookmark = (messageToToggle: Message) => {
    const session = aiChatSessions.find(s => s.id === activeAiChatId);
    if (!session) return;

    const bookmarkExists = bookmarks.some(b => b.message.id === messageToToggle.id);

    if (bookmarkExists) {
        setBookmarks(prev => prev.filter(b => b.message.id !== messageToToggle.id));
    } else {
        const { isBookmarked, ...message } = messageToToggle;
        const newBookmark: Bookmark = {
            message,
            sessionId: session.id,
            sessionTitle: session.title,
        };
        setBookmarks(prev => [newBookmark, ...prev]);
    }
  };

  const handleOpenConversation = useCallback((channelId: string) => {
    setOpenDmToasts(prev => {
        const MAX_OPEN_CHATS = 2;
        const alreadyOpen = prev.find(t => t.channelId === channelId);

        if (alreadyOpen) {
            // If it exists and is minimized, maximize it.
            return prev.map(t => t.channelId === channelId ? { ...t, isMinimized: false } : t);
        }
        
        // If too many are open, don't add a new one.
        if (prev.filter(t => !t.isMinimized).length >= MAX_OPEN_CHATS) {
            // TODO: In a future iteration, maybe add a small visual indicator/alert here
            return prev;
        }
        
        // Add new toast
        return [...prev, { channelId, isMinimized: false }];
    });
  }, []);

  const handleStartDm = useCallback((memberId: number) => {
    const channel = conversationChannels.find(c => c.type === 'dm' && c.members?.includes(memberId));
    if (channel) {
        handleOpenConversation(channel.id);
    } else {
        console.error(`DM channel for member ${memberId} not found.`);
    }
  }, [conversationChannels, handleOpenConversation]);

  const handleCloseDmToast = (channelId: string) => {
    setOpenDmToasts(prev => prev.filter(t => t.channelId !== channelId));
  };

  const handleSetDmToastMinimized = (channelId: string, isMinimized: boolean) => {
    setOpenDmToasts(prev => prev.map(t => t.channelId === channelId ? { ...t, isMinimized } : t));
  };
  
  const handleSendDmMessage = (channelId: string, text: string) => {
    const currentUser = initialConversationUsers.find(u => u.id === 1); // Assume current user is John Doe
    if (!currentUser) return;

    const newMessage: ConversationMessage = {
        id: `m-${Date.now()}`,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userId: currentUser.id,
        userName: currentUser.name,
    };

    setConversationMessages(prev => {
        const newMessages = { ...prev };
        const channelMessages = newMessages[channelId] || [];
        newMessages[channelId] = [...channelMessages, newMessage];
        return newMessages;
    });
  };

  const handleMaximizeDm = (channelId: string) => {
    setActiveConversationChannelId(channelId);
    handleCloseDmToast(channelId);
    setPage('conversations');
  };

  const getAppContextData = useCallback((command: string): string => {
    let context = 'No data found for this command.';
    const parts = command.split('.');
    const mainCommand = parts[0];
    const subCommand = parts[1];

    try {
        switch (mainCommand) {
            case 'dashboard':
                context = `## Home Dashboard KPIs\n${initialKpiMetrics.map(k => `- **${k.metric}**: ${k.value} (${k.change})`).join('\n')}`;
                break;
            case 'financial': {
                const totalRevenue = initialRevenueStreams.reduce((sum, item) => sum + item.mrr, 0);
                const totalExpenses = initialExpenses.reduce((sum, item) => sum + item.cost, 0);

                if (subCommand === 'revenue') {
                    context = `## Revenue Streams\n${initialRevenueStreams.map(r => `- **${r.stream}**: ${fmtEuro(r.mrr)}/month`).join('\n')}`;
                } else if (subCommand === 'expenses') {
                    context = `## Expense Breakdown\n${initialExpenses.map(e => `- **${e.category}**: ${fmtEuro(e.cost)}/month`).join('\n')}`;
                } else {
                    context = `## Key Financial Metrics
- **Total Monthly Revenue**: ${fmtEuro(totalRevenue)}
- **Total Monthly Expenses**: ${fmtEuro(totalExpenses)}
- **Net Monthly Income**: ${fmtEuro(totalRevenue - totalExpenses)}`;
                }
                break;
            }
            case 'simulation':
                context = `## Current Simulation Parameters
- **ARPU Current**: ${fmtEuro(simulationDefaults.arpuCurrent)}/year
- **ARPU Supernova**: ${fmtEuro(simulationDefaults.arpuSuper)}/year
- **User Range**: ${simulationDefaults.usersMin.toLocaleString()} - ${simulationDefaults.usersMax.toLocaleString()}
- **Valuation Multiplier (Low Band)**: ${simulationDefaults.lowBand.min}x - ${simulationDefaults.lowBand.max}x
- **Valuation Multiplier (High Band)**: ${simulationDefaults.highBand.min}x - ${simulationDefaults.highBand.max}x`;
                break;
            case 'sales':
                context = `## E-commerce Sales KPIs\n${initialEcommerceMetrics.map(k => `- **${k.metric}**: ${k.value} (${k.change})`).join('\n')}`;
                break;
            case 'customer': {
                 if (subCommand === 'crm') {
                    context = `## CRM Pipeline\n${initialCrmData.slice(0, 5).map(c => `- **${c.company} (${c.name})**: ${fmtEuro(c.value)} - ${c.status}`).join('\n')}`;
                } else if (subCommand === 'feedback') {
                    const promoters = initialFeedbackData.filter(f => f.type === 'promoter').length;
                    const total = initialFeedbackData.length;
                    context = `## Customer Feedback Summary\n- Total Feedback entries: ${total}\n- Promoters: ${promoters} (${((promoters/total)*100).toFixed(0)}%)`;
                } else if (subCommand === 'requests') {
                    context = `## Top Feature Requests\n${initialRequestData.slice(0, 5).map(r => `- **${r.title}**: ${r.votes} votes - ${r.status}`).join('\n')}`;
                } else {
                    context = `## Customer KPIs\n${initialCustomerMetrics.map(k => `- **${k.metric}**: ${k.value} (${k.change})`).join('\n')}`;
                }
                break;
            }
            case 'internal': {
                if (subCommand === 'hiring') {
                    context = `## Hiring Pipeline Summary\n- **Open Roles**: ${initialHiringPipeline.length}\n- **Total Candidates**: ${initialHiringPipeline.reduce((sum, item) => sum + item.candidates, 0)}\n${initialHiringPipeline.map(r => `  - ${r.role}: ${r.candidates} candidates`).join('\n')}`;
                } else {
                     context = `## Internal KPIs\n- **Headcount**: 42 (+2 this month)\n- **eNPS**: 75 (Last surveyed in Q2)`;
                }
                break;
            }
            case 'marketing':
                context = `## Marketing KPIs\n${initialMarketingMetrics.map(k => `- **${k.metric}**: ${k.value} (${k.change})`).join('\n')}`;
                break;
            case 'operational':
                context = `## Operational KPIs\n${initialOperationalMetrics.map(k => `- **${k.metric}**: ${k.value} (${k.change})`).join('\n')}`;
                break;
        }
    } catch (error) {
        console.error("Error gathering context data:", error);
        context = "An error occurred while fetching data.";
    }
    return context.trim();
  }, []);

  const activeAiChat = aiChatSessions.find(c => c.id === activeAiChatId);
  const bookmarkedMessageIds = new Set(bookmarks.map(b => b.message.id));
  const activeChatWithBookmarks = activeAiChat ? {
      ...activeAiChat,
      messages: activeAiChat.messages.map(m => ({
          ...m,
          isBookmarked: bookmarkedMessageIds.has(m.id),
      }))
  } : undefined;

  const commands = useMemo(() => {
    const pageCommands: Command[] = [];
    platformNavItems.forEach(item => {
      if (item.subItems) {
        item.subItems.forEach(sub => {
          pageCommands.push({
            id: sub.page,
            title: `${item.label} → ${sub.label}`,
            icon: item.icon,
            action: () => { setPage(sub.page); setIsCommandPaletteOpen(false); }
          });
        });
      } else {
        pageCommands.push({
          id: item.page,
          title: item.label,
          icon: item.icon,
          action: () => { setPage(item.page); setIsCommandPaletteOpen(false); }
        });
      }
    });

    pageCommands.push({
        id: 'data-sources',
        title: 'Data Sources',
        icon: DatabaseIcon,
        action: () => { setPage('data-sources'); setIsCommandPaletteOpen(false); }
    });
    
    pageCommands.push({
        id: 'new-chat',
        title: 'Start New Chat',
        icon: MessageSquareIcon,
        action: () => { handleNewChat(); setIsCommandPaletteOpen(false); }
    });

    return pageCommands;
  }, [handleNewChat]);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <HomeDashboard page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'simulation-dashboard':
        return <SimulationDashboard page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'simulation-revenue':
        return <FinancialSimulations />;
      case 'simulation-pnl':
        return <PNLStatement isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'simulation-balance-sheet':
        return <BalanceSheet isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'financial-dashboard':
        return <FinancialPlanning page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'financial-revenue':
        return <Revenue />;
      case 'financial-expenses':
        return <Expenses />;
      case 'customer-dashboard':
        return <CustomerDashboard isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'customer-crm':
        return <CustomerCRM />;
      case 'customer-requests':
        return <CustomerRequests />;
      case 'customer-feedback':
        return <CustomerFeedback isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'product-analytics':
        return <ProductAnalytics isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'marketing':
        return <Marketing page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'operational-dashboard':
        return <OperationalDashboard page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'operational-efficiency':
        return <Operational isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'operational-status':
        return <SystemStatus />;
      case 'operational-costs':
        return <CostAnalysis />;
      case 'internal-dashboard':
        return <InternalDashboard page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'internal-people':
        return <Internal page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'internal-cap-table':
        return <CapTable isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'sales-dashboard':
        return <SalesDashboard page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'sales-orders':
        return <OrderFulfillment />;
      case 'sales-inventory':
        return <InventoryManagement />;
      case 'sales-promotions':
        return <Promotions />;
      case 'data-sources':
        return <DataSources />;
      case 'conversations':
        return <Conversations 
          activeTeamId={activeTeamId}
          setActiveTeamId={setActiveTeamId}
          channels={conversationChannels}
          messages={conversationMessages}
          activeChannelId={activeConversationChannelId}
          setActiveChannelId={setActiveConversationChannelId}
        />;
      case 'team-management':
        return <TeamManagement 
          activeTeamId={activeTeamId}
          setActiveTeamId={setActiveTeamId}
          setPage={setPage}
        />;
      case 'profile':
        return <Profile viewedProfileId={viewedProfileId} setPage={setPage} />;
      case 'notifications':
        return <Notifications />;
      case 'chat':
        return (
          <Chat 
            session={activeChatWithBookmarks} 
            onSend={handleSendAiMessage} 
            isLoading={isAiLoading} 
            onRegenerate={handleRegenerate}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            setActiveChatId={(id) => {
              setActiveAiChatId(id);
              setPage('chat');
            }}
            getAppContextData={getAppContextData}
          />
        );
      case 'coordination-dashboard':
        return <CoordinationDashboard page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'coordination-contractors':
        return <PlaceholderPage title="Contractors" description="Manage and coordinate with your organization's contractors." />;
      case 'coordination-agents':
        return <PlaceholderPage title="Agents" description="Manage and coordinate with your organization's agents." />;
      case 'coordination-services':
        return <PlaceholderPage title="Services" description="Manage and coordinate with external services." />;
      case 'studio-dashboard':
        return <PlaceholderPage title="Studio Dashboard" description="An overview of your studio activities." />;
      case 'studio-projects':
        return <PlaceholderPage title="Studio Projects" description="Manage all your studio projects." />;
      case 'studio-tasks':
        return <PlaceholderPage title="Studio Tasks" description="Track tasks related to studio projects." />;
      case 'studio-entities':
        return <PlaceholderPage title="Studio Entities" description="Manage entities within your studio." />;
      case 'studio-systems':
        return <PlaceholderPage title="Studio Systems" description="Manage studio systems and workflows." />;
      case 'studio-essences':
        return <PlaceholderPage title="Studio Essences" description="Manage essences for your studio." />;
      case 'marketplace-dashboard':
        return <PlaceholderPage title="Marketplace Dashboard" description="An overview of your marketplace performance." />;
      case 'marketplace-performances':
        return <PlaceholderPage title="Marketplace Performances" description="Analyze marketplace performance metrics." />;
      case 'marketplace-requests':
        return <PlaceholderPage title="Marketplace Requests" description="Handle requests from the marketplace." />;
      case 'marketplace-contracts':
        return <PlaceholderPage title="Marketplace Contracts" description="Manage marketplace contracts." />;
      case 'marketplace-prospection':
        return <PlaceholderPage title="Marketplace Prospection" description="Tools for marketplace prospection." />;
      case 'internal-culture':
        return <PlaceholderPage title="Culture" description="Monitor and foster company culture." />;
      case 'external-dashboard':
        return <ExternalDashboard page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'external-content':
        return <Content isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'external-seo':
        return <Seo isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'external-partners':
        return <Partners isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'external-pr':
        return <PublicRelations isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'external-branding':
        return <Branding isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
      case 'external-competition':
        return <Competition />;
      default:
        return <FinancialPlanning page={page} setPage={setPage} globalTimeConfig={globalTimeConfig} setGlobalTimeConfig={setGlobalTimeConfig} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />;
    }
  };

  const maximizedDmToasts = openDmToasts.filter(t => !t.isMinimized);
  const minimizedDmToasts = openDmToasts.filter(t => t.isMinimized);
  const isAiToastMaximized = isAiChatToastOpen && !isAiChatToastMinimized;

  // Constants for layout calculations
  const baseOffsetRem = 1.5; // right-6
  const aiToastWidthRem = 26; // from PerpetualDiscussionToast component
  const personToastWidthRem = 24; // from PersonChatToast component
  const gapRem = 1;
  const rightPanelRemWidth = isRightPanelOpen && aiChatInterfaceStyle === 'panel' ? rightPanelWidth / 16 : 0;


  // Calculate the position for the container of minimized toasts
  let minimizedContainerRightOffset = baseOffsetRem + rightPanelRemWidth;
  if (isAiToastMaximized) {
    minimizedContainerRightOffset += aiToastWidthRem + gapRem;
  }
  minimizedContainerRightOffset += maximizedDmToasts.length * (personToastWidthRem + gapRem);

  const minimizedContainerStyle = {
    right: `${minimizedContainerRightOffset}rem`,
  };

  return (
    <div className="relative min-h-screen w-full text-zinc-50 overflow-x-hidden">
       <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_400px_at_10%_20%,_rgba(124,58,237,0.2),_transparent)]" />
        <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_500px_at_90%_80%,_rgba(16,185,129,0.15),_transparent)]" />
      </div>
      <Layout 
        activePage={page} 
        setPage={setPage}
        chatSessions={aiChatSessions}
        activeChatId={activeAiChatId}
        setActiveChatId={(id) => {
          setActiveAiChatId(id);
          setPage('chat');
        }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onToggleAiChat={handleToggleAiChat}
        activeContentSection={activeContentSection}
        setActiveContentSection={setActiveContentSection}
        onSearchClick={() => setIsCommandPaletteOpen(true)}
        activeTeamId={activeTeamId}
        setActiveTeamId={setActiveTeamId}
        setViewedProfileId={setViewedProfileId}
        onStartDm={handleStartDm}
        onOpenConversationToast={handleOpenConversation}
        isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
        setIsKpiSentimentColoringEnabled={setIsKpiSentimentColoringEnabled}
        aiChatInterfaceStyle={aiChatInterfaceStyle}
        setAiChatInterfaceStyle={setAiChatInterfaceStyle}
        isRightPanelOpen={isRightPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
        rightPanelWidth={rightPanelWidth}
        isResizing={isResizing}
      >
        {renderPage()}
      </Layout>
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />

      {aiChatInterfaceStyle === 'panel' && isRightPanelOpen && (
          <AiChatPanel
              session={activeChatWithBookmarks}
              isLoading={isAiLoading}
              onSend={handleSendAiMessage}
              onRegenerate={handleRegenerate}
              onClose={() => setIsRightPanelOpen(false)}
              onMaximize={handleMaximizeAiChat}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              setActiveChatId={(id) => {
                setActiveAiChatId(id);
                setPage('chat');
              }}
              getAppContextData={getAppContextData}
              width={rightPanelWidth}
              onResize={handleRightPanelResize}
              setIsResizing={setIsResizing}
          />
      )}

      {aiChatInterfaceStyle === 'toast' && isAiChatToastOpen && !isAiChatToastMinimized && activeChatWithBookmarks && (
        <PerpetualDiscussionToast
            session={activeChatWithBookmarks}
            isLoading={isAiLoading}
            onSend={handleSendAiMessage}
            onRegenerate={handleRegenerate}
            onClose={() => setIsAiChatToastOpen(false)}
            onMaximize={handleMaximizeAiChat}
            isMinimized={isAiChatToastMinimized}
            setIsMinimized={setIsAiChatToastMinimized}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            setActiveChatId={(id) => {
              setActiveAiChatId(id);
              setPage('chat');
            }}
            getAppContextData={getAppContextData}
        />
      )}
      
      {maximizedDmToasts.map((toast, index) => {
          const channel = conversationChannels.find(c => c.id === toast.channelId);
          if (!channel) return null;
          const messages = conversationMessages[toast.channelId] || [];

          let rightOffsetRem = baseOffsetRem + rightPanelRemWidth;
          if (isAiToastMaximized) {
              rightOffsetRem += aiToastWidthRem + gapRem;
          }
          rightOffsetRem += index * (personToastWidthRem + gapRem);
          
          const style = { right: `${rightOffsetRem}rem`, transition: 'right 0.3s ease-in-out' };

          return (
              <PersonChatToast
                  key={toast.channelId}
                  channel={channel}
                  messages={messages}
                  onSend={(text) => handleSendDmMessage(toast.channelId, text)}
                  onClose={() => handleCloseDmToast(toast.channelId)}
                  onMaximize={() => handleMaximizeDm(toast.channelId)}
                  isMinimized={toast.isMinimized}
                  setIsMinimized={(isMinimized) => handleSetDmToastMinimized(toast.channelId, isMinimized)}
                  style={style}
              />
          );
      })}

      <div 
        className="fixed bottom-6 z-40 flex flex-row-reverse items-center gap-2 transition-all duration-300 ease-in-out"
        style={minimizedContainerStyle}
      >
          {aiChatInterfaceStyle === 'toast' && isAiChatToastOpen && isAiChatToastMinimized && (
              <button
                  onClick={() => setIsAiChatToastMinimized(false)}
                  className="flex items-center gap-3 p-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-2xl shadow-black/30 transition-all duration-200 hover:scale-105"
                  aria-label="Maximize AI Assistant"
              >
                  <SparklesIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">AI Assistant</span>
                  <ChevronUpIcon className="h-5 w-5" />
              </button>
          )}
          {minimizedDmToasts.map(toast => {
              const channel = conversationChannels.find(c => c.id === toast.channelId);
              if (!channel) return null;
              return (
                  <button
                      key={toast.channelId}
                      onClick={() => handleSetDmToastMinimized(toast.channelId, false)}
                      className="flex items-center gap-3 p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white shadow-2xl shadow-black/30 transition-all duration-200 hover:scale-105"
                      aria-label={`Maximize chat with ${channel.name}`}
                  >
                      <MessageSquareIcon className="h-6 w-6" />
                      <span className="text-sm font-medium">{channel.name}</span>
                      <ChevronUpIcon className="h-5 w-5" />
                  </button>
              );
          })}
      </div>
    </div>
  );
}

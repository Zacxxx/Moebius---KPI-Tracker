
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Layout from './Layout';
import Dashboard from './Dashboard';
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
import type { Page, ChatSession, Message, Bookmark } from './types';
import { GoogleGenAI } from '@google/genai';
import PlaceholderPage from './PlaceholderPage';
import { PerpetualDiscussionToast } from './components/PerpetualDiscussionToast';
import { Command, CommandPalette } from './components/CommandPalette';
import { platformNavItems } from './navigation';
import { DatabaseIcon, MessageSquareIcon } from './components/Icons';
import Content from './Content';
import Seo from './Seo';
import Partners from './Partners';
import PublicRelations from './PublicRelations';
import Branding from './Branding';
import Competition from './Competition';


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
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isChatToastOpen, setIsChatToastOpen] = useState(false);
  const [isChatToastMinimized, setIsChatToastMinimized] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const prevPage = usePrevious(page);

  useEffect(() => {
    // When navigating away from the full-screen chat to a non-chat page,
    // open the toast in a minimized state.
    if (prevPage === 'chat' && page !== 'chat' && activeChatId) {
      setIsChatToastOpen(true);
      setIsChatToastMinimized(true);
    }

    // When navigating TO the full-screen chat, ensure the toast is closed.
    if (page === 'chat') {
        setIsChatToastOpen(false);
    }
  }, [page, prevPage, activeChatId]);
  
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
      setChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isGeneratingTitle: true } : s));
      const prompt = `Summarize the following user query into a concise title of no more than 6 words: "${firstMessage}"`;
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });
      const newTitle = response.text.trim().replace(/"/g, '');
      setChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle, isGeneratingTitle: false } : s));
    } catch (error) {
      console.error("Error generating title:", error);
      setChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isGeneratingTitle: false } : s)); // Reset loading state on error
    }
  };

  const handleNewChat = useCallback(() => {
    const newChatSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ id: 1, text: "Hello! How can I assist with your business data today?", sender: 'ai' }],
      geminiChat: ai.chats.create({ model: 'gemini-2.5-flash' }),
    };
    setChatSessions(prev => [newChatSession, ...prev]);
    setActiveChatId(newChatSession.id);
    setPage('chat');
  }, []);
  
  const handleDeleteChat = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeChatId === sessionId) {
      setActiveChatId(null);
      setPage('dashboard');
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeChatId) return;
    
    const sessionBeforeUpdate = chatSessions.find(s => s.id === activeChatId);
    const isFirstUserMessage = sessionBeforeUpdate?.messages.filter(m => m.sender === 'user').length === 0;

    setIsAiLoading(true);

    const userMessage: Message = { id: Date.now(), text: messageText, sender: 'user' };
    
    setChatSessions(prevSessions =>
      prevSessions.map(s => {
        if (s.id === activeChatId) {
          return { ...s, messages: [...s.messages, userMessage] };
        }
        return s;
      })
    );
    
    const currentSession = chatSessions.find(s => s.id === activeChatId) || 
                           (chatSessions.length > 0 && chatSessions[0].id === activeChatId ? chatSessions[0] : null);

    if (!currentSession) {
      setIsAiLoading(false);
      return;
    }

    if (isFirstUserMessage) {
        generateChatTitle(activeChatId, messageText);
    }
    
    const geminiChat = currentSession.geminiChat;
    if (!geminiChat) {
      console.error("Gemini chat not initialized for session");
      setIsAiLoading(false);
      return;
    }

    const aiMessageId = Date.now() + 1;
    const aiMessagePlaceholder: Message = { id: aiMessageId, text: '', sender: 'ai' };
    setChatSessions(prev =>
      prev.map(s => (s.id === activeChatId ? { ...s, messages: [...s.messages, aiMessagePlaceholder] } : s))
    );

    try {
        const stream = await geminiChat.sendMessageStream({ message: messageText });

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setChatSessions(prev =>
                prev.map(s => {
                    if (s.id === activeChatId) {
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
        setChatSessions(prev =>
            prev.map(s => {
                if (s.id === activeChatId) {
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
    if (!activeChatId) return;
    
    const session = chatSessions.find(s => s.id === activeChatId);
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
    setChatSessions(prev => prev.map(s => {
      if (s.id === activeChatId) {
        const newMessages = s.messages.filter(m => m.id !== messageId);
        newMessages.push({ id: messageId, text: '', sender: 'ai' });
        return { ...s, messages: newMessages };
      }
      return s;
    }));

     try {
        const stream = await session.geminiChat.sendMessageStream({ message: lastUserMessage.text });

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setChatSessions(prev =>
                prev.map(s => {
                    if (s.id === activeChatId) {
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

  const handleToggleChatToast = () => {
    if (isChatToastOpen) {
        setIsChatToastOpen(false);
        return;
    }

    if (!activeChatId) {
        if (chatSessions.length > 0) {
            // Set the most recent chat as active
            setActiveChatId(chatSessions[0].id);
        } else {
            // No chats exist, create a new one.
            const newChatSession: ChatSession = {
                id: Date.now().toString(),
                title: 'New Chat',
                messages: [{ id: 1, text: "Hello! How can I assist with your business data today?", sender: 'ai' }],
                geminiChat: ai.chats.create({ model: 'gemini-2.5-flash' }),
            };
            setChatSessions(prev => [newChatSession, ...prev]);
            setActiveChatId(newChatSession.id);
        }
    }
    
    setIsChatToastOpen(true);
    setIsChatToastMinimized(false);
  };
  
  const handleMaximizeChat = () => {
      setIsChatToastOpen(false);
      setPage('chat');
  };
  
  const handleToggleBookmark = (messageToToggle: Message) => {
    const session = chatSessions.find(s => s.id === activeChatId);
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

  const activeChat = chatSessions.find(c => c.id === activeChatId);
  const bookmarkedMessageIds = new Set(bookmarks.map(b => b.message.id));
  const activeChatWithBookmarks = activeChat ? {
      ...activeChat,
      messages: activeChat.messages.map(m => ({
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
        return <Dashboard />;
      case 'simulation-revenue':
        return <FinancialSimulations />;
      case 'simulation-pnl':
        return <PNLStatement />;
      case 'simulation-balance-sheet':
        return <BalanceSheet />;
      case 'financial-dashboard':
        return <FinancialPlanning />;
      case 'financial-revenue':
        return <Revenue />;
      case 'financial-expenses':
        return <Expenses />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'customer-crm':
        return <CustomerCRM />;
      case 'customer-requests':
        return <CustomerRequests />;
      case 'customer-feedback':
        return <CustomerFeedback />;
      case 'product-analytics':
        return <ProductAnalytics />;
      case 'marketing':
        return <Marketing />;
      case 'operational-efficiency':
        return <Operational />;
      case 'operational-status':
        return <SystemStatus />;
      case 'operational-costs':
        return <CostAnalysis />;
      case 'internal-people':
        return <Internal />;
      case 'internal-cap-table':
        return <CapTable />;
      case 'sales-dashboard':
        return <SalesDashboard />;
      case 'sales-orders':
        return <OrderFulfillment />;
      case 'sales-inventory':
        return <InventoryManagement />;
      case 'sales-promotions':
        return <Promotions />;
      case 'data-sources':
        return <DataSources />;
      case 'chat':
        return (
          <Chat 
            session={activeChatWithBookmarks} 
            onSend={handleSendMessage} 
            isLoading={isAiLoading} 
            onRegenerate={handleRegenerate}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            setActiveChatId={(id) => {
              setActiveChatId(id);
              setPage('chat');
            }}
          />
        );
      case 'coordination-contractors':
        return <PlaceholderPage title="Contractors" description="Manage and coordinate with your organization's contractors." />;
      case 'coordination-agents':
        return <PlaceholderPage title="Agents" description="Manage and coordinate with your organization's agents." />;
      case 'coordination-services':
        return <PlaceholderPage title="Services" description="Manage and coordinate with external services." />;
      case 'internal-culture':
        return <PlaceholderPage title="Culture" description="Monitor and foster company culture." />;
      case 'external-content':
        return <Content />;
      case 'external-seo':
        return <Seo />;
      case 'external-partners':
        return <Partners />;
      case 'external-pr':
        return <PublicRelations />;
      case 'external-branding':
        return <Branding />;
      case 'external-competition':
        return <Competition />;
      default:
        return <FinancialPlanning />;
    }
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
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        setActiveChatId={(id) => {
          setActiveChatId(id);
          setPage('chat');
        }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onToggleChatToast={handleToggleChatToast}
        activeContentSection={activeContentSection}
        setActiveContentSection={setActiveContentSection}
        onSearchClick={() => setIsCommandPaletteOpen(true)}
      >
        {renderPage()}
      </Layout>
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />

      {isChatToastOpen && activeChatWithBookmarks && (
        <PerpetualDiscussionToast
            session={activeChatWithBookmarks}
            isLoading={isAiLoading}
            onSend={handleSendMessage}
            onRegenerate={handleRegenerate}
            onClose={() => setIsChatToastOpen(false)}
            onMaximize={handleMaximizeChat}
            isMinimized={isChatToastMinimized}
            setIsMinimized={setIsChatToastMinimized}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            setActiveChatId={(id) => {
              setActiveChatId(id);
              setPage('chat');
            }}
        />
      )}
    </div>
  );
}
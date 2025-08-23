
import React, { useState, useRef, useEffect } from 'react';
import type { Page, ChatSession } from './types';
import { MenuIcon, BellIcon, UserIcon, UsersIcon, SearchIcon, MoebiusIcon, ChevronLeftIcon, ChevronDownIcon, DatabaseIcon, MessageSquareIcon, EditIcon, FolderIcon, FolderPlusIcon, Trash2Icon, SparklesIcon, LaptopIcon, ShoppingCartIcon, ShapesIcon } from './components/Icons';
import UserPanel from './components/UserPanel';
import NotificationsPanel from './components/NotificationsPanel';
import TeamPanel from './components/TeamPanel';
import ConversationsPanel from './components/ConversationsPanel';
import { NavItemData, platformNavItems } from './navigation';

const NavItem: React.FC<{
  icon: React.FC<{className?: string}>;
  label: string;
  page: Page;
  activePage: Page;
  setPage: (page: Page) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}> = ({ icon: Icon, label, page, activePage, setPage, isSidebarOpen, setIsSidebarOpen }) => {
  const isActive = page === activePage;
  
  const handleClick = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    setPage(page);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full h-12 rounded-lg text-left transition-colors duration-200 ${
        isActive
          ? 'bg-violet-500/20 text-violet-300'
          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
      } ${isSidebarOpen ? 'px-4' : 'justify-center'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <span className={`overflow-hidden text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        isSidebarOpen ? 'w-auto opacity-100 ml-4' : 'w-0 opacity-0'
      }`}>
        {label}
      </span>
    </button>
  );
};

const CollapsibleNavItem: React.FC<{
  item: NavItemData;
  activePage: Page;
  setPage: (page: Page) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}> = ({ item, activePage, setPage, isSidebarOpen, setIsSidebarOpen }) => {
    const isParentActive = item.page === activePage || (item.subItems || []).some(sub => sub.page === activePage);
    const [isOpen, setIsOpen] = useState(isParentActive);
    
    useEffect(() => {
        if (isParentActive && isSidebarOpen) {
            setIsOpen(true);
        }
    }, [isParentActive, isSidebarOpen]);

    const handleParentClick = () => {
        if (!isSidebarOpen) {
            setIsSidebarOpen(true);
            setIsOpen(true);
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div>
            <button
                onClick={handleParentClick}
                className={`flex items-center w-full h-12 rounded-lg text-left transition-colors duration-200 ${
                    isParentActive ? 'text-violet-300' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                } ${isSidebarOpen ? 'px-4' : 'justify-center'}`}
            >
                <item.icon className="h-6 w-6 flex-shrink-0" />
                <span className={`overflow-hidden text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isSidebarOpen ? 'flex-1 w-auto opacity-100 ml-4' : 'w-0 opacity-0'
                }`}>
                    {item.label}
                </span>
                {isSidebarOpen && <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
            </button>
            {isOpen && isSidebarOpen && (
                <div className="pl-8 pt-1 space-y-1">
                    {(item.subItems || []).map(subItem => {
                         const isActive = subItem.page === activePage;
                         return (
                            <button
                                key={subItem.page}
                                onClick={() => setPage(subItem.page)}
                                className={`flex items-center w-full h-9 px-4 rounded-md text-left text-sm transition-colors duration-200 ${
                                    isActive ? 'text-white bg-zinc-800/70' : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-4"></span>
                                {subItem.label}
                            </button>
                         )
                    })}
                </div>
            )}
        </div>
    );
};

const CollapsibleCategory: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  actionIcon?: React.FC<{ className?: string }>;
  onAction?: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ icon: Icon, label, actionIcon: ActionIcon, onAction, isSidebarOpen, setIsSidebarOpen, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) onAction();
  };
  
  const handleToggleCategory = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <div className={`flex items-center w-full h-12 rounded-lg text-left transition-colors duration-200 text-zinc-400 hover:bg-zinc-800/60 ${isSidebarOpen ? 'px-4' : ''}`}>
        <button
          onClick={handleToggleCategory}
          className={`flex items-center flex-1 h-full min-w-0 ${isSidebarOpen ? '' : 'justify-center'}`}
          aria-expanded={isOpen}
        >
          <Icon className="h-6 w-6 flex-shrink-0" />
          <span className={`overflow-hidden text-sm font-medium transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? 'flex-1 w-auto opacity-100 ml-4' : 'w-0 opacity-0'}`}>
            {label}
          </span>
        </button>
        {isSidebarOpen && ActionIcon && (
          <button onClick={handleAction} className="p-1 ml-2 rounded-md hover:bg-zinc-700 flex-shrink-0" aria-label={`New ${label}`}>
            <ActionIcon className="h-5 w-5 text-zinc-400" />
          </button>
        )}
        {isSidebarOpen && (
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-md hover:bg-zinc-700 flex-shrink-0" aria-label="Toggle category">
            <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {isOpen && isSidebarOpen && (
        <div className="pl-6 pt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const allNavItems: Record<string, NavItemData[]> = {
    platform: platformNavItems,
    studio: [],
    coordination: [],
    marketplace: [],
};

type ContentSection = 'platform' | 'studio' | 'coordination' | 'marketplace';

const contentSections: { id: ContentSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'platform', label: 'Platform', icon: LaptopIcon },
    { id: 'studio', label: 'Studio', icon: SparklesIcon },
    { id: 'coordination', label: 'Coordination', icon: ShapesIcon },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCartIcon },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activePage: Page;
  setPage: (page: Page) => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  activeContentSection: keyof typeof allNavItems;
  setActiveContentSection: (section: ContentSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activePage, 
  setPage, 
  chatSessions,
  activeChatId,
  setActiveChatId,
  onNewChat,
  onDeleteChat,
  activeContentSection,
  setActiveContentSection
}) => {
  const navItemsForCurrentSection = allNavItems[activeContentSection];
  return (
    <aside className={`fixed top-0 left-0 h-full bg-zinc-900/70 backdrop-blur-xl border-r border-zinc-700/50 z-30 w-64 transition-transform duration-300 ease-in-out lg:transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center h-16 px-4 border-b border-zinc-700/50 flex-shrink-0 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
           <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                <MoebiusIcon className="h-8 w-8 text-white flex-shrink-0" />
                <span className="font-bold text-lg text-white whitespace-nowrap">Moebius</span>
           </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hidden lg:inline-flex">
            <ChevronLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-2 sidebar-nav">
            <CollapsibleCategory
                icon={FolderIcon}
                label="Projects"
                actionIcon={FolderPlusIcon}
                onAction={() => alert('New Project clicked')}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            >
                <div className="px-3 py-2 text-xs text-zinc-500">
                    Project list will appear here.
                </div>
            </CollapsibleCategory>
            
            <CollapsibleCategory
                icon={MessageSquareIcon}
                label="Chats"
                actionIcon={EditIcon}
                onAction={onNewChat}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            >
                <div className="p-2 space-y-1">
                    {chatSessions.length > 0 ? chatSessions.map(session => {
                      const isActive = activePage === 'chat' && activeChatId === session.id;
                      return (
                        <div key={session.id} className="group relative">
                          <button
                            onClick={() => setActiveChatId(session.id)}
                            className={`flex items-center w-full h-9 px-3 rounded-md text-left text-sm transition-colors duration-200 ${
                                isActive ? 'text-white bg-zinc-800/70' : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'
                            }`}
                          >
                            <span className="truncate flex-1">
                              {session.isGeneratingTitle ? (
                                <span className="italic text-zinc-500">Generating title...</span>
                              ) : (
                                session.title
                              )}
                            </span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteChat(session.id); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete chat"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    }) : <p className="px-1 py-2 text-xs text-zinc-500">No chats yet.</p>}
                </div>
            </CollapsibleCategory>

            <div className="pt-2">
                <div className={`border-t border-zinc-700/50 ${isSidebarOpen ? 'mx-4' : 'mx-2'}`}></div>
            </div>

            <div className={`py-2 ${isSidebarOpen ? 'px-2' : ''}`}>
                <div className={`flex items-center gap-2 ${isSidebarOpen ? 'justify-around' : 'flex-col'}`}>
                    {contentSections.map(section => (
                        <div key={section.id} className="relative group">
                            <button
                                onClick={() => setActiveContentSection(section.id)}
                                className={`rounded-lg transition-colors ${isSidebarOpen ? 'p-3' : 'p-1.5'} ${activeContentSection === section.id ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-400 hover:bg-zinc-800/60'}`}
                                aria-label={section.label}
                            >
                                <section.icon className="h-6 w-6" />
                            </button>
                            <div className={`absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2 py-1 bg-zinc-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${isSidebarOpen ? 'hidden' : 'block'}`}>
                                {section.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2">
                <div className={`border-t border-zinc-700/50 ${isSidebarOpen ? 'mx-4' : 'mx-2'}`}></div>
            </div>

            {navItemsForCurrentSection.length > 0 ? navItemsForCurrentSection.map(item => 
              item.subItems ? (
                  <CollapsibleNavItem key={item.page} item={item} activePage={activePage} setPage={setPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
              ) : (
                  <NavItem key={item.page} {...item} activePage={activePage} setPage={setPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
              )
            ) : (isSidebarOpen && <div className="px-4 py-2 text-center text-xs text-zinc-500">No pages in this section.</div>)
          }
        </nav>
        <div className="p-2 border-t border-zinc-700/50">
            <NavItem 
                icon={DatabaseIcon} 
                label="Data Sources" 
                page="data-sources" 
                activePage={activePage} 
                setPage={setPage} 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen}
            />
        </div>
      </div>
    </aside>
  );
}

const Header: React.FC<{ 
  onToggleSidebar: () => void; 
  onToggleUserPanel: () => void; 
  onToggleNotificationsPanel: () => void; 
  onToggleChatToast: () => void; 
  onSearchClick: () => void;
  onToggleTeamPanel: () => void;
  onToggleConversationsPanel: () => void;
}> = ({ onToggleSidebar, onToggleUserPanel, onToggleNotificationsPanel, onToggleChatToast, onSearchClick, onToggleTeamPanel, onToggleConversationsPanel }) => {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-zinc-900/50 backdrop-blur-lg border-b border-zinc-700/50 sticky top-0 z-20">
      <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 lg:hidden" aria-label="Toggle sidebar">
        <MenuIcon className="h-6 w-6" />
      </button>
      <div className="relative flex-1 max-w-md ml-4 lg:ml-0">
          <button onClick={onSearchClick} className="w-full h-10 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-500 flex items-center gap-3 hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
              <SearchIcon className="h-5 w-5" />
              Search KPIs, reports...
              <kbd className="ml-auto pointer-events-none hidden h-6 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-1.5 font-mono text-xs font-medium text-zinc-400 opacity-100 sm:flex">
                  <span className="text-lg">⌘</span>K
              </kbd>
          </button>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button onClick={onToggleTeamPanel} className="relative p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200" aria-label="Team">
            <UsersIcon className="h-6 w-6" />
        </button>
        <button onClick={onToggleConversationsPanel} className="relative p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200" aria-label="Conversations">
            <MessageSquareIcon className="h-6 w-6" />
        </button>
        <button onClick={onToggleChatToast} className="relative p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200" aria-label="Open AI Assistant">
            <SparklesIcon className="h-6 w-6" />
        </button>
        <button onClick={onToggleNotificationsPanel} className="relative p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200" aria-label="Notifications">
            <BellIcon className="h-6 w-6" />
        </button>
        <button onClick={onToggleUserPanel} className="p-1 rounded-full hover:bg-zinc-800/60" aria-label="User menu">
            <UserIcon className="h-8 w-8 text-zinc-400 bg-zinc-700 rounded-full p-1" />
        </button>
      </div>
    </header>
  );
}

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  setPage: (page: Page) => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onToggleChatToast: () => void;
  activeContentSection: ContentSection;
  setActiveContentSection: (section: ContentSection) => void;
  onSearchClick: () => void;
  activeTeamId: string;
  setActiveTeamId: (id: string) => void;
  setViewedProfileId: (id: number | null) => void;
  onStartDm: (memberId: number) => void;
  onOpenConversationToast: (channelId: string) => void;
}

export default function Layout({ 
  children,
  activePage, 
  setPage, 
  chatSessions,
  activeChatId,
  setActiveChatId,
  onNewChat,
  onDeleteChat,
  onToggleChatToast,
  activeContentSection,
  setActiveContentSection,
  onSearchClick,
  activeTeamId,
  setActiveTeamId,
  setViewedProfileId,
  onStartDm,
  onOpenConversationToast,
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isTeamPanelOpen, setIsTeamPanelOpen] = useState(false);
  const [isConversationsPanelOpen, setIsConversationsPanelOpen] = useState(false);
  
  const userPanelRef = useRef<HTMLDivElement>(null);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);
  const teamPanelRef = useRef<HTMLDivElement>(null);
  const conversationsPanelRef = useRef<HTMLDivElement>(null);

  useClickOutside(userPanelRef, () => setIsUserPanelOpen(false));
  useClickOutside(notificationsPanelRef, () => setIsNotificationsPanelOpen(false));
  useClickOutside(teamPanelRef, () => setIsTeamPanelOpen(false));
  useClickOutside(conversationsPanelRef, () => setIsConversationsPanelOpen(false));
  
  const handleToggleUserPanel = () => {
    setIsUserPanelOpen(prev => !prev);
    setIsNotificationsPanelOpen(false);
    setIsTeamPanelOpen(false);
    setIsConversationsPanelOpen(false);
  }

  const handleToggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen(prev => !prev);
    setIsUserPanelOpen(false);
    setIsTeamPanelOpen(false);
    setIsConversationsPanelOpen(false);
  }

  const handleToggleTeamPanel = () => {
    setIsTeamPanelOpen(prev => !prev);
    setIsUserPanelOpen(false);
    setIsNotificationsPanelOpen(false);
    setIsConversationsPanelOpen(false);
  }

  const handleToggleConversationsPanel = () => {
      setIsConversationsPanelOpen(prev => !prev);
      setIsUserPanelOpen(false);
      setIsNotificationsPanelOpen(false);
      setIsTeamPanelOpen(false);
  }
  
  const handleGoToConversations = () => {
      setPage('conversations');
      setIsConversationsPanelOpen(false);
  };

  const handleOpenToastAndClosePanel = (channelId: string) => {
    onOpenConversationToast(channelId);
    setIsConversationsPanelOpen(false);
  };

  const handleViewProfile = (memberId: number) => {
    setViewedProfileId(memberId);
    setPage('profile');
    setIsTeamPanelOpen(false);
  };

  return (
    <div className="flex h-screen bg-zinc-900">
       {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          aria-hidden="true"
        />
      )}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activePage={activePage} 
        setPage={setPage} 
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onNewChat={onNewChat}
        onDeleteChat={onDeleteChat}
        activeContentSection={activeContentSection}
        setActiveContentSection={setActiveContentSection}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="relative">
            <Header 
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                onToggleUserPanel={handleToggleUserPanel}
                onToggleNotificationsPanel={handleToggleNotificationsPanel}
                onToggleTeamPanel={handleToggleTeamPanel}
                onToggleConversationsPanel={handleToggleConversationsPanel}
                onToggleChatToast={onToggleChatToast}
                onSearchClick={onSearchClick}
            />
            {isUserPanelOpen && <UserPanel ref={userPanelRef} onGoToFullscreen={() => { setViewedProfileId(null); setPage('profile'); setIsUserPanelOpen(false); }} />}
            {isNotificationsPanelOpen && <NotificationsPanel ref={notificationsPanelRef} onGoToFullscreen={() => { setPage('notifications'); setIsNotificationsPanelOpen(false); }} />}
            {isTeamPanelOpen && <TeamPanel 
                ref={teamPanelRef} 
                activeTeamId={activeTeamId}
                setActiveTeamId={setActiveTeamId}
                onGoToFullscreen={() => { setPage('team-management'); setIsTeamPanelOpen(false); }}
                setPage={setPage}
                onViewProfile={handleViewProfile}
                onStartDm={onStartDm}
             />}
            {isConversationsPanelOpen && <ConversationsPanel ref={conversationsPanelRef} onGoToFullscreen={handleGoToConversations} onOpenConversationToast={handleOpenToastAndClosePanel} />}
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}

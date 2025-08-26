


import React, { useState, useEffect, useRef, forwardRef } from 'react';
import type { Page, ChatSession, ContentSection } from './types';
import { MenuIcon, BellIcon, UserIcon, UsersIcon, SearchIcon, MoebiusIcon, ChevronLeftIcon, ChevronDownIcon, DatabaseIcon, MessageSquareIcon, EditIcon, FolderIcon, FolderPlusIcon, Trash2Icon, SparklesIcon, BriefcaseIcon, ShapesIcon, TagIcon, PaletteIcon, LibraryIcon, ChevronRightIcon } from './components/Icons';
import UserPanel from './components/UserPanel';
import NotificationsPanel from './components/NotificationsPanel';
import TeamPanel from './components/TeamPanel';
import ConversationsPanel from './components/ConversationsPanel';
import { NavItemData, navigationData } from './navigation';

// Helper hook to get the previous value of a state or prop
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const FlyoutMenuItem: React.FC<{
  item: NavItemData;
  activePage: Page;
  setPage: (page: Page) => void;
  closeAllFlyouts: () => void;
}> = ({ item, activePage, setPage, closeAllFlyouts }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = item.page === activePage || (item.subItems || []).some(sub => sub.page === activePage);

  const handleClick = () => {
    if (!item.subItems || (item.subItems && item.page)) {
      setPage(item.page);
    }
    closeAllFlyouts();
  };

  if (!item.subItems) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
          isActive ? 'text-violet-300 bg-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
        }`}
      >
        {item.label}
      </button>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        className={`flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
          isActive ? 'text-violet-300 bg-zinc-700' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
        }`}
      >
        <span>{item.label}</span>
        <ChevronRightIcon className="h-4 w-4 ml-2" />
      </button>
      {isHovered && (
        <div className="absolute left-full -top-1 w-52 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 z-50 animate-fade-in-fast">
          <div className="p-1">
            {item.subItems.map(sub => (
              <FlyoutMenuItem
                key={sub.page}
                item={sub}
                activePage={activePage}
                setPage={setPage}
                closeAllFlyouts={closeAllFlyouts}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{
  icon?: React.FC<{className?: string}>;
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
  
  if (!isSidebarOpen) {
    return (
      <div className="h-full relative group">
        <button
          onClick={handleClick}
          className={`flex items-center w-full rounded-lg text-left transition-colors duration-200 ${
            isActive
              ? 'bg-violet-500/20 text-violet-300'
              : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
          } h-full flex-col flex-1 justify-center py-2`}
          aria-current={isActive ? 'page' : undefined}
        >
          {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        </button>
        <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2 py-1 bg-zinc-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {label}
        </div>
      </div>
    );
  }
  
  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full rounded-lg text-left transition-colors duration-200 ${
        isActive
          ? 'bg-violet-500/20 text-violet-300'
          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
      } ${isSidebarOpen ? 'h-12 px-4' : 'h-full flex-col flex-1 justify-center py-2'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className={`overflow-hidden text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        isSidebarOpen ? `w-auto opacity-100 ${Icon ? 'ml-4' : ''}` : 'w-0 opacity-0 h-0'
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
  openCollapsedMenu: Page | null;
  setOpenCollapsedMenu: (page: Page | null) => void;
  level?: number;
}> = ({ item, activePage, setPage, isSidebarOpen, setIsSidebarOpen, openCollapsedMenu, setOpenCollapsedMenu, level = 0 }) => {
    const isParentActive = item.page === activePage || (item.subItems || []).some(sub => sub.page === activePage || (sub.subItems || []).some(s => s.page === activePage));
    const [isOpen, setIsOpen] = useState(isParentActive);
    
    useEffect(() => {
        if (isParentActive && isSidebarOpen) {
            setIsOpen(true);
        }
    }, [isParentActive, isSidebarOpen]);

    const handleParentClick = () => {
        if (!isSidebarOpen) {
          setOpenCollapsedMenu(openCollapsedMenu === item.page ? null : item.page);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleMainButtonClick = () => {
        if (item.isMenuOnly) {
            setIsOpen(!isOpen);
        } else {
            setPage(item.page);
        }
    };
    
    const Icon = item.icon;

    if (!isSidebarOpen) {
      return (
          <div 
              className="h-full relative group"
          >
              <button
                  onClick={handleParentClick}
                  className={`flex items-center w-full rounded-lg text-left transition-colors duration-200 ${
                      isParentActive ? 'text-violet-300' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  } h-full flex-col flex-1 justify-center py-2`}
              >
                  {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
              </button>
              <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2 py-1 bg-zinc-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
              {openCollapsedMenu === item.page && item.subItems && (
                  <div className="absolute left-full ml-2 top-0 py-2 w-52 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 z-50 animate-fade-in-fast">
                      <div className="px-4 py-1 text-sm font-semibold text-white">{item.label}</div>
                      <div className="mt-1 p-1">
                          {(item.subItems || []).map(subItem => (
                               <FlyoutMenuItem
                                  key={subItem.page}
                                  item={subItem}
                                  activePage={activePage}
                                  setPage={setPage}
                                  closeAllFlyouts={() => setOpenCollapsedMenu(null)}
                               />
                          ))}
                      </div>
                  </div>
              )}
          </div>
      )
    }

    return (
        <div style={level > 0 ? { paddingLeft: '1rem' } : {}}>
            <div
                className={`flex items-center w-full h-12 rounded-lg text-left transition-colors duration-200 
                    ${isParentActive ? 'bg-zinc-800/50 text-violet-300' : 'text-zinc-400'}`}
            >
                <button
                    onClick={handleMainButtonClick}
                    className="flex items-center flex-1 min-w-0 h-full text-left px-4 rounded-l-lg hover:bg-zinc-700/30 transition-colors"
                    aria-label={item.label}
                >
                    {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                    <span className={`flex-1 w-auto opacity-100 ${Icon ? 'ml-4' : ''} overflow-hidden text-sm font-medium whitespace-nowrap`}>
                        {item.label}
                    </span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    className="p-1 h-full px-2 rounded-r-lg hover:bg-zinc-700/50 transition-colors"
                    aria-label={`Toggle ${item.label} section`}
                    aria-expanded={isOpen}
                >
                    <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {isOpen && isSidebarOpen && (
                <div className="pt-1 space-y-1">
                    {(item.subItems || []).map(subItem => (
                      subItem.subItems ? (
                        <CollapsibleNavItem 
                            key={subItem.page} 
                            item={subItem} 
                            activePage={activePage} 
                            setPage={setPage} 
                            isSidebarOpen={isSidebarOpen} 
                            setIsSidebarOpen={setIsSidebarOpen}
                            openCollapsedMenu={openCollapsedMenu}
                            setOpenCollapsedMenu={setOpenCollapsedMenu}
                            level={level + 1}
                        />
                      ) : (
                         <button
                            key={subItem.page}
                            onClick={() => setPage(subItem.page)}
                            className={`flex items-center w-full h-9 px-4 rounded-md text-left text-sm transition-colors duration-200 ${
                                activePage === subItem.page ? 'text-white bg-zinc-800/70' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                            style={{ paddingLeft: `${1 + (level + 1) * 1}rem` }}
                            aria-current={activePage === subItem.page ? 'page' : undefined}
                          >
                            {subItem.icon 
                                ? <subItem.icon className="h-5 w-5 mr-4 flex-shrink-0" />
                                : <span className="w-1.5 h-1.5 rounded-full bg-current mr-4 flex-shrink-0"></span>
                            }
                            {subItem.label}
                        </button>
                      )
                    ))}
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
    <div className={!isSidebarOpen ? 'h-full relative group' : ''}>
      <div className={`flex items-center w-full rounded-lg text-left transition-colors duration-200 text-zinc-400 hover:bg-zinc-800/60 ${isSidebarOpen ? 'h-12 px-4' : 'h-full'}`}>
        <button
          onClick={handleToggleCategory}
          className={`flex items-center flex-1 h-full min-w-0 ${isSidebarOpen ? '' : 'flex-col flex-1 justify-center py-2'}`}
          aria-expanded={isOpen}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className={`overflow-hidden text-sm font-medium transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? 'flex-1 w-auto opacity-100 ml-4' : 'w-0 opacity-0 h-0'}`}>
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
      {!isSidebarOpen && (
        <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2 py-1 bg-zinc-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {label}
        </div>
      )}
      {isOpen && isSidebarOpen && (
        <div className="pl-6 pt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

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
  activeContentSection: ContentSection;
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
  setActiveContentSection,
}) => {
  const [openCollapsedMenu, setOpenCollapsedMenu] = useState<Page | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenCollapsedMenu(null);
      }
    };
    
    if (!isSidebarOpen && openCollapsedMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, openCollapsedMenu]);
  
  useEffect(() => {
    if (isSidebarOpen) {
      setOpenCollapsedMenu(null);
    }
  }, [isSidebarOpen]);

  const contentSections = [
    { id: 'platform', icon: BriefcaseIcon, label: 'Platform' },
    { id: 'coordination', icon: ShapesIcon, label: 'Coordination' },
    { id: 'studio', icon: SparklesIcon, label: 'Studio' },
    { id: 'marketplace', icon: TagIcon, label: 'Marketplace' },
  ] as const;

  return (
    <aside ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-zinc-900/70 backdrop-blur-xl border-r border-zinc-700/50 z-30 w-64 transition-transform duration-300 ease-in-out lg:transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center h-16 px-4 border-b border-zinc-700/50 flex-shrink-0 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
           <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                <MoebiusIcon className="h-8 w-8 text-white flex-shrink-0" />
                <span className="font-bold text-lg text-white whitespace-nowrap">Moebius</span>
           </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hidden lg:inline-flex">
            <ChevronLeftIcon className={`h-5 w-5 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>
        
        <div className={`p-2 border-b border-zinc-700/50 flex ${isSidebarOpen ? 'flex-col gap-2' : 'flex-col gap-2'}`}>
            <div className={`flex ${isSidebarOpen ? 'gap-2' : 'flex-col gap-2'}`}>
              {contentSections.map(section => (
                  <button
                      key={section.id}
                      onClick={() => setActiveContentSection(section.id)}
                      title={isSidebarOpen ? '' : section.label}
                      className={`flex-1 flex items-center justify-center p-2.5 rounded-lg transition-colors duration-200 ${
                          activeContentSection === section.id
                              ? 'bg-violet-500/20 text-violet-300'
                              : 'text-zinc-400 hover:bg-zinc-800/60'
                      }`}
                  >
                      <section.icon className="h-5 w-5" />
                  </button>
              ))}
            </div>
        </div>


        <nav className={`flex-1 p-2 sidebar-nav ${isSidebarOpen ? 'overflow-y-auto space-y-1' : 'flex flex-col'}`}>
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

            {(navigationData[activeContentSection] || []).map((section, sectionIndex) => (
                <div key={section.label || `section-${sectionIndex}`}>
                  {section.label && isSidebarOpen && (
                    <h3 className="px-4 pt-4 pb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{section.label}</h3>
                  )}
                  <div className={isSidebarOpen ? 'space-y-1' : 'flex flex-col'}>
                    {section.items.map(item => (
                      item.subItems ? (
                        <CollapsibleNavItem key={item.page} item={item} activePage={activePage} setPage={setPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} openCollapsedMenu={openCollapsedMenu} setOpenCollapsedMenu={setOpenCollapsedMenu} />
                      ) : (
                        <NavItem key={item.page} {...item} activePage={activePage} setPage={setPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                      )
                    ))}
                  </div>
                </div>
            ))}

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

interface HeaderProps {
  onToggleSidebar: () => void;
  onHeaderButtonToggle: (panel: 'user' | 'notifications' | 'team' | 'conversations') => void;
  onNavigate: (page: Page) => void;
  onToggleAiChat: () => void;
  onSearchClick: () => void;
  isRightPanelOpen: boolean;
  aiChatInterfaceStyle: 'panel' | 'toast';
  buttonRefs: {
      user: React.RefObject<HTMLButtonElement>;
      notifications: React.RefObject<HTMLButtonElement>;
      team: React.RefObject<HTMLButtonElement>;
      conversations: React.RefObject<HTMLButtonElement>;
  };
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onHeaderButtonToggle, onNavigate, onToggleAiChat, onSearchClick, isRightPanelOpen, aiChatInterfaceStyle, buttonRefs }) => {
  
  const ActionIcons: React.FC = () => (
    <>
        <button ref={buttonRefs.team} onClick={() => onHeaderButtonToggle('team')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="Team">
            <UsersIcon className="h-5 w-5" />
        </button>
        <button ref={buttonRefs.conversations} onClick={() => onHeaderButtonToggle('conversations')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="Conversations">
            <MessageSquareIcon className="h-5 w-5" />
        </button>
        <button ref={buttonRefs.notifications} onClick={() => onHeaderButtonToggle('notifications')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="Notifications">
            <BellIcon className="h-5 w-5" />
        </button>
        <button ref={buttonRefs.user} onClick={() => onHeaderButtonToggle('user')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="User menu">
          <UserIcon className="h-5 w-5" />
        </button>
    </>
  );

  return (
    <header className="relative flex items-center justify-between h-16 px-4 md:px-6 bg-zinc-900/50 backdrop-blur-lg border-b border-zinc-700/50 sticky top-0 z-20">
      <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 lg:hidden" aria-label="Toggle sidebar">
        <MenuIcon className="h-5 w-5" />
      </button>

      {/* Main search bar */}
      <div className={`relative flex-1 min-w-0 max-w-2xl ml-2 sm:ml-4 lg:ml-0 transition-opacity duration-300 ${isRightPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button onClick={onSearchClick} className="w-full h-10 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-500 flex items-center gap-3 hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
              <SearchIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Search KPIs, reports...</span>
              <kbd className="ml-auto pointer-events-none hidden h-6 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-1.5 font-mono text-xs font-medium text-zinc-400 opacity-100 sm:flex">
                  <span className="text-lg">⌘</span>K
              </kbd>
          </button>
      </div>
      
      {/* Centered icons when panel is open */}
      <div className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 transition-opacity duration-300 ${isRightPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button onClick={onSearchClick} className="p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="Search">
              <SearchIcon className="h-5 w-5" />
          </button>
          <button onClick={() => onHeaderButtonToggle('team')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="Team"><UsersIcon className="h-5 w-5" /></button>
          <button onClick={() => onHeaderButtonToggle('conversations')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="Conversations"><MessageSquareIcon className="h-5 w-5" /></button>
          <button onClick={() => onHeaderButtonToggle('notifications')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="Notifications"><BellIcon className="h-5 w-5" /></button>
          <button onClick={() => onHeaderButtonToggle('user')} className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors" aria-label="User menu"><UserIcon className="h-5 w-5" /></button>
      </div>
      
      {/* Right-aligned icons */}
      <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
        {/* Regular icon group, hidden when panel is open */}
        <div className={`items-center gap-1 sm:gap-2 transition-opacity duration-300 ${isRightPanelOpen ? 'hidden' : 'flex'}`}>
            <ActionIcons />
        </div>
        
        {aiChatInterfaceStyle === 'panel' && !isRightPanelOpen && (
          <button onClick={onToggleAiChat} className="p-2 -ml-2 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200">
              <ChevronLeftIcon className="h-5 w-5 transition-transform duration-300 rotate-180" />
          </button>
        )}
      </div>
    </header>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  setPage: (page: Page) => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onToggleAiChat: () => void;
  onSearchClick: () => void;
  activeTeamId: string;
  setActiveTeamId: (id: string) => void;
  setViewedProfileId: (id: number | null) => void;
  onStartDm: (memberId: number) => void;
  onOpenConversationToast: (channelId: string) => void;
  isKpiSentimentColoringEnabled: boolean;
  setIsKpiSentimentColoringEnabled: (enabled: boolean) => void;
  aiChatInterfaceStyle: 'panel' | 'toast';
  setAiChatInterfaceStyle: (style: 'panel' | 'toast') => void;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (isOpen: boolean) => void;
  rightPanelWidth: number;
  isResizing: boolean;
  activeContentSection: ContentSection;
  setActiveContentSection: (section: ContentSection) => void;
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
  onToggleAiChat,
  onSearchClick,
  activeTeamId,
  setActiveTeamId,
  setViewedProfileId,
  onStartDm,
  onOpenConversationToast,
  isKpiSentimentColoringEnabled,
  setIsKpiSentimentColoringEnabled,
  aiChatInterfaceStyle,
  setAiChatInterfaceStyle,
  isRightPanelOpen,
  setIsRightPanelOpen,
  rightPanelWidth,
  isResizing,
  activeContentSection,
  setActiveContentSection
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<'user' | 'notifications' | 'team' | 'conversations' | null>(null);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number } | null>(null);
  
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const teamButtonRef = useRef<HTMLButtonElement>(null);
  const conversationsButtonRef = useRef<HTMLButtonElement>(null);
  
  const userPanelRef = useRef<HTMLDivElement>(null);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);
  const teamPanelRef = useRef<HTMLDivElement>(null);
  const conversationsPanelRef = useRef<HTMLDivElement>(null);

  const prevIsRightPanelOpen = usePrevious(isRightPanelOpen);

  useEffect(() => {
    // If the right panel was just opened (changed from false to true)
    // and we are using the panel UI style, then minimize the sidebar.
    if (isRightPanelOpen && !prevIsRightPanelOpen && aiChatInterfaceStyle === 'panel') {
      setIsSidebarOpen(false);
    }
  }, [isRightPanelOpen, prevIsRightPanelOpen, aiChatInterfaceStyle]);

  const handleToggleHeaderPanel = (panel: 'user' | 'notifications' | 'team' | 'conversations') => {
    setActiveHeaderPanel(prev => {
        const next = prev === panel ? null : panel;
        
        if (next) {
            let buttonRef: React.RefObject<HTMLButtonElement> | null = null;
            let panelWidth = 0;
            switch (next) {
                case 'user': buttonRef = userButtonRef; panelWidth = 416; break;
                case 'notifications': buttonRef = notificationsButtonRef; panelWidth = 480; break;
                case 'team': buttonRef = teamButtonRef; panelWidth = 416; break;
                case 'conversations': buttonRef = conversationsButtonRef; panelWidth = 352; break;
            }

            if (buttonRef?.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const top = rect.bottom + 12;
                let left = rect.left + rect.width / 2 - panelWidth / 2;
                if (left < 8) left = 8;
                if (left + panelWidth > window.innerWidth - 8) {
                    left = window.innerWidth - panelWidth - 8;
                }
                setPanelPosition({ top, left });
            } else {
                setPanelPosition(null);
            }
        } else {
            setPanelPosition(null);
        }
        
        return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (!activeHeaderPanel) return;

        const buttonRefs = { user: userButtonRef, notifications: notificationsButtonRef, team: teamButtonRef, conversations: conversationsButtonRef };
        const panelRefs = { user: userPanelRef, notifications: notificationsPanelRef, team: teamPanelRef, conversations: conversationsPanelRef };
        
        const activeButtonRef = buttonRefs[activeHeaderPanel];
        const activePanelRef = panelRefs[activeHeaderPanel];
        
        if (activeButtonRef.current && !activeButtonRef.current.contains(event.target as Node) && activePanelRef.current && !activePanelRef.current.contains(event.target as Node)) {
            setActiveHeaderPanel(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeHeaderPanel]);


  const handleNavigate = (page: Page) => {
      setPage(page);
      setActiveHeaderPanel(null);
  };
  
  const handleGoToConversations = () => {
      handleNavigate('conversations');
  };

  const handleOpenToastAndClosePanel = (channelId: string) => {
    onOpenConversationToast(channelId);
    setActiveHeaderPanel(null);
  };

  const handleViewProfile = (memberId: number) => {
    setViewedProfileId(memberId);
    handleNavigate('profile');
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
      <div 
        className={`main-content-wrapper flex-1 flex flex-col min-w-0 overflow-x-hidden ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ${isRightPanelOpen && aiChatInterfaceStyle === 'panel' ? 'panel-open' : ''} ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}`}
        style={{ '--right-panel-width': `${rightPanelWidth}px` } as React.CSSProperties}
      >
        <div className="relative">
            <Header
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onHeaderButtonToggle={handleToggleHeaderPanel}
                onNavigate={handleNavigate}
                onToggleAiChat={onToggleAiChat}
                onSearchClick={onSearchClick}
                isRightPanelOpen={isRightPanelOpen}
                aiChatInterfaceStyle={aiChatInterfaceStyle}
                buttonRefs={{
                    user: userButtonRef,
                    notifications: notificationsButtonRef,
                    team: teamButtonRef,
                    conversations: conversationsButtonRef,
                }}
            />
            {activeHeaderPanel === 'user' && <UserPanel ref={userPanelRef} position={panelPosition} onGoToFullscreen={() => { setViewedProfileId(null); handleNavigate('profile'); }} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} setIsKpiSentimentColoringEnabled={setIsKpiSentimentColoringEnabled} aiChatInterfaceStyle={aiChatInterfaceStyle} setAiChatInterfaceStyle={setAiChatInterfaceStyle} />}
            {activeHeaderPanel === 'notifications' && <NotificationsPanel ref={notificationsPanelRef} position={panelPosition} onGoToFullscreen={() => { handleNavigate('notifications'); }} />}
            {activeHeaderPanel === 'team' && <TeamPanel 
                ref={teamPanelRef}
                position={panelPosition}
                activeTeamId={activeTeamId}
                setActiveTeamId={setActiveTeamId}
                onGoToFullscreen={() => { handleNavigate('team-management'); }}
                setPage={setPage}
                onViewProfile={handleViewProfile}
                onStartDm={onStartDm}
             />}
            {activeHeaderPanel === 'conversations' && <ConversationsPanel ref={conversationsPanelRef} position={panelPosition} onGoToFullscreen={handleGoToConversations} onOpenConversationToast={handleOpenToastAndClosePanel} />}
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
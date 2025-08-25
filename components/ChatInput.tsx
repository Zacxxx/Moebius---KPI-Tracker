import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { SendIcon, PaperclipIcon, BookmarkIcon, GitBranchIcon, FileTextIcon, FolderIcon, SettingsIcon, UsersIcon, CubeIcon, CheckSquareIcon, TargetIcon, FilterOffIcon, PlusIcon, CodeIcon } from './Icons';
import { slashCommands, SlashCommand } from './chat/slashCommands';
import { SlashCommandSuggestions } from './chat/SlashCommandSuggestions';
import { AttachedContext } from './chat/AttachedContext';
import type { WidgetContext, Bookmark } from '../types';
import { ActionButton } from './chat/ActionButton';
import { BookmarksPanel } from './chat/BookmarksPanel';
import { ActionPanel } from './chat/ActionPanel';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    isMessageQueued: boolean;
    getAppContextData?: (command: string) => string;
    widgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
    context: 'full' | 'panel' | 'toast';
    // Props for internal panel handling
    bookmarks: Bookmark[];
    setActiveChatId: (id: string) => void;
    onMaximize?: () => void;
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

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onToggle: () => void; }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-400 cursor-pointer" onClick={onToggle}>{label}</label>
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                enabled ? 'bg-violet-600' : 'bg-zinc-700'
            }`}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
            />
        </button>
    </div>
);

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    isLoading,
    isMessageQueued,
    getAppContextData,
    widgetContexts,
    onRemoveWidgetContext,
    onClearWidgetContexts,
    context,
    bookmarks,
    setActiveChatId,
    onMaximize,
}) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const [attachedContexts, setAttachedContexts] = useState<Array<{ command: SlashCommand; data: string }>>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [commandPath, setCommandPath] = useState<SlashCommand[]>([]);
    const [commandQuery, setCommandQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const panelContainerRef = useRef<HTMLDivElement>(null);
    useClickOutside(panelContainerRef, () => setActivePanel(null));

    const [isAutoPilotOn, setIsAutoPilotOn] = useState(false);
    const [isAsyncOn, setIsAsyncOn] = useState(false);

    const activeCommandList = commandPath.length > 0 ? commandPath[commandPath.length - 1].subCommands || [] : slashCommands;
    
    const filteredCommands = activeCommandList.filter(cmd => 
        cmd.title.toLowerCase().includes(commandQuery.toLowerCase())
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${Math.min(scrollHeight, 160)}px`;
        }
    }, [inputValue]);
    
    useEffect(() => {
        setSelectedIndex(0);
    }, [commandQuery, commandPath]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.startsWith('/')) {
            setShowSuggestions(true);
            setCommandQuery(value.substring(1));
        } else {
            setShowSuggestions(false);
            setCommandPath([]);
            setCommandQuery('');
        }
    };
    
    const handleSelectCommand = (command: SlashCommand) => {
        if (command.subCommands && command.subCommands.length > 0) {
            setCommandPath(prev => [...prev, command]);
            setInputValue('/');
            setCommandQuery('');
        } else {
            if (getAppContextData) {
                const data = getAppContextData(command.id);
                if (!attachedContexts.some(ctx => ctx.command.id === command.id)) {
                    setAttachedContexts(prev => [...prev, { command, data }]);
                }
            }
            setInputValue('');
            setShowSuggestions(false);
            setCommandPath([]);
            setCommandQuery('');
        }
        textareaRef.current?.focus();
    };
    
    const handleBack = () => {
        setCommandPath(prev => prev.slice(0, -1));
        setInputValue('/');
        setCommandQuery('');
        textareaRef.current?.focus();
    };

    const handleRemoveContext = (commandId: string) => {
        setAttachedContexts(prev => prev.filter(ctx => ctx.command.id !== commandId));
    };

    const handleSend = () => {
        const allContexts = [
            ...attachedContexts.map(c => ({ title: c.command.title, data: c.data })),
            ...widgetContexts.map(c => ({ title: c.title, data: c.data }))
        ];

        if (inputValue.trim() || allContexts.length > 0) {
            let messageToSend = inputValue.trim();
            if (allContexts.length > 0) {
                const contextHeader = `Using context from: ${allContexts.map(c => `"${c.title}"`).join(', ')}.`;
                const allContextData = allContexts.map(c => `--- Context: ${c.title} ---\n${c.data}`).join('\n\n');
                 messageToSend = `${contextHeader}\n\n${allContextData}\n\n---\n\n${inputValue.trim()}`;
            }
            onSend(messageToSend);
            setInputValue('');
            setAttachedContexts([]);
            onClearWidgetContexts();
            setShowSuggestions(false);
            setCommandPath([]);
            setCommandQuery('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showSuggestions && filteredCommands.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                handleSelectCommand(filteredCommands[selectedIndex]);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowSuggestions(false);
            }
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSend();
        } else if (e.key === 'Backspace' && inputValue === '/' && commandPath.length > 0) {
            e.preventDefault();
            handleBack();
        }
    };
    
    const handleSlashButtonClick = () => {
        setInputValue('/');
        setShowSuggestions(true);
        textareaRef.current?.focus();
    };

    return (
        <div className="relative" ref={panelContainerRef}>
            <div className="absolute bottom-full mb-2 w-full px-3 z-10">
                {activePanel === 'bookmark' && (
                    <BookmarksPanel
                        bookmarks={bookmarks}
                        onSelectBookmark={(sessionId) => {
                            setActiveChatId(sessionId);
                            if (onMaximize) onMaximize();
                            setActivePanel(null);
                        }}
                    />
                )}
                 {(context === 'full' || context === 'panel') && activePanel === 'parameters' && (
                    <ActionPanel title="AI Parameters" icon={SettingsIcon}>
                        <div className="p-4 text-sm text-zinc-400">Set system instructions and parameters.</div>
                    </ActionPanel>
                )}
                {(context === 'full' || context === 'panel') && activePanel === 'participants' && (
                     <ActionPanel title="Participants" icon={UsersIcon}>
                        <div className="p-4 text-sm text-zinc-400">You and the AI assistant.</div>
                    </ActionPanel>
                )}
            </div>
            
            <div className="p-3 bg-zinc-900 border-t border-zinc-700/50">
                {showSuggestions && (
                    <SlashCommandSuggestions
                        commands={filteredCommands}
                        onSelect={handleSelectCommand}
                        selectedIndex={selectedIndex}
                        path={commandPath}
                        onBack={handleBack}
                    />
                )}
                {(attachedContexts.length > 0 || widgetContexts.length > 0) && (
                    <div className="px-1 pb-2 flex flex-wrap gap-2">
                        {attachedContexts.map(ctx => (
                            <AttachedContext
                                key={ctx.command.id}
                                title={ctx.command.title}
                                icon={ctx.command.icon}
                                onRemove={() => handleRemoveContext(ctx.command.id)}
                            />
                        ))}
                        {widgetContexts.map(ctx => (
                            <AttachedContext
                                key={ctx.id}
                                title={ctx.title}
                                icon={ctx.icon}
                                onRemove={() => onRemoveWidgetContext(ctx.id)}
                            />
                        ))}
                    </div>
                )}
                <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2">
                    <div className="flex items-center gap-1 flex-wrap pb-2 mb-2 border-b border-zinc-700/50 animate-fade-in-fast">
                        <ActionButton label="Attach File" onClick={() => alert('Attach file clicked')}><PaperclipIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="Branch" onClick={() => alert('Branch clicked')}><GitBranchIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="Bookmark" onClick={() => setActivePanel(activePanel === 'bookmark' ? null : 'bookmark')}><BookmarkIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="File" onClick={() => alert('File clicked')}><FileTextIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="Folder" onClick={() => alert('Folder clicked')}><FolderIcon className="h-4 w-4"/></ActionButton>
                        <div className="w-px h-5 bg-zinc-700 mx-1" />
                        <ActionButton label="Parameters" onClick={() => context === 'toast' ? alert('Parameters unavailable in toast.') : setActivePanel(activePanel === 'parameters' ? null : 'parameters')}><SettingsIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="Participants" onClick={() => context === 'toast' ? alert('Participants unavailable in toast.') : setActivePanel(activePanel === 'participants' ? null : 'participants')}><UsersIcon className="h-4 w-4"/></ActionButton>
                        <div className="w-px h-5 bg-zinc-700 mx-1" />
                        <ActionButton label="Cube" onClick={() => alert('Cube clicked')}><CubeIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="Tasks" onClick={() => alert('Tasks clicked')}><CheckSquareIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="Target" onClick={() => alert('Target clicked')}><TargetIcon className="h-4 w-4"/></ActionButton>
                        <ActionButton label="Filter Off" onClick={() => alert('Filter Off clicked')}><FilterOffIcon className="h-4 w-4"/></ActionButton>
                    </div>
                    <div className="relative flex items-end gap-2">
                        <div className="relative flex-1">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                placeholder={isMessageQueued ? "Message queued..." : isLoading ? "Generating response..." : "Type your message..."}
                                className="w-full resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 py-2.5 pl-1 pr-3 focus:outline-none min-h-[52px] max-h-[160px]"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                disabled={isMessageQueued}
                            />
                        </div>
                         <Button 
                            size="default" 
                            className="h-10 px-4 flex-shrink-0 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-400"
                            onClick={handleSend}
                            disabled={(!inputValue.trim() && attachedContexts.length === 0 && widgetContexts.length === 0) || isMessageQueued}
                            aria-label="Send message"
                        >
                            <SendIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between mt-1 pt-2 px-1 border-t border-zinc-800">
                    <div className="flex items-center gap-1">
                        <ActionButton label="Commands" onClick={handleSlashButtonClick}>
                            <CodeIcon className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton label="Attach file" onClick={() => alert('Attach file clicked')}>
                            <FileTextIcon className="h-4 w-4" />
                        </ActionButton>
                    </div>
                    <div className="flex items-center gap-3">
                        <ToggleSwitch label="Auto-pilot" enabled={isAutoPilotOn} onToggle={() => setIsAutoPilotOn(p => !p)} />
                        <ToggleSwitch label="Async" enabled={isAsyncOn} onToggle={() => setIsAsyncOn(p => !p)} />
                    </div>
                </div>
            </div>
        </div>
    );
};
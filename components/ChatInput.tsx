import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from './ui/Button';
import { SendIcon, PaperclipIcon, BookmarkIcon, GitBranchIcon, FileTextIcon, FolderIcon, SettingsIcon, UsersIcon, CubeIcon, CheckSquareIcon, TargetIcon, FilterOffIcon, PlusIcon, CodeIcon } from './Icons';
import { contextCommands, SlashCommand } from './chat/contextCommands';
import { actionCommands, ActionCommand } from './chat/actionCommands';
import { SlashCommandSuggestions } from './chat/SlashCommandSuggestions';
import { AttachedContext } from './chat/AttachedContext';
import type { WidgetContext, Bookmark } from '../types';
import { ActionButton } from './chat/ActionButton';
import { BookmarksPanel } from './chat/BookmarksPanel';
import { ActionPanel } from './chat/ActionPanel';
import { AttachmentsPanel } from './chat/AttachmentsPanel';
import { CommandMenuPanel } from './chat/CommandMenuPanel';
import { allNavItems } from '../../navigation';
import { ContextWindowIndicator } from './chat/ContextWindowIndicator';


interface ChatInputProps {
    onSend: (payload: { displayText: string, promptText: string }) => void;
    isLoading: boolean;
    isMessageQueued: boolean;
    getAppContextData?: (command: string) => string;
    widgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
    context: 'full' | 'panel' | 'toast';
    bookmarks: Bookmark[];
    setActiveChatId: (id: string) => void;
    onMaximize?: () => void;
    actions: { [key: string]: (arg?: any) => void };
    contextPercentage: number;
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
    actions,
    contextPercentage,
}) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const [activeTrigger, setActiveTrigger] = useState<'@' | '/' | null>(null);
    const [mentionStartIndex, setMentionStartIndex] = useState<number>(0);

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

    const activeContextCommandList = commandPath.length > 0 ? commandPath[commandPath.length - 1].subCommands || [] : contextCommands;
    
    const filteredContextCommands = activeContextCommandList.filter(cmd => 
        cmd.title.toLowerCase().includes(commandQuery.toLowerCase())
    );
    
    const filteredActionCommands = actionCommands.filter(cmd =>
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
        const cursorPos = e.target.selectionStart;
        setInputValue(value);

        // Check for "/" command at the start
        if (value.startsWith('/')) {
            const query = value.substring(1);
            if (!query.includes(' ')) {
                setActiveTrigger('/');
                setShowSuggestions(true);
                setCommandQuery(query);
                setCommandPath([]);
                return;
            }
        }

        // Check for "@" mention
        const textBeforeCursor = value.substring(0, cursorPos);
        const atIndex = textBeforeCursor.lastIndexOf('@');
        if (atIndex !== -1) {
            const query = textBeforeCursor.substring(atIndex + 1);
            if (!/\s/.test(query)) {
                setActiveTrigger('@');
                setShowSuggestions(true);
                setCommandQuery(query);
                setMentionStartIndex(atIndex);
                return;
            }
        }
        
        setActiveTrigger(null);
        setShowSuggestions(false);
        setCommandQuery('');
        setCommandPath([]);
    };
    
    const handleSelectContextCommand = (command: SlashCommand) => {
        if (command.subCommands && command.subCommands.length > 0) {
            setCommandPath(prev => [...prev, command]);
            setCommandQuery('');
        } else {
            if (getAppContextData) {
                const data = getAppContextData(command.id);
                if (!attachedContexts.some(ctx => ctx.command.id === command.id)) {
                    setAttachedContexts(prev => [...prev, { command, data }]);
                }

                const cursorPosition = textareaRef.current?.selectionStart ?? inputValue.length;
                const textBeforeMention = inputValue.substring(0, mentionStartIndex);
                const textAfterMention = inputValue.substring(cursorPosition);
                
                const separator = (textBeforeMention.length > 0 && !textBeforeMention.endsWith(' ')) ? ' ' : '';
                const newValue = textBeforeMention + separator + textAfterMention;
                setInputValue(newValue);

                setTimeout(() => {
                    const newCursorPos = mentionStartIndex + separator.length;
                    textareaRef.current?.focus();
                    textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
            }
        }
        setShowSuggestions(false);
        setActiveTrigger(null);
        setCommandPath([]);
        setCommandQuery('');
        textareaRef.current?.focus();
    };

    const handleSelectActionCommand = (command: ActionCommand) => {
        setInputValue(`/${command.title} `);
        setShowSuggestions(false);
        setActiveTrigger(null);
        textareaRef.current?.focus();
    };
    
    const handleBack = () => {
        setCommandPath(prev => prev.slice(0, -1));
        setCommandQuery('');
        textareaRef.current?.focus();
    };

    const handleRemoveContext = (commandId: string) => {
        setAttachedContexts(prev => prev.filter(ctx => ctx.command.id !== commandId));
    };

    const getContextsForPrompt = (contexts: WidgetContext[]): { title: string, data: string }[] => {
        return contexts.flatMap(context => {
            if (context.type === 'dashboard' && context.children) {
                const childrenData = context.children.map(child => 
                    `--- Widget: ${child.title} ---\n${child.data}`
                ).join('\n\n');
                return [{
                    title: context.title,
                    data: `${context.data}\n\n${childrenData}`
                }];
            }
            return [{ title: context.title, data: context.data }];
        });
    };

    const handleExecuteCommand = () => {
        const [command, ...args] = inputValue.trim().substring(1).split(' ');
        const action = actions[command];

        if (command === 'clear-context') {
            setAttachedContexts([]);
            onClearWidgetContexts();
            return;
        }

        if (action) {
            let param: any = args.join(' ');
            if (command === 'kpi-colors') {
                param = param === 'on';
            } else if (command === 'goto') {
                const page = allNavItems.find(p => p.label.toLowerCase() === param.toLowerCase());
                if (page) action(page.page);
                else alert(`Page not found: ${param}`);
                return;
            }
            action(param);
        } else {
            // Send as a message if command is not found
            onSend({ displayText: inputValue, promptText: inputValue });
        }
    };

    const handleSend = () => {
        if (inputValue.trim().startsWith('/')) {
            handleExecuteCommand();
            setInputValue('');
            return;
        }

        const displayText = inputValue.trim();
        const processedWidgetContexts = getContextsForPrompt(widgetContexts);
        const allContexts = [
            ...attachedContexts.map(c => ({ title: c.command.title, data: c.data })),
            ...processedWidgetContexts
        ];

        if (displayText || allContexts.length > 0) {
            let promptText = displayText;
            if (allContexts.length > 0) {
                const contextHeader = `Using context from: ${allContexts.map(c => `"${c.title}"`).join(', ')}.`;
                const allContextData = allContexts.map(c => `--- Context: ${c.title} ---\n${c.data}`).join('\n\n');
                 promptText = `${contextHeader}\n\n${allContextData}\n\n---\n\n${displayText}`;
            }
            onSend({ displayText, promptText });
            setInputValue('');
            setAttachedContexts([]);
            onClearWidgetContexts();
            setShowSuggestions(false);
            setCommandPath([]);
            setCommandQuery('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showSuggestions) {
            const commands = activeTrigger === '/' ? filteredActionCommands : filteredContextCommands;
            if (e.key === 'ArrowDown' && commands.length > 0) {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % commands.length);
            } else if (e.key === 'ArrowUp' && commands.length > 0) {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + commands.length) % commands.length);
            } else if ((e.key === 'Enter' || e.key === 'Tab') && commands.length > 0) {
                e.preventDefault();
                if (activeTrigger === '/') {
                    handleSelectActionCommand(filteredActionCommands[selectedIndex]);
                } else if (activeTrigger === '@') {
                    handleSelectContextCommand(filteredContextCommands[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowSuggestions(false);
                setActiveTrigger(null);
                setCommandPath([]);
            } else if (e.key === 'Backspace' && commandQuery === '' && commandPath.length > 0) {
                e.preventDefault();
                handleBack();
            }
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    const allContexts = useMemo<WidgetContext[]>(() => [
        ...widgetContexts,
        ...attachedContexts.map(c => ({
            id: c.command.id,
            title: c.command.title,
            icon: c.command.icon,
            data: c.data,
            type: 'widget' as const
        }))
    ], [widgetContexts, attachedContexts]);

    const handleRemoveAnyContext = (id: string) => {
        onRemoveWidgetContext(id);
        handleRemoveContext(id);
    };

    const handleCommandMenuSelect = (commandString: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        setInputValue(commandString);
        setActivePanel(null);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(commandString.length, commandString.length);
            const mockEvent = { target: textarea } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(mockEvent);
        }, 0);
    };


    return (
        <div className="relative" ref={panelContainerRef}>
            <div className="absolute bottom-full mb-2 w-full px-3 z-10">
                {activePanel === 'command-menu' && <CommandMenuPanel onSelect={handleCommandMenuSelect} />}
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
                {activePanel === 'attachments' && (
                    <AttachmentsPanel
                        contexts={allContexts}
                        onRemoveContext={handleRemoveAnyContext}
                    />
                )}
            </div>
            
            <div className="p-3 bg-zinc-900 border-t border-zinc-700/50">
                {showSuggestions && (
                    <SlashCommandSuggestions
                        commands={activeTrigger === '/' ? filteredActionCommands : filteredContextCommands}
                        onSelect={activeTrigger === '/' ? handleSelectActionCommand : handleSelectContextCommand}
                        selectedIndex={selectedIndex}
                        path={commandPath}
                        onBack={handleBack}
                        trigger={activeTrigger}
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
                                placeholder={isMessageQueued ? "Message queued..." : isLoading ? "Generating response..." : "Type your message, / for commands, or @ to attach..."}
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
                            disabled={!inputValue.trim() && attachedContexts.length === 0 && widgetContexts.length === 0}
                            aria-label="Send message"
                        >
                            <SendIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between mt-1 pt-2 px-1 border-t border-zinc-800">
                    <div className="flex items-center gap-3">
                        { (context === 'full' || context === 'panel') && <ContextWindowIndicator percentage={contextPercentage} onClick={() => alert('Context manager clicked')} /> }
                        <div className="flex items-center gap-1">
                            <ActionButton label="Commands" onClick={() => setActivePanel(activePanel === 'command-menu' ? null : 'command-menu')}>
                                <CodeIcon className="h-4 w-4" />
                            </ActionButton>
                            <ActionButton label="Attach file" onClick={() => alert('Attach file clicked')}>
                                <FileTextIcon className="h-4 w-4" />
                            </ActionButton>
                            <ActionButton label="View Attachments" onClick={() => setActivePanel(activePanel === 'attachments' ? null : 'attachments')}>
                                <FolderIcon className={`h-4 w-4 ${allContexts.length > 0 ? 'text-violet-400' : ''}`} />
                            </ActionButton>
                        </div>
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

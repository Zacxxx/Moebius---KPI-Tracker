
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { SendIcon, PaperclipIcon } from './Icons';
import { slashCommands, SlashCommand } from './chat/slashCommands';
import { SlashCommandSuggestions } from './chat/SlashCommandSuggestions';
import { AttachedContext } from './chat/AttachedContext';
import type { WidgetContext } from '../types';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    isMessageQueued: boolean;
    getAppContextData?: (command: string) => string;
    widgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, isMessageQueued, getAppContextData, widgetContexts, onRemoveWidgetContext, onClearWidgetContexts }) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const [attachedContexts, setAttachedContexts] = useState<Array<{ command: SlashCommand; data: string }>>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [commandPath, setCommandPath] = useState<SlashCommand[]>([]);
    const [commandQuery, setCommandQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const activeCommandList = commandPath.length > 0 ? commandPath[commandPath.length - 1].subCommands || [] : slashCommands;
    
    const filteredCommands = activeCommandList.filter(cmd => 
        cmd.title.toLowerCase().includes(commandQuery.toLowerCase())
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${Math.min(scrollHeight, 130)}px`;
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
            setAttachedContexts([]); // clear local slash command contexts
            onClearWidgetContexts(); // clear parent widget contexts
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

    return (
        <div className="p-4 border-t border-zinc-700/50 bg-zinc-900 relative">
            {showSuggestions && (
                <SlashCommandSuggestions
                    commands={filteredCommands}
                    onSelect={handleSelectCommand}
                    selectedIndex={selectedIndex}
                    path={commandPath}
                    onBack={handleBack}
                />
            )}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-2 flex flex-col gap-2">
                {(attachedContexts.length > 0 || widgetContexts.length > 0) && (
                    <div className="px-1 pt-1 flex flex-wrap gap-2">
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
                <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" aria-label="Attach file">
                        <PaperclipIcon className="h-5 w-5 text-zinc-400"/>
                    </Button>
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder={isMessageQueued ? "Message queued..." : isLoading ? "Generating response..." : "Type your message... (Ctrl+Enter to send)"}
                        className="w-full resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 py-2 px-1 focus:outline-none max-h-[130px]"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isMessageQueued}
                    />
                    <Button 
                        size="icon" 
                        className="h-9 w-9 flex-shrink-0 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800"
                        onClick={handleSend}
                        disabled={(!inputValue.trim() && attachedContexts.length === 0 && widgetContexts.length === 0) || isMessageQueued}
                        aria-label="Send message"
                    >
                        <SendIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
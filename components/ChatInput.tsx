
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { SendIcon, PaperclipIcon } from './Icons';
import { slashCommands, SlashCommand } from './chat/slashCommands';
import { SlashCommandSuggestions } from './chat/SlashCommandSuggestions';
import { AttachedContext } from './chat/AttachedContext';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    getAppContextData?: (command: string) => string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, getAppContextData }) => {
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
        if ((inputValue.trim() || attachedContexts.length > 0) && !isLoading) {
            let messageToSend = inputValue.trim();
            if (attachedContexts.length > 0) {
                const contextHeader = `Using context from: ${attachedContexts.map(c => `"${c.command.title}"`).join(', ')}.`;
                const allContextData = attachedContexts.map(c => `--- Context: ${c.command.title} ---\n${c.data}`).join('\n\n');
                 messageToSend = `${contextHeader}\n\n${allContextData}\n\n---\n\n${inputValue.trim()}`;
            }
            onSend(messageToSend);
            setInputValue('');
            setAttachedContexts([]);
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
        } else if (e.key === 'Enter' && !e.shiftKey) {
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
                {attachedContexts.length > 0 && (
                    <div className="px-1 pt-1 flex flex-wrap gap-2">
                        {attachedContexts.map(ctx => (
                            <AttachedContext
                                key={ctx.command.id}
                                command={ctx.command}
                                onRemove={handleRemoveContext}
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
                        placeholder={isLoading ? "Generating response..." : "Type your message or / for commands..."}
                        className="w-full resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 py-2 px-1 focus:outline-none max-h-[130px]"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <Button 
                        size="icon" 
                        className="h-9 w-9 flex-shrink-0 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800"
                        onClick={handleSend}
                        disabled={(!inputValue.trim() && attachedContexts.length === 0) || isLoading}
                        aria-label="Send message"
                    >
                        <SendIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

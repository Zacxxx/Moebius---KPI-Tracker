
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { SendIcon, PaperclipIcon, BookmarkIcon } from './Icons';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    onToggleBookmarksPanel: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, onToggleBookmarksPanel }) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleSend = () => {
        if (inputValue.trim() && !isLoading) {
            onSend(inputValue);
            setInputValue('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t border-zinc-700/50">
            <div className="relative flex items-end gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0" aria-label="Attach file">
                    <PaperclipIcon className="h-5 w-5 text-zinc-400"/>
                </Button>
                 <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0" onClick={onToggleBookmarksPanel} aria-label="View bookmarks">
                    <BookmarkIcon className="h-5 w-5 text-zinc-400"/>
                </Button>
                <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder={isLoading ? "Generating response..." : "Ask me anything..."}
                    className="w-full resize-none bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 max-h-[130px]"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <Button 
                    variant="ghost"
                    size="icon" 
                    className="h-10 w-10 flex-shrink-0"
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send message"
                >
                    <SendIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

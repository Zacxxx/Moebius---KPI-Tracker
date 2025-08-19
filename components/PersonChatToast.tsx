import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, Maximize2Icon, MinusIcon, SendIcon } from './Icons';
import type { ConversationChannel, ConversationMessage, ConversationUser } from '../types';
import { initialConversationUsers } from '../data';

const UserAvatar: React.FC<{ user: ConversationUser | undefined, size?: 'sm' | 'md' }> = ({ user, size = 'md' }) => {
    const sizes = {
        sm: { container: 'h-5 w-5', text: 'text-xs' },
        md: { container: 'h-9 w-9', text: 'text-base' }
    };
    const s = sizes[size];

    if (!user) return <div className={`${s.container} rounded-full bg-zinc-700`} />;
    
    return (
        <div className="relative flex-shrink-0">
             <div className={`${s.container} rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold ${s.text}`}>
                {user.name.split(' ').map(n=>n[0]).join('')}
            </div>
        </div>
    );
};

const MessageBubble: React.FC<{ message: ConversationMessage }> = ({ message }) => {
    const isCurrentUser = message.userId === 1; // Assuming current user is John Doe (ID 1)
    const user = initialConversationUsers.find(u => u.id === message.userId);

    if (isCurrentUser) {
        return (
            <div className="flex justify-end">
                <div className="bg-violet-600 text-white rounded-2xl rounded-br-lg px-3 py-2 text-sm max-w-xs">
                    {message.text}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2">
            <UserAvatar user={user} size="sm" />
            <div className="bg-zinc-700 text-zinc-100 rounded-2xl rounded-bl-lg px-3 py-2 text-sm max-w-xs">
                {message.text}
            </div>
        </div>
    );
};

interface PersonChatToastProps {
    channel: ConversationChannel;
    messages: ConversationMessage[];
    onSend: (message: string) => void;
    onClose: () => void;
    onMaximize: () => void;
    isMinimized: boolean;
    setIsMinimized: (minimized: boolean) => void;
    style?: React.CSSProperties;
}

export const PersonChatToast: React.FC<PersonChatToastProps> = ({
    channel,
    messages,
    onSend,
    onClose,
    onMaximize,
    isMinimized,
    setIsMinimized,
    style,
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (!isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(scrollToBottom, [messages, isMinimized]);
    
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200); // Wait for animation
    };

    const handleSend = () => {
        if (inputValue.trim()) {
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
        <div 
            style={style}
            className={`fixed bottom-6 z-40 w-[24rem] max-w-[calc(100vw-3rem)] transition-all duration-200 ease-in-out ${isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
            <Card className="h-[60vh] max-h-[600px] flex flex-col shadow-2xl shadow-black/40 border-zinc-700/50">
                <CardHeader className="flex flex-row items-center justify-between !py-2 !px-3 border-b border-zinc-700/50">
                     <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        {channel.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-7 w-7" aria-label="Minimize chat">
                            <MinusIcon className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onMaximize} className="h-7 w-7" aria-label="Maximize chat">
                            <Maximize2Icon className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleClose} className="h-7 w-7" aria-label="Close chat">
                            <XIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
                     {messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>

                <div className="p-2 border-t border-zinc-700/50">
                    <div className="relative flex items-center gap-2">
                        <textarea
                            rows={1}
                            placeholder={`Message ${channel.name}...`}
                            className="w-full resize-none bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-violet-500 max-h-[100px]"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button 
                            variant="ghost"
                            size="icon" 
                            className="h-9 w-9 flex-shrink-0"
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            aria-label="Send message"
                        >
                            <SendIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};


import React, { useEffect, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, SparklesIcon } from './Icons';
import { ChatMessage, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { Message, WidgetContext } from '../types';

interface ConversationScreenProps {
    messages: Message[];
    isLoading: boolean;
    isMessageQueued: boolean;
    // Fix: Updated onSend prop to accept a payload object to match ChatInput's expectation.
    onSend: (payload: { displayText: string; promptText: string; }) => void;
    onRegenerate: (messageId: number) => void;
    onClose: () => void;
    widgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
    // Fix: Add actions prop to be passed to ChatInput
    actions: { [key: string]: (arg?: any) => void };
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({
    messages,
    isLoading,
    isMessageQueued,
    onSend,
    onRegenerate,
    onClose,
    widgetContexts,
    onRemoveWidgetContext,
    onClearWidgetContexts,
    // Fix: Destructure actions from props
    actions,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // FIX: Calculate contextPercentage based on the messages prop.
    const contextPercentage = useMemo(() => {
        // Approximation of token usage. Assume 20k chars is max for a more dynamic visual.
        const charCount = JSON.stringify(messages).length;
        return Math.min(100, (charCount / 20000) * 100);
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-3xl h-[90vh] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between !py-3 !px-4">
                    <CardTitle className="flex items-center gap-2">
                        <SparklesIcon className="h-5 w-5 text-violet-400" />
                        AI Assistant
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="Close full screen chat">
                        <XIcon className="h-5 w-5"/>
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 pt-6 sm:p-6 sm:pt-8 space-y-6">
                    {messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} onRegenerate={onRegenerate} onToggleBookmark={() => {}} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </CardContent>
                <ChatInput 
                    onSend={onSend} 
                    isLoading={isLoading}
                    isMessageQueued={isMessageQueued}
                    widgetContexts={widgetContexts}
                    onRemoveWidgetContext={onRemoveWidgetContext}
                    onClearWidgetContexts={onClearWidgetContexts}
                    context="full"
                    bookmarks={[]}
                    setActiveChatId={() => {}}
                    // Fix: Pass actions prop to ChatInput
                    actions={actions}
                    // FIX: Pass the contextPercentage prop to the ChatInput component.
                    contextPercentage={contextPercentage}
                />
            </Card>
        </div>
    );
};

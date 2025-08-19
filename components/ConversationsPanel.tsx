
import React, { forwardRef } from 'react';
import { CardHeader, CardTitle, CardContent } from './ui/Card';
import { MessageSquareIcon } from './Icons';
import { HeaderPanel } from './ui/HeaderPanel';

const ConversationsPanel = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <HeaderPanel ref={ref} className="right-28 w-[24rem] max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquareIcon className="h-5 w-5" />
                    Conversations
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-zinc-500">
                    <p>People-to-people chat is coming soon.</p>
                </div>
            </CardContent>
        </HeaderPanel>
    );
});

export default ConversationsPanel;

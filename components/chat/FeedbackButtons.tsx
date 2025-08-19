import React, { useState } from 'react';
import { ThumbsUpIcon, ThumbsDownIcon } from '../Icons';
import { ActionButton } from './ActionButton';

export const FeedbackButtons: React.FC = () => {
    const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

    return (
        <>
            <ActionButton label="Good response" onClick={() => setFeedback(prev => prev === 'like' ? null : 'like')}>
                <ThumbsUpIcon className={`h-4 w-4 transition-colors ${feedback === 'like' ? 'text-violet-400' : ''}`} />
            </ActionButton>
            <ActionButton label="Bad response" onClick={() => setFeedback(prev => prev === 'dislike' ? null : 'dislike')}>
                <ThumbsDownIcon className={`h-4 w-4 transition-colors ${feedback === 'dislike' ? 'text-violet-400' : ''}`} />
            </ActionButton>
        </>
    );
};
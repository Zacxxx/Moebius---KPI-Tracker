import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { WidgetContext } from '../../types';
import { Button } from '../ui/Button';
import { XIcon, ChevronDownIcon, ChevronRightIcon } from '../Icons';

const AttachmentItem: React.FC<{ context: WidgetContext; onRemove: (id: string) => void; isChild?: boolean }> = ({ context, onRemove, isChild = false }) => {
    const Icon = context.icon;
    return (
        <div className={`flex items-center gap-2 ${isChild ? 'pl-4' : ''}`}>
            <Icon className="h-4 w-4 text-zinc-400 flex-shrink-0" />
            <span className="text-sm text-zinc-200 truncate flex-1" title={context.title}>{context.title}</span>
            {!isChild && (
                <Button variant="ghost" size="icon" onClick={() => onRemove(context.id)} className="h-6 w-6" aria-label={`Remove ${context.title}`}>
                    <XIcon className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
};

const DashboardAttachmentItem: React.FC<{ context: WidgetContext; onRemove: (id: string) => void; }> = ({ context, onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = context.icon;

    return (
        <div className="bg-zinc-800/50 rounded-lg p-2 space-y-2">
            <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(p => !p)} className="flex items-center gap-2 flex-1 text-left p-1 -m-1 rounded">
                    {isOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                    <Icon className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-semibold text-zinc-100 truncate">{context.title}</span>
                </button>
                <Button variant="ghost" size="icon" onClick={() => onRemove(context.id)} className="h-6 w-6" aria-label={`Remove ${context.title}`}>
                    <XIcon className="h-3.5 w-3.5" />
                </Button>
            </div>
            {isOpen && context.children && (
                <div className="border-t border-zinc-700/50 pt-2 space-y-1">
                    {context.children.map(child => (
                        <AttachmentItem key={child.id} context={child} onRemove={() => {}} isChild={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface AttachmentsPanelProps {
    contexts: WidgetContext[];
    onRemoveContext: (id: string) => void;
}

export const AttachmentsPanel: React.FC<AttachmentsPanelProps> = ({ contexts, onRemoveContext }) => {
    return (
        <div className="z-50">
            <Card className="overflow-hidden shadow-2xl shadow-black/40 border-zinc-700/30">
                <CardHeader className="!py-3">
                    <CardTitle className="text-base">Attached Context</CardTitle>
                </CardHeader>
                <CardContent className="!p-2 max-h-80 overflow-y-auto space-y-2">
                    {contexts.length > 0 ? (
                        contexts.map(context => 
                            context.type === 'dashboard' ? (
                                <DashboardAttachmentItem key={context.id} context={context} onRemove={onRemoveContext} />
                            ) : (
                                <AttachmentItem key={context.id} context={context} onRemove={onRemoveContext} />
                            )
                        )
                    ) : (
                        <p className="text-sm text-zinc-500 text-center p-4">No attachments.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

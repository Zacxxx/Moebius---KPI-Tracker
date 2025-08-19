import React, { useEffect } from 'react';
import { XIcon } from '../Icons';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
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
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div className="relative w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <Card className="border-violet-500/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle id="modal-title">{title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
                            <XIcon className="h-5 w-5"/>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

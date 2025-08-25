import React from 'react';
import { SettingsIcon, MessageSquareIcon } from '../Icons';
import { CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface WidgetHeaderProps {
  title: string;
  subtitle?: string;
  onConfigure?: () => void;
  onCite?: () => void;
  isConfigurable?: boolean;
  children?: React.ReactNode;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title, subtitle, onConfigure, onCite, isConfigurable = true, children }) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        {subtitle ? (
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-none text-zinc-100">{title}</h2>
            <p className="text-xs text-zinc-400 font-normal truncate mt-1">{subtitle}</p>
          </div>
        ) : (
          <CardTitle>{title || 'Untitled Widget'}</CardTitle>
        )}
      </div>
      
      {isConfigurable && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 pb-1">
            <div className="flex items-center gap-1">
                {children}
                {onCite && (
                  <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full" onClick={onCite} aria-label="Cite widget in chat">
                    <MessageSquareIcon className="h-3 w-3" /> 
                  </Button>
                )}
                {onConfigure && (
                  <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full" onClick={onConfigure} aria-label="Configure widget">
                    <SettingsIcon className="h-3 w-3" />
                  </Button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
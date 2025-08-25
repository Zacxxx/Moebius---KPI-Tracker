import React from 'react';
import { SettingsIcon, MessageSquareIcon } from '../Icons';
import { CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface WidgetHeaderProps {
  title: string;
  onConfigure: () => void;
  onCite?: () => void;
  isConfigurable?: boolean;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title, onConfigure, onCite, isConfigurable = true }) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle>{title || 'Untitled Widget'}</CardTitle>
      {isConfigurable && (
        <div className="flex items-center">
            {onCite && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCite} aria-label="Cite widget in chat">
                <MessageSquareIcon className="h-4 w-4" /> 
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onConfigure} aria-label="Configure widget">
              <SettingsIcon className="h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { SettingsIcon } from '../Icons';
import { CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface WidgetHeaderProps {
  title: string;
  onConfigure: () => void;
  isConfigurable?: boolean;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title, onConfigure, isConfigurable = true }) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle>{title || 'Untitled Widget'}</CardTitle>
      {isConfigurable && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onConfigure} aria-label="Configure widget">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

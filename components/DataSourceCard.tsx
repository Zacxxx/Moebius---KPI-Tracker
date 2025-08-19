import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { DatabaseIcon } from './Icons';
import { ConnectPanel } from './ConnectPanel';

export const DataSourceCard: React.FC<{ title: string }> = ({ title }) => {
  const [showConnectPanel, setShowConnectPanel] = useState(false);
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button onClick={() => setShowConnectPanel(true)}>+ Connect Source</Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DatabaseIcon className="mx-auto h-12 w-12 text-zinc-600" />
            <h3 className="mt-4 text-lg font-medium text-zinc-300">No Data Sources Connected</h3>
            <p className="mt-1 text-sm text-zinc-500">Connect to a source like Airtable or upload a CSV to see your KPIs.</p>
          </div>
        </CardContent>
      </Card>
      {showConnectPanel && <ConnectPanel onClose={() => setShowConnectPanel(false)} />}
    </>
  );
};

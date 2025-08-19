
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';

export default function SystemStatus() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Status</h1>
        <p className="text-zinc-400 mt-1">Monitor real-time system health and uptime.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-zinc-500">
            <p>Real-time system status will be displayed here.</p>
            <p className="text-xs mt-1">This could include API latency, server status, and error rates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

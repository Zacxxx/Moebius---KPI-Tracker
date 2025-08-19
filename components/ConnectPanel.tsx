import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { DatabaseIcon, UploadCloudIcon, XIcon } from './Icons';
import { Label } from './ui/Label';
import { Input } from './ui/Input';

export const ConnectPanel: React.FC<{onClose: () => void}> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                 <Card className="border-violet-500/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Connect a New Data Source</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
                            <XIcon className="h-5 w-5"/>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-zinc-400">Select a service to connect to your dashboard. This is a UI demonstration.</p>
                        
                        <div className="space-y-3">
                            <button className="w-full text-left p-4 rounded-lg border border-zinc-700 hover:border-violet-500 bg-zinc-800/50 flex items-center gap-4 transition-colors">
                                <DatabaseIcon className="h-6 w-6 text-violet-400" />
                                <div>
                                    <h3 className="font-medium text-white">Connect Airtable</h3>
                                    <p className="text-xs text-zinc-400">Sync KPIs directly from your Airtable base.</p>
                                </div>
                            </button>
                             <button className="w-full text-left p-4 rounded-lg border border-zinc-700 hover:border-emerald-500 bg-zinc-800/50 flex items-center gap-4 transition-colors">
                                <UploadCloudIcon className="h-6 w-6 text-emerald-400" />
                                <div>
                                    <h3 className="font-medium text-white">Upload CSV</h3>
                                    <p className="text-xs text-zinc-400">Manually upload data from a spreadsheet.</p>
                                </div>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apiKey">Airtable API Key (Example)</Label>
                            <Input id="apiKey" type="password" placeholder="••••••••••••••••••••••" />
                            <p className="text-xs text-zinc-500">
                                For security, API keys should be managed on a backend server. This input is for demonstration purposes only.
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                            {/* TODO: Implement backend service to securely handle API keys and fetch data from Airtable. */}
                            <Button onClick={() => alert('This would connect to the backend.')}>Connect</Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
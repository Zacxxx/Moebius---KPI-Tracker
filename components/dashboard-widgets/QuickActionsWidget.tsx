import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlusCircleIcon, MegaphoneIcon, FileTextIcon } from '../Icons';

export const QuickActionsWidget: React.FC = () => {
    return (
        <Card className="h-full">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
                <Button variant="secondary" onClick={() => alert('Add new product')}>
                    <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Product
                </Button>
                <Button variant="secondary" onClick={() => alert('Launch campaign')}>
                    <MegaphoneIcon className="w-4 h-4 mr-2" /> Launch New Campaign
                </Button>
                 <Button variant="secondary" onClick={() => alert('Generate report')}>
                    <FileTextIcon className="w-4 h-4 mr-2" /> Generate Report
                </Button>
            </CardContent>
        </Card>
    );
};
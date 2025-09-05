import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { Input } from './ui/Input';

export interface MissingDataField {
    name: string;
    description: string;
}

interface MissingDataInputProps {
    fields: MissingDataField[];
    formula: string;
    explanation: string;
    onSubmit: (data: Record<string, string>) => void;
    onCancel: () => void;
}

export const MissingDataInput: React.FC<MissingDataInputProps> = ({ fields, formula, explanation, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isFormValid = fields.every(field => formData[field.name] && formData[field.name].trim() !== '');

    return (
        <Card className="animate-fade-in-fast border-violet-500/30">
            <CardHeader>
                <CardTitle>Additional Data Required</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <Label>Explanation</Label>
                        <p className="text-sm text-zinc-300 mt-1">{explanation}</p>
                    </div>

                    <div>
                        <Label>Formula</Label>
                        <pre className="bg-zinc-900 rounded-lg p-3 mt-1 font-mono text-sm text-violet-300 border border-zinc-700 overflow-x-auto">
                            <code>{formula}</code>
                        </pre>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-700/50">
                        <p className="text-sm text-zinc-400">Please provide the missing values below to continue.</p>
                        {fields.map(field => (
                            <div key={field.name} className="space-y-1.5">
                                <Label htmlFor={field.name}>{field.description}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={e => handleChange(field.name, e.target.value)}
                                    placeholder={`Enter value for ${field.description}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-zinc-700/50">
                        <Button type="button" variant="secondary" onClick={() => alert('API Connect functionality is coming soon.')} className="w-full sm:w-auto">API Connect</Button>
                        <div className="flex gap-3 w-full sm:w-auto">
                           <Button type="button" variant="secondary" onClick={onCancel} className="w-full">Cancel</Button>
                           <Button type="submit" disabled={!isFormValid} className="w-full">Continue Generation</Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
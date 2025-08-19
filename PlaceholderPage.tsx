import React from 'react';
import { Card, CardContent } from './components/ui/Card';
import { PaletteIcon } from './components/Icons';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-lg w-full">
        <CardContent className="p-10 text-center">
            <PaletteIcon className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-zinc-400 mt-2">{description}</p>
            <p className="text-xs text-zinc-500 mt-4">This page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface MessagePreviewProps {
  content: string;
  title: string;
}

export function MessagePreview({ content, title }: MessagePreviewProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-4 h-4" />
        <h3 className="font-semibold">Preview</h3>
      </div>
      
      <div className="prose prose-sm max-w-none">
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <div className="whitespace-pre-wrap">{content || 'No content yet'}</div>
      </div>
    </Card>
  );
}
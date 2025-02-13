'use client';

import { Badge } from '@/components/ui/badge';

interface MessageMetadataProps {
  type: 'email' | 'newsletter';
  metadata: {
    delivered?: boolean;
    openRate?: number;
    clickRate?: number;
  };
}

export function MessageMetadata({ type, metadata }: MessageMetadataProps) {
  if (!metadata) return null;

  return (
    <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
      {metadata.delivered && (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Delivered
        </Badge>
      )}
      {metadata.openRate !== undefined && (
        <span>Open Rate: {metadata.openRate}%</span>
      )}
      {metadata.clickRate !== undefined && (
        <span>Click Rate: {metadata.clickRate}%</span>
      )}
    </div>
  );
}
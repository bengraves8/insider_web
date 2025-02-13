'use client';

import { Video, Image as ImageIcon, FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: number;
  url: string;
}

interface AttachedMediaProps {
  media: MediaFile[];
  onPreview: (media: MediaFile) => void;
}

export function AttachedMedia({ media, onPreview }: AttachedMediaProps) {
  const getMediaIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {media.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-2 p-2 border rounded-lg bg-background"
        >
          {getMediaIcon(file.type)}
          <span className="text-sm font-medium">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            ({formatFileSize(file.size)})
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPreview(file)}
          >
            {file.type === 'document' ? (
              <Download className="w-4 h-4" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
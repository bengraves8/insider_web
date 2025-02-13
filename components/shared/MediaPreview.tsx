'use client';

import { Video, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: number;
  url: string;
}

interface MediaPreviewProps {
  media: MediaFile | null;
  onClose: () => void;
}

export function MediaPreview({ media, onClose }: MediaPreviewProps) {
  const getMediaIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-12 h-12" />;
      case 'video':
        return <Video className="w-12 h-12" />;
      case 'document':
        return <FileText className="w-12 h-12" />;
    }
  };

  if (!media) return null;

  return (
    <Dialog open={!!media} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            {getMediaIcon(media.type)}
            {media.name}
          </DialogTitle>
        </DialogHeader>
        <div className="relative p-4">
          {media.type === 'image' ? (
            <img
              src={media.url}
              alt={media.name}
              className="max-h-[80vh] w-auto mx-auto rounded-lg"
            />
          ) : media.type === 'video' ? (
            <video
              src={media.url}
              controls
              className="max-h-[80vh] w-auto mx-auto rounded-lg"
            />
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download {media.name}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
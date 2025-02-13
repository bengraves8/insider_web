'use client';

import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessagePreviewPanelProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
  previewMessage?: {
    content: string;
    media?: {
      type: string;
      url: string;
    };
  };
}

export function MessagePreviewPanel({ content, isOpen, onClose, previewMessage }: MessagePreviewPanelProps) {
  if (!isOpen) return null;

  // Show live preview of what user is typing
  const messageContent = content || "Start typing to preview your message...";

  return (
    <div className="fixed right-0 top-14 bottom-0 w-[400px] bg-card border-l shadow-lg animate-in slide-in-from-right">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Live Preview</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-center">
            <div className="w-[300px] h-[600px] bg-black rounded-[50px] p-3 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-b-[20px] z-10"></div>
              <div className="w-full h-full bg-white rounded-[40px] overflow-hidden relative">
                <div className="h-12 bg-gray-100 flex items-center justify-between px-4 border-b">
                  <div className="text-sm font-medium">Messages</div>
                  <div className="text-sm text-gray-500">{format(new Date(), 'h:mm a')}</div>
                </div>
                <div className="p-4">
                  <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] ml-auto">
                    {messageContent.split('\n').map((line, i) => (
                      <p key={i} className="text-sm">
                        {line}
                        {i < messageContent.split('\n').length - 1 && <br />}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 border-t flex items-center px-4">
                  <div className="flex-1 h-8 bg-white rounded-full border"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
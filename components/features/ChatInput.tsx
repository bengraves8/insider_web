'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, ChevronDown, X, FileText, Film, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const sources = [
  { 
    id: 'insider', 
    label: 'Insider Inbox',
    icon: <img 
      src="https://app.stakd.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstacked-messenger.appspot.com%2F64385c08dd77ed2330fab5fd%2Flogo%2F673c9ca0f42e1ce5fd619d87.png&w=96&q=75" 
      alt="Insider Inbox" 
      className="w-4 h-4 mr-2" 
    />
  },
  { 
    id: 'gpt4', 
    label: 'ChatGPT 4.0', 
    icon: <img 
      src="https://static.vecteezy.com/system/resources/previews/021/059/827/original/chatgpt-logo-chat-gpt-icon-on-white-background-free-vector.jpg" 
      alt="ChatGPT" 
      className="w-4 h-4 mr-2 object-contain" 
    />
  },
  { 
    id: 'salesforce', 
    label: 'Salesforce', 
    icon: <img 
      src="https://logos-world.net/wp-content/uploads/2020/10/Salesforce-Logo.png" 
      alt="Salesforce" 
      className="w-4 h-4 mr-2 object-contain" 
    />
  },
  { 
    id: 'pipedrive', 
    label: 'Pipedrive', 
    icon: <img 
      src="https://w7.pngwing.com/pngs/379/205/png-transparent-pipedrive-app-logo-tech-companies-thumbnail.png" 
      alt="Pipedrive" 
      className="w-4 h-4 mr-2 object-contain" 
    />
  },
  { 
    id: 'teamworks', 
    label: 'Teamworks', 
    icon: <img 
      src="https://play-lh.googleusercontent.com/uEbrrKJCzy3G5z9gPLg3NBI4cd4jhbhtMNz6HWFnhtcUcnALdRAKrFgWlSnLcvuAUg" 
      alt="Teamworks" 
      className="w-4 h-4 mr-2 object-contain" 
    />
  },
];

interface ChatInputProps {
  onSend: (message: string, sources: string[], file?: File) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['insider']);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 2000;
  const baseHeight = 56; // Base height in pixels
  const maxHeight = baseHeight * 2; // Maximum height is double the base height

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = 'auto';
    
    // Set new height based on scrollHeight, capped at maxHeight
    const newHeight = Math.min(e.target.scrollHeight, maxHeight);
    e.target.style.height = `${newHeight}px`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow sending just a file without text
    if ((input.trim() || selectedFile) && selectedSources.length > 0) {
      onSend(input.trim(), selectedSources, selectedFile || undefined);
      setInput('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = `${baseHeight}px`;
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources((prev) => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      }
      return [...prev, sourceId];
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const selectedSourcesDisplay = selectedSources
    .map(id => sources.find(s => s.id === id)?.label)
    .join(', ');

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Film className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-card">
      <div className="max-w-4xl mx-auto">
        {selectedFile && (
          <div className="mb-4">
            <div className="relative rounded-lg border bg-muted p-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-start gap-4">
                {previewUrl ? (
                  selectedFile.type.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-[200px] max-h-[200px] rounded-md object-contain"
                    />
                  ) : selectedFile.type.startsWith('video/') ? (
                    <video
                      src={previewUrl}
                      controls
                      className="max-w-[200px] max-h-[200px] rounded-md"
                    />
                  ) : null
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                    {getFileIcon(selectedFile)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-2 mb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[200px] justify-between"
              >
                <span className="truncate">
                  {selectedSources.length === 0 
                    ? "Select sources" 
                    : selectedSourcesDisplay}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="grid gap-1 p-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => handleSourceToggle(source.id)}
                  >
                    <Checkbox
                      checked={selectedSources.includes(source.id)}
                      onCheckedChange={() => handleSourceToggle(source.id)}
                    />
                    <div className="flex items-center">
                      {source.icon}
                      <span>{source.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex-1 flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift + Enter for new line)"
              maxLength={maxLength}
              className="min-h-[56px] max-h-[112px] flex-1 resize-none overflow-y-auto transition-height duration-200"
              style={{ height: `${baseHeight}px` }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,application/pdf,.doc,.docx,.txt,.csv,.xlsx"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={triggerFileInput}
              className="h-[56px] w-[56px]"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button 
              type="submit" 
              className="h-[56px] w-[56px] px-0"
              disabled={selectedSources.length === 0}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <div>
            {selectedFile && !previewUrl && (
              <span className="flex items-center gap-1">
                {getFileIcon(selectedFile)}
                {selectedFile.name}
              </span>
            )}
          </div>
          <div>{input.length}/{maxLength}</div>
        </div>
      </div>
    </form>
  );
}
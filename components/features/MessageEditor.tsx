'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface MessageEditorProps {
  content: string;
  title: string;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  selectedTemplate: string | null;
  onTemplateChange: (template: string) => void;
}

const templates = [
  { id: 'blank', name: 'Blank Message' },
  { id: 'newsletter', name: 'Newsletter' },
  { id: 'announcement', name: 'Announcement' },
  { id: 'event', name: 'Event Invitation' },
];

export function MessageEditor({
  content,
  title,
  onContentChange,
  onTitleChange,
  selectedTemplate,
  onTemplateChange,
}: MessageEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Select
            value={selectedTemplate || 'blank'}
            onValueChange={onTemplateChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1">
            <Input
              placeholder="Message title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-lg font-semibold"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="flex items-center gap-1 p-2 border-b">
            <Button variant="ghost" size="sm">
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LinkIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ImageIcon className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-border mx-2" />
            <Button variant="ghost" size="sm">
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your message here..."
            className="min-h-[400px] border-0 rounded-none focus-visible:ring-0"
          />
        </div>
      </div>
    </Card>
  );
}
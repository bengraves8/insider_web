'use client';

import { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Image as ImageIcon, 
  Paperclip, 
  Send,
  Calendar,
  Clock,
  X,
  FileText,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateMessageDialogProps {
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMessageDialog({ contact, open, onOpenChange }: CreateMessageDialogProps) {
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);

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
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Film className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const handleSend = () => {
    // Here you would implement the actual message sending logic
    const messageData = {
      type: messageType,
      subject: subject,
      content: content,
      contactId: contact.id,
      file: selectedFile,
      scheduledFor: isScheduled && scheduleDate && scheduleTime
        ? new Date(`${format(scheduleDate, 'yyyy-MM-dd')}T${scheduleTime}`)
        : undefined
    };
    
    console.log('Sending message:', messageData);
    onOpenChange(false);
    
    // Reset form
    setSubject('');
    setContent('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setScheduleDate(undefined);
    setScheduleTime('');
    setIsScheduled(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Message Type Selection */}
          <div className="flex gap-4">
            <Button
              variant={messageType === 'email' ? 'default' : 'outline'}
              onClick={() => setMessageType('email')}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant={messageType === 'sms' ? 'default' : 'outline'}
              onClick={() => setMessageType('sms')}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              SMS
            </Button>
          </div>

          {/* Recipient Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>To:</span>
            <span className="font-medium text-foreground">
              {contact.firstName} {contact.lastName}
            </span>
            <span>via</span>
            <span className="font-medium text-foreground">
              {messageType === 'email' ? contact.email : contact.phone}
            </span>
          </div>

          {/* Message Content */}
          {messageType === 'email' && (
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              rows={6}
            />
          </div>

          {/* Attachment Preview */}
          {selectedFile && (
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
          )}

          {/* Schedule Options */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <Label>Schedule for later</Label>
            </div>

            {isScheduled && (
              <div className="flex flex-wrap items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !scheduleDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-[120px]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <div className="relative">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,application/pdf,.doc,.docx"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach
                </Button>
              </div>
              <Button onClick={handleSend}>
                <Send className="w-4 h-4 mr-2" />
                {isScheduled ? 'Schedule' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
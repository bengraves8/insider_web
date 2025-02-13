'use client';

import { useState } from 'react';
import { MessageSquare, Users, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UsageReport } from '@/components/features/UsageReport';

type Step = 'recipient' | 'content' | 'preview';

interface MessageData {
  recipients: string[];
  subject: string;
  content: string;
  messageType: string;
}

export default function ChatPage() {
  const [showUsageReport, setShowUsageReport] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('recipient');
  const [messageData, setMessageData] = useState<MessageData>({
    recipients: [],
    subject: '',
    content: '',
    messageType: 'direct',
  });

  const messageTypes = [
    { id: 'direct', label: 'Direct Message' },
    { id: 'broadcast', label: 'Broadcast' },
    { id: 'announcement', label: 'Announcement' },
    { id: 'newsletter', label: 'Newsletter' },
  ];

  const handleNext = () => {
    if (currentStep === 'recipient') setCurrentStep('content');
    else if (currentStep === 'content') setCurrentStep('preview');
  };

  const handleBack = () => {
    if (currentStep === 'content') setCurrentStep('recipient');
    else if (currentStep === 'preview') setCurrentStep('content');
  };

  const handleSend = () => {
    // Here you would implement the actual message sending logic
    console.log('Sending message:', messageData);
  };

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header with Usage Report Toggle */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <Button
              variant="outline"
              onClick={() => setShowUsageReport(!showUsageReport)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showUsageReport ? 'Hide Usage Report' : 'View Usage Report'}
            </Button>
          </div>

          {showUsageReport ? (
            <UsageReport />
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {['recipient', 'content', 'preview'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === step
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div className="h-[2px] w-24 mx-2 bg-muted">
                        <div
                          className={`h-full bg-primary transition-all ${
                            index === 0 && currentStep !== 'recipient'
                              ? 'w-full'
                              : index === 1 && currentStep === 'preview'
                              ? 'w-full'
                              : 'w-0'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Card className="p-6">
                {currentStep === 'recipient' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Select Recipients</h2>
                      <Select
                        value={messageData.messageType}
                        onValueChange={(value) =>
                          setMessageData({ ...messageData, messageType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select message type" />
                        </SelectTrigger>
                        <SelectContent>
                          {messageTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Recipients
                      </label>
                      <Input
                        placeholder="Enter email addresses or names"
                        value={messageData.recipients.join(', ')}
                        onChange={(e) =>
                          setMessageData({
                            ...messageData,
                            recipients: e.target.value.split(',').map((r) => r.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {currentStep === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        Compose Your Message
                      </h2>
                      <Input
                        placeholder="Subject"
                        className="mb-4"
                        value={messageData.subject}
                        onChange={(e) =>
                          setMessageData({ ...messageData, subject: e.target.value })
                        }
                      />
                      <Textarea
                        placeholder="Write your message here..."
                        className="min-h-[200px]"
                        value={messageData.content}
                        onChange={(e) =>
                          setMessageData({ ...messageData, content: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {currentStep === 'preview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Message Preview</h2>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-2">
                            To: {messageData.recipients.join(', ')}
                          </div>
                          <div className="text-lg font-medium mb-2">
                            {messageData.subject}
                          </div>
                          <div className="whitespace-pre-wrap">
                            {messageData.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {currentStep !== 'recipient' && (
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  {currentStep === 'preview' ? (
                    <Button onClick={handleSend} className="ml-auto">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="ml-auto">
                      Next
                    </Button>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { MessageEditor } from '@/components/features/MessageEditor';
import { MessagePreview } from '@/components/features/MessagePreview';
import { MessageSettings } from '@/components/features/MessageSettings';

export default function CreateMessagePage() {
  const [messageContent, setMessageContent] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Section */}
            <div className="lg:col-span-2 space-y-6">
              <MessageEditor
                content={messageContent}
                title={messageTitle}
                onContentChange={setMessageContent}
                onTitleChange={setMessageTitle}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </div>

            {/* Settings & Preview Section */}
            <div className="space-y-6">
              <MessageSettings />
              <MessagePreview content={messageContent} title={messageTitle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Pencil, X, Check, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactPlaybookProps {
  contactId: string;
}

export function ContactPlaybook({ contactId }: ContactPlaybookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playbook, setPlaybook] = useState<string>('');
  const [savedPlaybook, setSavedPlaybook] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Here you would implement the actual playbook save logic
    setSavedPlaybook(playbook);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPlaybook(savedPlaybook);
    setIsEditing(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <BookOpen className="w-4 h-4" />
        {savedPlaybook ? 'View Playbook' : 'Create Playbook'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Playbook</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                  <p>Write a playbook entry that will guide AI interactions with this contact. Include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Communication preferences and style</li>
                    <li>Important topics or interests</li>
                    <li>Engagement history and patterns</li>
                    <li>Special considerations or requirements</li>
                    <li>Goals for the relationship</li>
                  </ul>
                </div>

                <Textarea
                  value={playbook}
                  onChange={(e) => setPlaybook(e.target.value)}
                  placeholder="Example: When communicating with this contact, focus on their interest in baseball and their role as a season ticket holder. They prefer formal communication via email and typically respond within 2 business days. Avoid scheduling calls before 10 AM as they have morning team meetings. Key topics include their Premium Package membership and involvement in community outreach programs."
                  className="min-h-[200px] font-medium"
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Check className="w-4 h-4 mr-2" />
                    Save Playbook
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {savedPlaybook ? (
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground">{savedPlaybook}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => setIsEditing(true)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Playbook
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Playbook Entry</p>
                    <p className="text-sm mb-4">
                      Create a playbook entry to guide AI interactions with this contact.
                    </p>
                    <Button onClick={() => setIsEditing(true)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Create Playbook Entry
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
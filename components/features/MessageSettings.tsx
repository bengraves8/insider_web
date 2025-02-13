'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Send, Clock, Users } from 'lucide-react';

export function MessageSettings() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-4 h-4" />
        <h3 className="font-semibold">Message Settings</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule Send
            </Label>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Send Test
            </Label>
            <Switch />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Test Recipients</Label>
          <Input placeholder="Enter email addresses" />
        </div>

        <div className="pt-4 space-y-4">
          <Button className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" className="w-full">
            Save as Draft
          </Button>
        </div>
      </div>
    </Card>
  );
}
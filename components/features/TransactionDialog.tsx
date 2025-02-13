'use client';

import { useState } from 'react';
import { useCreateTransaction } from '@/hooks/use-transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionDialogProps {
  contactId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDialog({ contactId, open, onOpenChange }: TransactionDialogProps) {
  const createTransaction = useCreateTransaction();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'donation' | 'purchase' | 'subscription' | 'other'>('donation');
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed' | 'refunded'>('completed');
  const [platform, setPlatform] = useState<'stripe' | 'manual' | 'other'>('manual');
  const [platformTransactionId, setPlatformTransactionId] = useState('');
  const [probability, setProbability] = useState('100');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!name.trim()) {
      toast.error('Transaction name is required');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    const probabilityNum = parseInt(probability);
    if (isNaN(probabilityNum) || probabilityNum < 0 || probabilityNum > 100) {
      toast.error('Probability must be between 0 and 100');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        contactId,
        name,
        amount: parseFloat(amount),
        type,
        status,
        platform,
        platformTransactionId: platformTransactionId || undefined,
        probability: parseInt(probability),
        date: date.toISOString(),
        notes: notes || undefined,
      });
      toast.success('Transaction created successfully');
      onOpenChange(false);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create transaction';
      toast.error(message);
      console.error('Transaction creation error:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setType('donation');
    setStatus('completed');
    setPlatform('manual');
    setPlatformTransactionId('');
    setProbability('100');
    setDate(new Date());
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter transaction name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value: typeof type) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value: typeof status) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(value: typeof platform) => setPlatform(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {platform !== 'manual' && (
            <div className="space-y-2">
              <Label>Platform Transaction ID</Label>
              <Input
                value={platformTransactionId}
                onChange={(e) => setPlatformTransactionId(e.target.value)}
                placeholder="Enter platform transaction ID"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Probability (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTransaction.isLoading}>
              {createTransaction.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
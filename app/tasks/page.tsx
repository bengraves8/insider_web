'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/contexts/auth-context';
import { TaskStatus, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Search, Filter, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { TaskCreateDialog } from '@/components/features/TaskCreateDialog';
import { TaskList } from '@/components/features/TaskList';

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function TasksPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus[]>([]);
  const [priority, setPriority] = useState<TaskPriority[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { tasks, isLoading, error } = useTasks({
    search,
    status,
    priority,
  });

  if (!user) return null;

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Tasks</h1>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10 w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select
                value={status.join(',')}
                onValueChange={(value) => setStatus(value ? value.split(',') as TaskStatus[] : [])}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={priority.join(',')}
                onValueChange={(value) => setPriority(value ? value.split(',') as TaskPriority[] : [])}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Task List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="p-6 text-center text-destructive">
              <p>Error loading tasks. Please try again.</p>
            </Card>
          ) : tasks.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No tasks found.</p>
            </Card>
          ) : (
            <TaskList tasks={tasks} />
          )}
        </div>
      </div>

      <TaskCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
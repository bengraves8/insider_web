'use client';

import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, CheckCircle2, Circle, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { useUpdateTask } from '@/hooks/use-tasks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const updateTask = useUpdateTask();

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50';
      case 'low':
        return 'text-green-500 bg-green-50';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const toggleTaskCompletion = (task: Task) => {
    updateTask.mutate({
      id: task.id,
      completed: !task.completed,
      status: !task.completed ? 'completed' : 'pending',
    });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => toggleTaskCompletion(task)}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.title}
                  </span>
                  <Badge variant="secondary" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </div>

                  <div className="flex -space-x-2">
                    {task.assignees.map((assignee) => (
                      <Avatar key={assignee.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={assignee.avatar} alt={assignee.name} />
                        <AvatarFallback>
                          {assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Task</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Add Assignee</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {task.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EditableSection } from '@/components/shared/EditableSection';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  assignee: {
    name: string;
    avatar: string;
  };
}

const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Follow up on proposal',
    dueDate: 'Tomorrow',
    priority: 'high',
    completed: false,
    assignee: {
      name: 'Alice Smith',
      avatar: 'https://picsum.photos/seed/user1/32/32'
    }
  },
  {
    id: 'task-2',
    title: 'Schedule product demo',
    dueDate: 'Next week',
    priority: 'medium',
    completed: false,
    assignee: {
      name: 'Bob Johnson',
      avatar: 'https://picsum.photos/seed/user2/32/32'
    }
  },
  {
    id: 'task-3',
    title: 'Send contract draft',
    dueDate: 'Completed',
    priority: 'high',
    completed: true,
    assignee: {
      name: 'Carol Williams',
      avatar: 'https://picsum.photos/seed/user3/32/32'
    }
  }
];

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

interface ContactTasksProps {
  contactId: string;
}

interface TaskEditFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [editedTask, setEditedTask] = useState(task);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Select
          value={editedTask.priority}
          onValueChange={(value: Task['priority']) => 
            setEditedTask({ ...editedTask, priority: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(editedTask)}>Save Changes</Button>
      </div>
    </div>
  );
}

export function ContactTasks({ contactId }: ContactTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleTaskSave = (taskId: string, updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? updatedTask : task
    ));
    setEditingTaskId(null);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center gap-4 p-4 border rounded-lg ${
            task.completed ? 'bg-muted/50' : ''
          }`}
        >
          <button
            className="flex-shrink-0"
            onClick={() => toggleTask(task.id)}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {editingTaskId === task.id ? (
              <TaskEditForm
                task={task}
                onSave={(updatedTask) => handleTaskSave(task.id, updatedTask)}
                onCancel={() => setEditingTaskId(null)}
              />
            ) : (
              <div className="flex items-center justify-between gap-4">
                <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  {task.title}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTaskId(task.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Badge
                    variant="secondary"
                    className={getPriorityColor(task.priority)}
                  >
                    {task.priority}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {task.dueDate}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
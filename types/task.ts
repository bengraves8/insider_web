export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  orgId: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  completed: boolean;
  assignees: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  contactId?: string;
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
  completedAt?: number;
  completedBy?: string;
}

export type TaskUpdateParams = Partial<Omit<Task, 'id' | 'orgId' | 'createdAt' | 'updatedAt' | 'createdBy'>>;

export interface TaskActivity {
  id: string;
  taskId: string;
  type: 'created' | 'updated' | 'completed' | 'uncompleted' | 'assigned' | 'unassigned';
  userId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface TaskFilter extends FilterParams {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string;
  contactId?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
}
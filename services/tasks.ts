import { apiRequest } from './api';
import { 
  Task, 
  TaskUpdateParams,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const tasksApi = {
  getTasks: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Task>>({
      url: '/tasks',
      method: 'GET',
      params,
    });
  },

  getTask: async (id: string) => {
    return apiRequest<Task>({
      url: `/tasks/${id}`,
      method: 'GET',
    });
  },

  createTask: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiRequest<Task>({
      url: '/tasks',
      method: 'POST',
      data,
    });
  },

  updateTask: async (id: string, data: TaskUpdateParams) => {
    return apiRequest<Task>({
      url: `/tasks/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteTask: async (id: string) => {
    return apiRequest<void>({
      url: `/tasks/${id}`,
      method: 'DELETE',
    });
  },

  getTaskAssignees: async (id: string) => {
    return apiRequest<Task['assignees']>({
      url: `/tasks/${id}/assignees`,
      method: 'GET',
    });
  },

  addTaskAssignee: async (id: string, userId: string) => {
    return apiRequest<void>({
      url: `/tasks/${id}/assignees`,
      method: 'POST',
      data: { userId },
    });
  },

  removeTaskAssignee: async (id: string, userId: string) => {
    return apiRequest<void>({
      url: `/tasks/${id}/assignees/${userId}`,
      method: 'DELETE',
    });
  },

  completeTask: async (id: string) => {
    return apiRequest<Task>({
      url: `/tasks/${id}/complete`,
      method: 'PUT',
    });
  },

  uncompleteTask: async (id: string) => {
    return apiRequest<Task>({
      url: `/tasks/${id}/uncomplete`,
      method: 'PUT',
    });
  },
};
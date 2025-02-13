'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query as firestoreQuery, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { tasksApi } from '@/services/tasks';
import { Task, TaskUpdateParams, FilterParams } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { useEffect } from 'react';

export function useTasks(params?: FilterParams & { page?: number; limit?: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasksApi.getTasks(params),
    enabled: !!user,
  });

  // Set up real-time listener for task updates
  useEffect(() => {
    if (!user?.uid || !user.orgId) return;

    const tasksRef = collection(db, '_rt_events');
    const q = firestoreQuery(
      tasksRef,
      where('orgId', '==', user.orgId),
      where('type', '==', 'task:update'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['tasks']);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, queryClient]);

  return {
    ...queryResult,
    tasks: queryResult.data?.data?.data || [],
    pagination: queryResult.data?.data?.pagination,
  };
}

export function useTask(id: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id && !!user,
  });

  // Set up real-time listener for single task updates
  useEffect(() => {
    if (!user?.uid || !user.orgId || !id) return;

    const tasksRef = collection(db, '_rt_events');
    const q = firestoreQuery(
      tasksRef,
      where('orgId', '==', user.orgId),
      where('docId', '==', id),
      where('type', '==', 'task:update'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['tasks', id]);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, id, queryClient]);

  return {
    ...queryResult,
    task: queryResult.data?.data,
  };
}

export function useTaskAssignees(taskId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['tasks', taskId, 'assignees'],
    queryFn: () => tasksApi.getTaskAssignees(taskId),
    enabled: !!taskId && !!user,
  });

  // Set up real-time listener for assignee updates
  useEffect(() => {
    if (!user?.uid || !user.orgId || !taskId) return;

    const assigneesRef = collection(db, '_rt_events');
    const q = firestoreQuery(
      assigneesRef,
      where('orgId', '==', user.orgId),
      where('parentId', '==', taskId),
      where('type', '==', 'task-assignee:update'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['tasks', taskId, 'assignees']);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, taskId, queryClient]);

  return {
    ...queryResult,
    assignees: queryResult.data?.data || [],
  };
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => 
      tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & TaskUpdateParams) => 
      tasksApi.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['tasks', variables.id]);
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['tasks', id]);
      toast.success('Task deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });
}
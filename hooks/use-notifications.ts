'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notificationsApi } from '@/services/notifications';
import { NotificationFilter, NotificationPreferences } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { debounce } from 'lodash';

export function useNotifications(params?: NotificationFilter & { page?: number; limit?: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    enabled: !!user,
  });

  // Set up real-time listener for notifications
  useEffect(() => {
    if (!user?.uid) return;

    const notificationsRef = collection(db, '_rt_events');
    const q = query(
      notificationsRef,
      where('orgId', '==', user.orgId),
      where('type', '==', 'notification'),
      orderBy('timestamp', 'desc'),
      limit(3)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['notifications']);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, queryClient]);

  return {
    ...query,
    notifications: query.data?.data?.data || [],
    pagination: query.data?.data?.pagination,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications', 'unread-count']);
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications', 'unread-count']);
      toast.success('All notifications marked as read');
    },
  });
}

export function useNotificationPreferences() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => notificationsApi.getPreferences(),
    enabled: !!user,
  });

  return {
    ...query,
    preferences: query.data?.data,
  };
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) => 
      notificationsApi.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries(['notification-preferences']);
      toast.success('Notification preferences updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update notification preferences');
    },
  });
}

export function useNotificationCount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up real-time listener for notification count
  useEffect(() => {
    if (!user?.uid) return;

    const notificationsRef = collection(db, '_rt_events');
    const q = query(
      notificationsRef,
      where('orgId', '==', user.orgId),
      where('type', '==', 'notification'),
      orderBy('timestamp', 'desc'),
      limit(3)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['notifications', 'unread-count']);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, queryClient]);

  return query;
}
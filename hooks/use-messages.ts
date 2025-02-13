'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { messagesApi } from '@/services/messages';
import { Message, MessageUpdateParams, FilterParams } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { debounce } from 'lodash';

export function useMessages(params?: FilterParams & { page?: number; limit?: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', params],
    queryFn: () => messagesApi.getMessages(params),
    enabled: !!user,
  });

  // Set up real-time listener for message updates
  useEffect(() => {
    if (!user?.uid) return;

    const messagesRef = collection(db, '_rt_events');
    const q = query(
      messagesRef,
      where('orgId', '==', user.orgId),
      where('type', '==', 'message:update'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['messages']);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, queryClient]);

  return {
    ...query,
    messages: query.data?.data?.data || [],
    pagination: query.data?.data?.pagination,
  };
}

export function useMessage(id: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', id],
    queryFn: () => messagesApi.getMessage(id),
    enabled: !!id && !!user,
  });

  // Set up real-time listener for single message updates
  useEffect(() => {
    if (!user?.uid || !id) return;

    const messagesRef = collection(db, '_rt_events');
    const q = query(
      messagesRef,
      where('orgId', '==', user.orgId),
      where('docId', '==', id),
      where('type', '==', 'message:update'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['messages', id]);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, id, queryClient]);

  return {
    ...query,
    message: query.data?.data,
  };
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) => 
      messagesApi.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      toast.success('Message created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create message');
    },
  });
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & MessageUpdateParams) => 
      messagesApi.updateMessage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['messages']);
      queryClient.invalidateQueries(['messages', variables.id]);
      toast.success('Message updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update message');
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messagesApi.deleteMessage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['messages']);
      queryClient.invalidateQueries(['messages', id]);
      toast.success('Message deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete message');
    },
  });
}

export function useMessageRecipients(messageId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', messageId, 'recipients'],
    queryFn: () => messagesApi.getMessageRecipients(messageId),
    enabled: !!messageId && !!user,
  });

  // Set up real-time listener for recipient updates
  useEffect(() => {
    if (!user?.uid || !messageId) return;

    const recipientsRef = collection(db, '_rt_events');
    const q = query(
      recipientsRef,
      where('orgId', '==', user.orgId),
      where('parentId', '==', messageId),
      where('type', '==', 'message-recipient:update'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['messages', messageId, 'recipients']);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, messageId, queryClient]);

  return {
    ...query,
    recipients: query.data?.data || [],
  };
}
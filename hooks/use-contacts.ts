'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { contactsApi } from '@/services/contacts';
import { Contact, CreateContactInput, UpdateContactInput, FilterParams } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { useEffect } from 'react';

export function useContacts(params?: FilterParams & { page?: number; limit?: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['contacts', params],
    queryFn: () => contactsApi.getContacts(params),
    enabled: !!user,
  });

  // Set up real-time listener for contact updates
  useEffect(() => {
    if (!user?.uid) return;

    const contactsRef = collection(db, '_rt_events');
    const q = query(
      contactsRef,
      where('orgId', '==', user.orgId),
      where('type', '==', 'contact:update'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['contacts']);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, queryClient]);

  return {
    ...query,
    contacts: query.data?.data?.data || [],
    pagination: query.data?.data?.pagination,
  };
}

export function useContact(id: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['contacts', id],
    queryFn: () => contactsApi.getContact(id),
    enabled: !!id && !!user,
  });

  // Set up real-time listener for single contact updates
  useEffect(() => {
    if (!user?.uid || !id) return;

    const contactsRef = collection(db, '_rt_events');
    const q = query(
      contactsRef,
      where('orgId', '==', user.orgId),
      where('docId', '==', id),
      where('type', '==', 'contact:update'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const refetchData = debounce(() => {
      queryClient.invalidateQueries(['contacts', id]);
    }, 200);

    const unsubscribe = onSnapshot(q, () => {
      refetchData();
    });

    return () => unsubscribe();
  }, [user, id, queryClient]);

  return {
    ...query,
    contact: query.data?.data,
  };
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactInput) => contactsApi.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      toast.success('Contact created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create contact');
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateContactInput) => 
      contactsApi.updateContact(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['contacts']);
      queryClient.invalidateQueries(['contacts', variables.id]);
      toast.success('Contact updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update contact');
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['contacts']);
      queryClient.invalidateQueries(['contacts', id]);
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete contact');
    },
  });
}
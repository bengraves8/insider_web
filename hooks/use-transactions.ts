'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query as firestoreQuery, where, onSnapshot, orderBy, limit, addDoc, updateDoc, doc, getDocs, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { debounce } from 'lodash';

interface Transaction {
  id: string;
  orgId: string;
  contactId: string;
  name: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'donation' | 'purchase' | 'subscription' | 'other';
  platform: 'stripe' | 'manual' | 'other';
  platformTransactionId?: string;
  probability: number;
  date: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface CreateTransactionInput {
  contactId: string;
  name: string;
  amount: number;
  status: Transaction['status'];
  type: Transaction['type'];
  platform: Transaction['platform'];
  platformTransactionId?: string;
  probability: number;
  date: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export function useContactTransactions(contactId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['transactions', contactId],
    queryFn: async () => {
      if (!user?.uid || !user.orgId) {
        return [];
      }

      try {
        const transactionsRef = collection(db, 'transactions');
        const q = firestoreQuery(
          transactionsRef,
          where('orgId', '==', user.orgId),
          where('contactId', '==', contactId),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Failed to fetch transactions');
      }
    },
    enabled: !!contactId && !!user?.uid && !!user?.orgId,
  });

  // Set up real-time listener for transaction updates
  useEffect(() => {
    if (!user?.uid || !user.orgId || !contactId) return;

    try {
      const transactionsRef = collection(db, 'transactions');
      const q = firestoreQuery(
        transactionsRef,
        where('orgId', '==', user.orgId),
        where('contactId', '==', contactId),
        orderBy('date', 'desc')
      );

      const refetchData = debounce(() => {
        queryClient.invalidateQueries(['transactions', contactId]);
      }, 200);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          refetchData();
        }
      }, (error) => {
        console.error('Transaction listener error:', error);
        toast.error('Failed to listen for transaction updates');
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up transaction listener:', error);
    }
  }, [user, contactId, queryClient]);

  return {
    ...query,
    transactions: query.data || [],
  };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      if (!user?.uid || !user.orgId) {
        throw new Error('Authentication required');
      }

      try {
        // Validate required fields
        if (!data.name || !data.amount || !data.date) {
          throw new Error('Missing required fields');
        }

        if (data.amount < 0) {
          throw new Error('Amount must be positive');
        }

        if (data.probability < 0 || data.probability > 100) {
          throw new Error('Probability must be between 0 and 100');
        }

        const transactionsRef = collection(db, 'transactions');

        const transactionData = {
          ...data,
          orgId: user.orgId,
          amount: Number(data.amount),
          probability: Number(data.probability),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        // Use a transaction to ensure atomic operation
        const result = await runTransaction(db, async (transaction) => {
          // Create the transaction document
          const docRef = await addDoc(transactionsRef, transactionData);
          
          // Get the created document
          const docSnap = await transaction.get(docRef);
          
          if (!docSnap.exists()) {
            throw new Error('Failed to create transaction');
          }

          return {
            id: docRef.id,
            ...transactionData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

        return result;
      } catch (error: any) {
        console.error('Transaction creation error:', error);
        throw new Error(
          error.message === 'Missing required fields' ? error.message :
          error.message === 'Amount must be positive' ? error.message :
          error.message === 'Probability must be between 0 and 100' ? error.message :
          'Failed to create transaction'
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['transactions', variables.contactId]);
      toast.success('Transaction created successfully');
    },
    onError: (error: any) => {
      console.error('Transaction creation error:', error);
      toast.error(error.message || 'Failed to create transaction');
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Transaction> & { id: string }) => {
      try {
        const transactionRef = doc(db, 'transactions', id);
        const updateData = {
          ...data,
          updatedAt: serverTimestamp(),
        };

        // Use a transaction to ensure atomic operation
        await runTransaction(db, async (transaction) => {
          const docSnap = await transaction.get(transactionRef);
          if (!docSnap.exists()) {
            throw new Error('Transaction not found');
          }
          transaction.update(transactionRef, updateData);
        });

        return { id, ...updateData, updatedAt: new Date().toISOString() };
      } catch (error: any) {
        console.error('Transaction update error:', error);
        throw new Error(error.message || 'Failed to update transaction');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['transactions', variables.contactId]);
      toast.success('Transaction updated successfully');
    },
    onError: (error: any) => {
      console.error('Transaction update error:', error);
      toast.error(error.message || 'Failed to update transaction');
    },
  });
}
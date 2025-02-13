'use client';

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse, ApiErrorResponse } from '@/types/api';
import { auth } from '@/lib/firebase';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api(config);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        details: error,
      },
    };
  }
}
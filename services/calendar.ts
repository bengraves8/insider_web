import { apiRequest } from './api';
import { 
  CalendarEvent, 
  CalendarEventCreateReq,
  EditCalendarEventReq,
  EventGroup,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const calendarApi = {
  getEvents: async (params?: FilterParams & { 
    startDate?: string; 
    endDate?: string;
    groupId?: string;
  }) => {
    return apiRequest<PaginatedResponse<CalendarEvent>>({
      url: '/calendar/events',
      method: 'GET',
      params,
    });
  },

  getEvent: async (id: string) => {
    return apiRequest<CalendarEvent>({
      url: `/calendar/events/${id}`,
      method: 'GET',
    });
  },

  createEvent: async (data: CalendarEventCreateReq) => {
    return apiRequest<CalendarEvent>({
      url: '/calendar/events',
      method: 'POST',
      data,
    });
  },

  updateEvent: async (id: string, data: EditCalendarEventReq) => {
    return apiRequest<CalendarEvent>({
      url: `/calendar/events/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteEvent: async (id: string) => {
    return apiRequest<void>({
      url: `/calendar/events/${id}`,
      method: 'DELETE',
    });
  },

  getGroups: async () => {
    return apiRequest<EventGroup[]>({
      url: '/calendar/groups',
      method: 'GET',
    });
  },

  createGroup: async (data: Omit<EventGroup, 'id'>) => {
    return apiRequest<EventGroup>({
      url: '/calendar/groups',
      method: 'POST',
      data,
    });
  },

  updateGroup: async (id: string, data: Partial<EventGroup>) => {
    return apiRequest<EventGroup>({
      url: `/calendar/groups/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteGroup: async (id: string) => {
    return apiRequest<void>({
      url: `/calendar/groups/${id}`,
      method: 'DELETE',
    });
  },
};
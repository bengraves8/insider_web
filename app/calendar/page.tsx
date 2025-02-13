'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees?: number;
  type: 'work' | 'personal' | 'social';
}

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Team Planning Meeting',
    date: '2024-03-20',
    time: '10:00 AM',
    location: 'Conference Room A',
    attendees: 8,
    type: 'work'
  },
  {
    id: '2',
    title: 'Lunch with Sarah',
    date: '2024-03-20',
    time: '12:30 PM',
    location: 'Cafe Downtown',
    attendees: 2,
    type: 'social'
  },
  {
    id: '3',
    title: 'Project Review',
    date: '2024-03-22',
    time: '2:00 PM',
    location: 'Virtual',
    attendees: 5,
    type: 'work'
  }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date): Event[] => {
    return MOCK_EVENTS.filter(event => {
      const eventDate = parseISO(event.date);
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'work':
        return 'bg-blue-100 text-blue-800';
      case 'personal':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Calendar</h1>
              <Button size="sm" variant="outline" className="ml-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  className="pl-10 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
              <h2 className="text-xl font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
            {/* Week day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-background p-4 text-center text-sm font-medium"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {daysInMonth.map((date, index) => {
              const events = getEventsForDate(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);

              return (
                <div
                  key={date.toString()}
                  className={`min-h-[150px] bg-background p-4 ${
                    !isCurrentMonth ? 'text-muted-foreground' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${
                        isCurrentDay
                          ? 'h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center'
                          : ''
                      }`}
                    >
                      {format(date, 'd')}
                    </span>
                    {events.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {events.length} events
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`p-2 rounded-md ${getEventTypeColor(
                          event.type
                        )} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees && (
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <Users className="w-3 h-3" />
                            {event.attendees} attendees
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
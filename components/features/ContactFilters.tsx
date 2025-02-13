'use client';

import { useState } from 'react';
import { Tag, Building2, Calendar } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface ContactFiltersProps {
  className?: string;
}

export function ContactFilters({ className }: ContactFiltersProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);

  const tags = ['Client', 'Prospect', 'Partner', 'Vendor', 'Employee'];
  const organizations = ['Company A', 'Company B', 'Company C', 'Company D'];
  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const toggleOrganization = (org: string) => {
    setSelectedOrganizations(prev => {
      if (prev.includes(org)) {
        return prev.filter(o => o !== org);
      }
      return [...prev, org];
    });
  };

  return (
    <div className={cn('space-y-4 p-4 border rounded-lg bg-muted/50', className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tags Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Organizations Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Organizations
          </label>
          <div className="flex flex-wrap gap-2">
            {organizations.map(org => (
              <Badge
                key={org}
                variant={selectedOrganizations.includes(org) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleOrganization(org)}
              >
                {org}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last Contacted
          </label>
          <Select defaultValue="30d">
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" size="sm">
          Clear Filters
        </Button>
        <Button size="sm">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Mail,
  Phone,
  Building2,
  Calendar,
  Tag,
  Clock,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContactFilters } from '@/components/features/ContactFilters';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  status: 'active' | 'archived';
  tags: string[];
  lastContacted: string;
  createdAt: string;
}

const MOCK_CONTACTS: Contact[] = Array.from({ length: 10 }, (_, i) => ({
  id: `contact-${i + 1}`,
  firstName: `John${i + 1}`,
  lastName: `Doe${i + 1}`,
  email: `john.doe${i + 1}@example.com`,
  phone: `+1 555-000-${1000 + i}`,
  organization: `Company ${i + 1}`,
  jobTitle: `Position ${i + 1}`,
  status: i % 5 === 0 ? 'archived' : 'active',
  tags: [`tag${i + 1}`, `category${i + 1}`],
  lastContacted: new Date(Date.now() - i * 86400000).toISOString(),
  createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
}));

export default function PeoplePage() {
  const router = useRouter();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const handleSelectContact = (contactId: string, e: React.MouseEvent) => {
    // Prevent row click when clicking checkbox
    e.stopPropagation();
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      }
      return [...prev, contactId];
    });
  };

  const handleRowClick = (contactId: string) => {
    router.push(`/people/${contactId}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Contacts</h1>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-10 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && <ContactFilters className="mb-6" />}

          {/* Data Grid */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedContacts.length === contacts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead className="w-[200px]">Organization</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[150px]">Phone</TableHead>
                  <TableHead className="w-[150px]">Tags</TableHead>
                  <TableHead className="w-[150px]">Last Contacted</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow 
                    key={contact.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handleRowClick(contact.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => handleSelectContact(contact.id, event as React.MouseEvent)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={`https://picsum.photos/seed/${contact.id}/32/32`} 
                            alt={`${contact.firstName} ${contact.lastName}`} 
                          />
                          <AvatarFallback>
                            {contact.firstName[0]}
                            {contact.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {contact.jobTitle}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {contact.organization}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {formatDate(contact.lastContacted)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={contact.status === 'active' ? 'default' : 'secondary'}
                      >
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRowClick(contact.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
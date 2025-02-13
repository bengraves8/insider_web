'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Globe, 
  Pencil, 
  Check, 
  X, 
  Plus,
  Archive,
  Trash2,
  MoreHorizontal,
  Upload,
  Camera,
  Clock,
  FileText,
  MessageSquare,
  Star,
  BookOpen,
  DollarSign,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactActivity } from '@/components/features/ContactActivity';
import { ContactTasks } from '@/components/features/ContactTasks';
import { ContactNotes } from '@/components/features/ContactNotes';
import { ContactMessages } from '@/components/features/ContactMessages';
import { ContactSharedMedia } from '@/components/features/ContactSharedMedia';
import { ContactDetails } from '@/components/features/ContactDetails';
import { CreateMessageDialog } from '@/components/features/CreateMessageDialog';
import { AddActivityDialog } from '@/components/features/AddActivityDialog';
import { AddTaskDialog } from '@/components/features/AddTaskDialog';
import { ContactPlaybook } from '@/components/features/ContactPlaybook';
import { TransactionDialog } from '@/components/features/TransactionDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContactTransactions } from '@/hooks/use-transactions';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  location: string;
  website: string;
  status: string;
  tags: string[];
  lastContacted: string;
  createdAt: string;
  transactions: Array<{
    id: string;
    name: string;
    amount: number;
    status: string;
    probability: number;
  }>;
  stats: {
    totalTransactions: number;
    totalDonations: number;
    averageResponseTime: string;
    lastActivity: string;
  };
  profileImage?: string;
}

interface ContactProfileClientProps {
  contact: Contact;
}

export default function ContactProfileClient({ contact }: ContactProfileClientProps) {
  const [activeTab, setActiveTab] = useState('messages');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState({
    firstName: contact.firstName,
    lastName: contact.lastName,
    profileImage: contact.profileImage
  });
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const { transactions } = useContactTransactions(contact.id);

  const handleContactUpdate = (updatedData: Partial<Contact>) => {
    // Here you would implement the actual contact update logic
    console.log('Updating contact:', updatedData);
    // Update the edited contact state
    setEditedContact({
      ...editedContact,
      ...updatedData
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to your storage service
      // For now, we'll create a temporary URL
      const imageUrl = URL.createObjectURL(file);
      setEditedContact({ ...editedContact, profileImage: imageUrl });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'purchase':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'subscription':
        return <Clock className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={editedContact.profileImage || `https://picsum.photos/seed/${contact.id}/64/64`}
                    alt={`${contact.firstName} ${contact.lastName}`}
                  />
                  <AvatarFallback>
                    {contact.firstName[0]}
                    {contact.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label 
                    htmlFor="profile-image" 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      id="profile-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={editedContact.firstName}
                        onChange={(e) => setEditedContact({ ...editedContact, firstName: e.target.value })}
                        placeholder="First Name"
                        className="w-[150px]"
                      />
                      <Input
                        value={editedContact.lastName}
                        onChange={(e) => setEditedContact({ ...editedContact, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="w-[150px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleContactUpdate(editedContact)}>
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditedContact({
                          firstName: contact.firstName,
                          lastName: contact.lastName,
                          profileImage: contact.profileImage
                        });
                        setIsEditing(false);
                      }}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-semibold">
                        {editedContact.firstName} {editedContact.lastName}
                      </h1>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{contact.jobTitle}</span>
                      <span>•</span>
                      <span>{contact.organization}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ContactPlaybook contactId={contact.id} />
              <Button onClick={() => setShowMessageDialog(true)}>
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowArchiveDialog(true)}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Contact
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Sidebar - Contact Info */}
            <div className="space-y-6">
              <ContactDetails 
                contact={{
                  email: contact.email,
                  phone: contact.phone,
                  organization: contact.organization,
                  location: contact.location,
                  website: contact.website,
                  tags: contact.tags,
                  createdAt: contact.createdAt,
                  updatedAt: contact.lastContacted,
                  optIns: {
                    email: true,
                    phone: true,
                    sms: true,
                    mail: true
                  },
                  stats: contact.stats,
                  advancedDetails: {
                    birthday: '1990-05-15',
                    gradYear: '2012',
                    favoriteTeam: 'New York Yankees',
                    favoriteSport: 'Baseball',
                    seasonTicketPackage: 'Premium Package'
                  }
                }}
                onSave={handleContactUpdate}
              />
            </div>

            {/* Main Content Area */}
            <div className="col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Shared Media
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Transactions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="messages" className="mt-6">
                  <ContactMessages contactId={contact.id} />
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">Recent Activity</h2>
                    <Button onClick={() => setShowActivityDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  </div>
                  <ContactActivity contactId={contact.id} />
                </TabsContent>

                <TabsContent value="tasks" className="mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">Tasks</h2>
                    <Button onClick={() => setShowTaskDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                  <ContactTasks contactId={contact.id} />
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                  <ContactNotes contactId={contact.id} />
                </TabsContent>

                <TabsContent value="media" className="mt-6">
                  <ContactSharedMedia contactId={contact.id} />
                </TabsContent>

                <TabsContent value="transactions" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold">Transactions</h2> 
                        <p className="text-sm text-muted-foreground">
                          Manage and track all financial transactions
                        </p>
                      </div>
                      <Button onClick={() => setShowTransactionDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {transactions?.map((transaction) => (
                        <div key={transaction.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                transaction.type === 'donation' ? 'bg-green-100' :
                                transaction.type === 'purchase' ? 'bg-blue-100' :
                                transaction.type === 'subscription' ? 'bg-purple-100' : 'bg-gray-100'
                              }`}>
                                {getTypeIcon(transaction.type)}
                              </div>
                              <div>
                                <h3 className="font-medium">{transaction.name}</h3>
                                <div className="text-2xl font-bold">
                                  ${transaction.amount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">
                                Probability
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${transaction.probability}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">
                                  {transaction.probability}%
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-muted-foreground mb-1">
                                Platform
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm font-medium capitalize">
                                  {transaction.platform}
                                </span>
                                {transaction.platformTransactionId && (
                                  <Badge variant="outline" className="text-xs">
                                    ID: {transaction.platformTransactionId}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {transaction.notes && (
                            <div className="mt-4 text-sm text-muted-foreground">
                              {transaction.notes}
                            </div>
                          )}

                          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(transaction.date), 'PPP')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              <span className="capitalize">{transaction.type}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!transactions || transactions.length === 0) && (
                        <div className="text-center py-12 border rounded-lg">
                          <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Start tracking financial interactions by adding a transaction.
                          </p>
                          <Button onClick={() => setShowTransactionDialog(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Transaction
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <TransactionDialog
        contactId={contact.id}
        open={showTransactionDialog}
        onOpenChange={setShowTransactionDialog}
      />

      <CreateMessageDialog
        contact={contact}
        open={showMessageDialog}
        onOpenChange={setShowMessageDialog}
      />

      <AddActivityDialog
        contactId={contact.id}
        open={showActivityDialog}
        onOpenChange={setShowActivityDialog}
      />

      <AddTaskDialog
        contactId={contact.id}
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
      />

      <TransactionDialog
        contactId={contact.id}
        open={showTransactionDialog}
        onOpenChange={setShowTransactionDialog}
      />
    </div>
  );
}
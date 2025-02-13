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
  Clock,
  TrendingUp,
  DollarSign,
  Clock3,
  Activity,
  ArrowUp,
  ArrowDown,
  Cake,
  GraduationCap,
  Trophy,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
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
import { Switch } from '@/components/ui/switch';

interface ContactDetailsProps {
  contact: {
    email: string;
    phone: string;
    organization: string;
    location: string;
    website: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    optIns: {
      email: boolean;
      phone: boolean;
      sms: boolean;
      mail: boolean;
    };
    preferredMethod?: 'email' | 'phone' | 'sms' | 'mail';
    stats?: {
      totalTransactions: number;
      totalDonations: number;
      averageResponseTime: string;
      lastActivity: string;
      responseRate: {
        current: number;
        trend: number;
      };
    };
    advancedDetails?: {
      birthday?: string;
      gradYear?: string;
      favoriteTeam?: string;
      favoriteSport?: string;
      seasonTicketPackage?: string;
    };
  };
  onSave: (updatedContact: Partial<ContactDetailsProps['contact']>) => void;
}

interface AddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingTags: string[];
  onAddTag: (tag: string) => void;
}

function AddTagDialog({ open, onOpenChange, existingTags, onAddTag }: AddTagDialogProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tag</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tag Name</Label>
            <Input
              placeholder="Enter tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add Tag
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ContactDetails({ contact, onSave }: ContactDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [isEditingAdvanced, setIsEditingAdvanced] = useState(false);
  const [isEditingComms, setIsEditingComms] = useState(false);
  const [editedContact, setEditedContact] = useState(contact);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [editedOptIns, setEditedOptIns] = useState(contact.optIns);
  const [editedPreferredMethod, setEditedPreferredMethod] = useState(contact.preferredMethod);

  const handleSave = () => {
    onSave(editedContact);
    setIsEditing(false);
  };

  const handleSaveStats = () => {
    onSave({ stats: editedContact.stats });
    setIsEditingStats(false);
  };

  const handleSaveAdvanced = () => {
    onSave({ advancedDetails: editedContact.advancedDetails });
    setIsEditingAdvanced(false);
  };

  const handleSaveComms = () => {
    onSave({ 
      optIns: editedOptIns,
      preferredMethod: editedPreferredMethod 
    });
    setIsEditingComms(false);
  };

  const handleCancel = () => {
    setEditedContact(contact);
    setIsEditing(false);
  };

  const handleCancelStats = () => {
    setEditedContact(prev => ({ ...prev, stats: contact.stats }));
    setIsEditingStats(false);
  };

  const handleCancelAdvanced = () => {
    setEditedContact(prev => ({ ...prev, advancedDetails: contact.advancedDetails }));
    setIsEditingAdvanced(false);
  };

  const handleCancelComms = () => {
    setEditedOptIns(contact.optIns);
    setEditedPreferredMethod(contact.preferredMethod);
    setIsEditingComms(false);
  };

  const handleAddTag = (tag: string) => {
    const updatedTags = [...contact.tags, tag];
    onSave({ tags: updatedTags });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = contact.tags.filter(tag => tag !== tagToRemove);
    onSave({ tags: updatedTags });
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 group">
          <h2 className="font-semibold">Contact Information</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={editedContact.email}
                  onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={editedContact.phone}
                  onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                  placeholder="Phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Organization</Label>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={editedContact.organization}
                  onChange={(e) => setEditedContact({ ...editedContact, organization: e.target.value })}
                  placeholder="Organization"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={editedContact.location}
                  onChange={(e) => setEditedContact({ ...editedContact, location: e.target.value })}
                  placeholder="Location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={editedContact.website}
                  onChange={(e) => setEditedContact({ ...editedContact, website: e.target.value })}
                  placeholder="Website"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="text-primary">
                {contact.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a href={`tel:${contact.phone}`} className="text-primary">
                {contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>{contact.organization}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{contact.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a href={`https://${contact.website}`} className="text-primary">
                {contact.website}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Tags</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddTagDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {contact.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="pr-1.5"
            >
              <span className="mr-1">{tag}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Statistics */}
      {contact.stats && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between group">
            <h2 className="font-semibold">Key Statistics</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingStats(!isEditingStats)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isEditingStats ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>

          {isEditingStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Transactions</Label>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={editedContact.stats?.totalTransactions || 0}
                      onChange={(e) => setEditedContact({
                        ...editedContact,
                        stats: {
                          ...editedContact.stats!,
                          totalTransactions: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Total Donations</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      value={editedContact.stats?.totalDonations || 0} 
                      onChange={(e) => setEditedContact({ 
                        ...editedContact, 
                        stats: { 
                          ...editedContact.stats!, 
                          totalDonations: parseInt(e.target.value) || 0 
                        } 
                      })} 
                    /> 
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Response Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-muted-foreground" /> 
                    <div className="text-sm text-muted-foreground"> 
                      {editedContact.stats?.averageResponseTime || 'N/A'} 
                    </div> 
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Last Activity</Label>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" /> 
                    <div className="text-sm text-muted-foreground"> 
                      {editedContact.stats?.lastActivity || 'N/A'} 
                    </div> 
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancelStats}>Cancel</Button>
                <Button onClick={handleSaveStats}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  Total Transactions
                </div>
                <div className="font-medium">{contact.stats.totalTransactions}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  Total Donations
                </div>
                <div className="font-medium">
                  ${contact.stats.totalDonations.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="w-4 h-4" />
                  Average Response Time
                </div>
                <div className="font-medium">{contact.stats.averageResponseTime}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  Last Activity
                </div>
                <div className="font-medium">{contact.stats.lastActivity}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  Response Rate 
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{contact.stats?.responseRate?.current ?? 'N/A'}%</span>
                  {contact.stats?.responseRate?.trend !== undefined && contact.stats.responseRate.trend !== 0 && (
                    <div className={`flex items-center gap-1 ${
                      contact.stats.responseRate.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {contact.stats.responseRate.trend > 0 ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(contact.stats.responseRate.trend)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advanced Details */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 group">
          <h2 className="font-semibold">Advanced Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingAdvanced(!isEditingAdvanced)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isEditingAdvanced ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>

        {isEditingAdvanced ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Birthday</Label>
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={editedContact.advancedDetails?.birthday || ''}
                  onChange={(e) => setEditedContact({
                    ...editedContact,
                    advancedDetails: {
                      ...editedContact.advancedDetails,
                      birthday: e.target.value
                    }
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="YYYY"
                  value={editedContact.advancedDetails?.gradYear || ''}
                  onChange={(e) => setEditedContact({
                    ...editedContact,
                    advancedDetails: {
                      ...editedContact.advancedDetails,
                      gradYear: e.target.value
                    }
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Favorite Team</Label>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <Input
                    value={editedContact.advancedDetails?.favoriteTeam || ''}
                    onChange={(e) => setEditedContact({
                      ...editedContact,
                      advancedDetails: {
                        ...editedContact.advancedDetails,
                        favoriteTeam: e.target.value
                      }
                    })}
                    placeholder="Favorite Team"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favorite Sport</Label>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <Input
                    value={editedContact.advancedDetails?.favoriteSport || ''}
                    onChange={(e) => setEditedContact({
                      ...editedContact,
                      advancedDetails: {
                        ...editedContact.advancedDetails,
                        favoriteSport: e.target.value
                      }
                    })}
                    placeholder="Favorite Sport"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Season Ticket Package</Label>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-muted-foreground" />
                <Select
                  value={editedContact.advancedDetails?.seasonTicketPackage || ''}
                  onValueChange={(value) => setEditedContact({
                    ...editedContact,
                    advancedDetails: {
                      ...editedContact.advancedDetails,
                      seasonTicketPackage: value
                    }
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium Package">Premium Package</SelectItem>
                    <SelectItem value="Full Season">Full Season</SelectItem>
                    <SelectItem value="Half Season">Half Season</SelectItem>
                    <SelectItem value="Quarter Season">Quarter Season</SelectItem>
                    <SelectItem value="Weekend Package">Weekend Package</SelectItem>
                    <SelectItem value="Flex Package">Flex Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancelAdvanced}>Cancel</Button>
              <Button onClick={handleSaveAdvanced}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {contact.advancedDetails?.birthday && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cake className="w-4 h-4" />
                  Birthday
                </div>
                <div className="font-medium">
                  {format(new Date(contact.advancedDetails.birthday), 'MMMM d')}
                </div>
              </div>
            )}

            {contact.advancedDetails?.gradYear && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  Graduation Year
                </div>
                <div className="font-medium">{contact.advancedDetails.gradYear}</div>
              </div>
            )}

            {(contact.advancedDetails?.favoriteTeam || contact.advancedDetails?.favoriteSport) && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  Favorite Team/Sport
                </div>
                <div className="font-medium">
                  {contact.advancedDetails.favoriteTeam}
                  {contact.advancedDetails.favoriteTeam && contact.advancedDetails.favoriteSport && ' - '}
                  {contact.advancedDetails.favoriteSport}
                </div>
              </div>
            )}

            {contact.advancedDetails?.seasonTicketPackage && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ticket className="w-4 h-4" />
                  Season Ticket Package
                </div>
                <div className="font-medium">{contact.advancedDetails.seasonTicketPackage}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Communication Preferences */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 group">
          <h2 className="font-semibold">Communication Preferences</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingComms(!isEditingComms)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isEditingComms ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>

        {isEditingComms ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Communication Channels</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editedOptIns).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setEditedOptIns(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Preferred Method of Communication</Label>
              <Select
                value={editedPreferredMethod}
                onValueChange={(value: typeof editedPreferredMethod) => 
                  setEditedPreferredMethod(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="mail">Mail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancelComms}>Cancel</Button>
              <Button onClick={handleSaveComms}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(contact.optIns).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="capitalize">{key}</span>
                </div>
              ))}
            </div>
            {contact.preferredMethod && (
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground">Preferred Method</div>
                <div className="font-medium capitalize">{contact.preferredMethod}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timestamps */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Activity Timeline</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Created: {format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last Updated: {format(new Date(contact.updatedAt), 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>
      </div>

      <AddTagDialog
        open={showAddTagDialog}
        onOpenChange={setShowAddTagDialog}
        existingTags={contact.tags}
        onAddTag={handleAddTag}
      />
    </div>
  );
}
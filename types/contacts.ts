export interface Contact {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  status: 'active' | 'archived';
  tags: string[];
  notes?: string;
  lastContacted?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  status?: 'active' | 'archived';
  tags?: string[];
  notes?: string;
}

export interface UpdateContactInput {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  status?: 'active' | 'archived';
  tags?: string[];
  notes?: string;
  lastContacted?: string;
}
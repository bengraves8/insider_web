import ContactProfileClient from './client';
import ContactProfileClient from './client';

// Mock data for demonstration
const MOCK_CONTACTS = Array.from({ length: 10 }, (_, i) => ({
  id: `contact-${i + 1}`,
  firstName: `John${i + 1}`,
  lastName: `Doe${i + 1}`,
  email: `john.doe${i + 1}@example.com`,
  phone: `+1 555-000-${1000 + i}`,
  organization: 'Acme Inc',
  jobTitle: 'Senior Manager',
  location: 'San Francisco, CA',
  website: 'www.acmeinc.com',
  status: 'active',
  tags: ['Donor', 'VIP', 'Monthly Giver'],
  lastContacted: new Date().toISOString(),
  createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  transactions: [
    {
      id: `tr-${i}-1`,
      name: 'Annual Membership Renewal',
      amount: 5000,
      status: 'completed',
      type: 'subscription',
      platform: 'stripe',
      probability: 100,
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      notes: 'Premium membership package with VIP benefits',
      platformTransactionId: `ch_${Math.random().toString(36).substr(2, 9)}`
    },
    {
      id: `tr-${i}-2`,
      name: 'Season Ticket Package',
      amount: 12500,
      status: 'completed',
      type: 'purchase',
      platform: 'stripe',
      probability: 100,
      date: new Date(Date.now() - 30 * 86400000).toISOString(),
      notes: 'Full season ticket package with parking pass',
      platformTransactionId: `ch_${Math.random().toString(36).substr(2, 9)}`
    },
    {
      id: `tr-${i}-3`,
      name: 'Youth Program Donation',
      amount: 2500,
      status: 'completed',
      type: 'donation',
      platform: 'manual',
      probability: 100,
      date: new Date(Date.now() - 60 * 86400000).toISOString(),
      notes: 'Contribution to youth sports development program'
    },
    {
      id: `tr-${i}-4`,
      name: 'VIP Suite Upgrade',
      amount: 7500,
      status: 'pending',
      type: 'purchase',
      platform: 'manual',
      probability: 75,
      date: new Date(Date.now() + 15 * 86400000).toISOString(),
      notes: 'Potential upgrade to VIP suite for next season'
    },
    {
      id: `tr-${i}-5`,
      name: 'Community Event Sponsorship',
      amount: 15000,
      status: 'pending',
      type: 'donation',
      platform: 'manual',
      probability: 90,
      date: new Date(Date.now() + 30 * 86400000).toISOString(),
      notes: 'Discussing sponsorship for upcoming community sports event'
    }
  ],
  stats: {
    totalTransactions: 5,
    totalDonations: 42500,
    averageResponseTime: '2 hours',
    lastActivity: '2 days ago',
    responseRate: {
      current: 85,
      trend: 5
    }
  }
}));

export function generateStaticParams() {
  return MOCK_CONTACTS.map((contact) => ({
    id: contact.id,
  }));
}

export default function ContactProfilePage({ params }: { params: { id: string } }) {
  const contact = MOCK_CONTACTS.find(c => c.id === params.id) || MOCK_CONTACTS[0];
  return <ContactProfileClient contact={contact} />;
}
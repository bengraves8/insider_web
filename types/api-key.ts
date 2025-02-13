export interface APIKey {
  id: string;
  userId: string;
  apiSecret: string;
  name: string;
  createdAt: number;
  lastUsed?: number;
}
export interface UserMessageStats {
  userId: string;
  firstName: string;
  lastName: string;
  profileImg: string;
  stats: PlatformMessageStats;
}

interface StatsValue {
  in: number;
  out: number;
}

export type PlatformType = 'stacked-sms' | 'stacked-mms' | 'email' | 'personal-sms' | 'web-chat';

export type PlatformMessageStats = {
  [P in PlatformType]: StatsValue;
} & {
  total: StatsValue;
};

export interface UsageStats {
  messages: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
  engagement: {
    opens: number;
    clicks: number;
    responses: number;
  };
  platforms: PlatformMessageStats;
}
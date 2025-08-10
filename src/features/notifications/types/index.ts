export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  status: NotificationStatus;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  // Additional properties used in components
  isRead?: boolean;
  timestamp?: string;
  details?: string;
  sender?: string;
  recipient?: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  email: {
    enabled: boolean;
    types: NotificationType[];
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  push: {
    enabled: boolean;
    types: NotificationType[];
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  inApp: {
    enabled: boolean;
    types: NotificationType[];
    sound: boolean;
    vibration: boolean;
  };
  categories: Record<NotificationCategory, boolean>;
  createdAt: string;
  updatedAt: string;
  // Additional properties used in components
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  types?: NotificationType[];
  summaryFrequency?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  byStatus: Record<NotificationStatus, number>;
  byPriority: Record<NotificationPriority, number>;
  period: string;
  trends: {
    date: string;
    count: number;
  }[];
}

export interface NotificationPreferences {
  userId: string;
  preferences: {
    [key: string]: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'reminder'
  | 'update'
  | 'invitation'
  | 'payment'
  | 'system';

export type NotificationCategory = 
  | 'general'
  | 'musician_request'
  | 'hiring'
  | 'contract'
  | 'payment'
  | 'chat'
  | 'event'
  | 'system'
  | 'marketing';

export type NotificationStatus = 
  | 'unread'
  | 'read'
  | 'archived'
  | 'deleted';

export type NotificationPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export interface NotificationAction {
  id: string;
  notificationId: string;
  userId: string;
  action: string;
  metadata?: Record<string, any>;
  performedAt: string;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  userId: string;
  method: 'email' | 'push' | 'in_app' | 'sms';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

export interface NotificationSchedule {
  id: string;
  notificationId: string;
  scheduledFor: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationGroup {
  id: string;
  name: string;
  description?: string;
  notifications: Notification[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilter {
  type?: NotificationType[];
  category?: NotificationCategory[];
  status?: NotificationStatus[];
  priority?: NotificationPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'priority' | 'type' | 'category';
  sortOrder?: 'asc' | 'desc';
}

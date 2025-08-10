export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  content: string;
  messageType: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  thumbnail?: string;
  status: MessageStatus;
  isEdited: boolean;
  editedAt?: string;
  reactions: MessageReaction[];
  replyTo?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  participantAvatars: (string | undefined)[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  groupDescription?: string;
  groupAdmin?: string;
  isArchived: boolean;
  isMuted: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
  avatar?: string;
  online: boolean;
  lastSeen?: string;
  status: UserStatus;
  typingIn?: string[];
}

export interface MessageReaction {
  userId: string;
  reaction: string;
  createdAt: string;
}

export interface ConversationMember {
  userId: string;
  role: MemberRole;
  joinedAt: string;
  leftAt?: string;
  isMuted: boolean;
  muteUntil?: string;
}

export interface ChatInvitation {
  id: string;
  conversationId: string;
  inviterId: string;
  inviteeId: string;
  status: InvitationStatus;
  message?: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
  declinedAt?: string;
}

export interface ChatNotification {
  id: string;
  userId: string;
  conversationId: string;
  type: ChatNotificationType;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface ChatStats {
  totalConversations: number;
  totalMessages: number;
  unreadMessages: number;
  activeConversations: number;
  messagesByDay: Record<string, number>;
  conversationsByType: Record<string, number>;
  averageResponseTime: number;
}

export type MessageType = 
  | 'text'
  | 'image'
  | 'file'
  | 'audio'
  | 'video'
  | 'location'
  | 'contact'
  | 'sticker'
  | 'system';

export type MessageStatus = 
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'deleted';

export type UserStatus = 
  | 'online'
  | 'away'
  | 'busy'
  | 'offline'
  | 'invisible';

export type MemberRole = 
  | 'admin'
  | 'moderator'
  | 'member'
  | 'guest';

export type InvitationStatus = 
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired';

export type ChatNotificationType = 
  | 'new_message'
  | 'mention'
  | 'reaction'
  | 'file_shared'
  | 'member_joined'
  | 'member_left'
  | 'group_updated'
  | 'invitation';

export interface ChatFilters {
  search?: string;
  unreadOnly?: boolean;
  participant?: string;
  isGroup?: boolean;
  isArchived?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'lastActivity' | 'unreadCount' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ChatSearchResult {
  conversations: Conversation[];
  messages: Message[];
  users: ChatUser[];
  total: number;
  hasMore: boolean;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  conversationId: string;
  isTyping: boolean;
  startedAt: string;
}

export interface ChatPresence {
  userId: string;
  status: UserStatus;
  lastSeen: string;
  currentActivity?: string;
  deviceInfo?: {
    platform: string;
    browser?: string;
    app?: string;
  };
}


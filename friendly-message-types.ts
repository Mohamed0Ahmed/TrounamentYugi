// ========================================
// Friendly Message System TypeScript Types
// ========================================

// DTOs
export interface SendFriendlyMessageDto {
  content: string;
}

export interface FriendlyMessageDto {
  id: number;
  playerId: number;
  playerFullName: string;
  content: string;
  isRead: boolean;
  sentAt: string;
  isFromAdmin: boolean;
  messageType: string;
}

// API Response Types
export interface FriendlyMessageResponse {
  success: boolean;
  message: string;
  messages?: FriendlyMessageDto[];
}

export interface FriendlyMessageStatsResponse {
  success: boolean;
  unreadCount: number;
  playerId?: number;
}

// API Service Interface
export interface IFriendlyMessageService {
  // Player Actions
  sendMessageToAdmin(
    playerId: number,
    content: string
  ): Promise<FriendlyMessageResponse>;
  getPlayerMessages(playerId: number): Promise<FriendlyMessageResponse>;

  // Admin Actions
  getAllMessages(): Promise<FriendlyMessageResponse>;
  getUnreadMessages(): Promise<FriendlyMessageResponse>;
  getReadMessages(): Promise<FriendlyMessageResponse>;
  getPlayerConversation(playerId: number): Promise<FriendlyMessageResponse>;
  sendAdminReply(
    playerId: number,
    content: string
  ): Promise<FriendlyMessageResponse>;
  markMessageAsRead(messageId: number): Promise<FriendlyMessageResponse>;
  markAllPlayerMessagesAsRead(
    playerId: number
  ): Promise<FriendlyMessageResponse>;
  deleteMessage(messageId: number): Promise<FriendlyMessageResponse>;

  // Statistics
  getUnreadMessagesCount(): Promise<FriendlyMessageStatsResponse>;
  getPlayerUnreadMessagesCount(
    playerId: number
  ): Promise<FriendlyMessageStatsResponse>;
}

// Endpoint Constants
export const FRIENDLY_MESSAGE_ENDPOINTS = {
  // Player Actions
  SEND_MESSAGE: '/FriendlyMessage/send',
  GET_PLAYER_MESSAGES: '/FriendlyMessage/my-messages',

  // Admin Actions
  GET_ALL_MESSAGES: '/FriendlyMessage/inbox',
  GET_UNREAD_MESSAGES: '/FriendlyMessage/unread-messages',
  GET_READ_MESSAGES: '/FriendlyMessage/read-messages',
  GET_PLAYER_CONVERSATION: (playerId: number) =>
    `/FriendlyMessage/conversation/${playerId}`,
  SEND_ADMIN_REPLY: (playerId: string) => `/FriendlyMessage/reply/${playerId}`,
  MARK_MESSAGE_READ: (messageId: number) =>
    `/FriendlyMessage/mark/${messageId}`,
  MARK_ALL_PLAYER_MESSAGES_READ: (playerId: number) =>
    `/FriendlyMessage/mark-all-read/${playerId}`,
  DELETE_MESSAGE: (messageId: number) => `/FriendlyMessage/delete/${messageId}`,

  // Statistics
  GET_UNREAD_COUNT: '/FriendlyMessage/stats/unread-count',
  GET_PLAYER_UNREAD_COUNT: (playerId: number) =>
    `/FriendlyMessage/stats/player/${playerId}/unread-count`,

  // Test
  TEST: '/FriendlyMessage/test',
} as const;

// Validation Functions
export const validateFriendlyMessageContent = (content: string): string[] => {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('محتوى الرسالة مطلوب');
  }

  if (content && content.length > 2000) {
    errors.push('محتوى الرسالة يجب أن يكون أقل من 2000 حرف');
  }

  if (content && content.trim().length < 3) {
    errors.push('محتوى الرسالة يجب أن يكون أكثر من 3 أحرف');
  }

  return errors;
};

// Utility Functions
export const formatMessageDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    return `منذ ${diffInMinutes} دقيقة`;
  } else if (diffInHours < 24) {
    return `منذ ${Math.floor(diffInHours)} ساعة`;
  } else if (diffInHours < 168) {
    // 7 days
    const diffInDays = Math.floor(diffInHours / 24);
    return `منذ ${diffInDays} يوم`;
  } else {
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

export const getMessageTypeLabel = (isFromAdmin: boolean): string => {
  return isFromAdmin ? 'رد الإدارة' : 'رسالة اللاعب';
};

export const getMessageStatusLabel = (
  isRead: boolean,
  isFromAdmin: boolean
): string => {
  if (isFromAdmin) {
    return 'تم الإرسال';
  }
  return isRead ? 'تم القراءة' : 'غير مقروءة';
};

// Sorting and Filtering Functions
export const sortMessagesByDate = (
  messages: FriendlyMessageDto[],
  ascending: boolean = false
): FriendlyMessageDto[] => {
  return messages.sort((a, b) => {
    const dateA = new Date(a.sentAt).getTime();
    const dateB = new Date(b.sentAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const filterMessagesByType = (
  messages: FriendlyMessageDto[],
  isFromAdmin?: boolean
): FriendlyMessageDto[] => {
  if (isFromAdmin === undefined) {
    return messages;
  }
  return messages.filter((msg) => msg.isFromAdmin === isFromAdmin);
};

export const filterMessagesByReadStatus = (
  messages: FriendlyMessageDto[],
  isRead?: boolean
): FriendlyMessageDto[] => {
  if (isRead === undefined) {
    return messages;
  }
  return messages.filter((msg) => msg.isRead === isRead);
};

// Statistics Functions
export const calculateUnreadCount = (
  messages: FriendlyMessageDto[]
): number => {
  return messages.filter((msg) => !msg.isRead && !msg.isFromAdmin).length;
};

export const calculatePlayerUnreadCount = (
  messages: FriendlyMessageDto[],
  playerId: number
): number => {
  return messages.filter(
    (msg) => msg.playerId === playerId && !msg.isRead && !msg.isFromAdmin
  ).length;
};

// Conversation Functions
export const getConversationSummary = (messages: FriendlyMessageDto[]) => {
  const unreadCount = calculateUnreadCount(messages);
  const lastMessage = messages[messages.length - 1];

  return {
    totalMessages: messages.length,
    unreadCount,
    lastMessage: lastMessage?.content || '',
    lastMessageDate: lastMessage?.sentAt || '',
    hasUnread: unreadCount > 0,
  };
};

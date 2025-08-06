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
    SEND_MESSAGE: (playerId: number) => `/api/FriendlyMessage/send/${playerId}`,
    GET_PLAYER_MESSAGES: (playerId: number) =>
        `/api/FriendlyMessage/player/${playerId}/messages`,

    // Admin Actions
    GET_ALL_MESSAGES: "/api/FriendlyMessage/all",
    GET_UNREAD_MESSAGES: "/api/FriendlyMessage/unread",
    GET_READ_MESSAGES: "/api/FriendlyMessage/read",
    GET_PLAYER_CONVERSATION: (playerId: number) =>
        `/api/FriendlyMessage/conversation/${playerId}`,
    SEND_ADMIN_REPLY: (playerId: number) =>
        `/api/FriendlyMessage/reply/${playerId}`,
    MARK_MESSAGE_READ: (messageId: number) =>
        `/api/FriendlyMessage/mark-read/${messageId}`,
    MARK_ALL_PLAYER_MESSAGES_READ: (playerId: number) =>
        `/api/FriendlyMessage/mark-all-read/${playerId}`,
    DELETE_MESSAGE: (messageId: number) => `/api/FriendlyMessage/${messageId}`,

    // Statistics
    GET_UNREAD_COUNT: "/api/FriendlyMessage/stats/unread-count",
    GET_PLAYER_UNREAD_COUNT: (playerId: number) =>
        `/api/FriendlyMessage/stats/player/${playerId}/unread-count`,

    // Test
    TEST: "/api/FriendlyMessage/test",
} as const;

// Validation Functions
export const validateFriendlyMessageContent = (content: string): string[] => {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
        errors.push("محتوى الرسالة مطلوب");
    }

    if (content && content.trim().length < 5) {
        errors.push("الرسالة يجب أن تكون أكثر من 5 أحرف");
    }

    if (content && content.trim().length > 2000) {
        errors.push("الرسالة يجب أن تكون أقل من 2000 حرف");
    }

    return errors;
};

// Utility Functions
export const formatMessageDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
        return "منذ قليل";
    } else if (diffInHours < 24) {
        return `منذ ${Math.floor(diffInHours)} ساعة`;
    } else if (diffInDays < 7) {
        return `منذ ${Math.floor(diffInDays)} يوم`;
    } else {
        return date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
};

export const getMessageTypeLabel = (isFromAdmin: boolean): string => {
    return isFromAdmin ? "رد الإدارة" : "رسالة اللاعب";
};

export const getMessageStatusLabel = (
    isRead: boolean,
    isFromAdmin: boolean
): string => {
    if (isFromAdmin) {
        return "تم الإرسال";
    }
    return isRead ? "تم القراءة" : "غير مقروءة";
};

// Message Sorting and Filtering
export const sortMessagesByDate = (
    messages: FriendlyMessageDto[],
    ascending: boolean = false
): FriendlyMessageDto[] => {
    return [...messages].sort((a, b) => {
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

// Statistics Helpers
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
        (msg) => msg.playerId === playerId && !msg.isRead && msg.isFromAdmin
    ).length;
};

export const getConversationSummary = (messages: FriendlyMessageDto[]) => {
    const totalMessages = messages.length;
    const playerMessages = messages.filter((msg) => !msg.isFromAdmin).length;
    const adminReplies = messages.filter((msg) => msg.isFromAdmin).length;
    const unreadCount = calculateUnreadCount(messages);

    return {
        totalMessages,
        playerMessages,
        adminReplies,
        unreadCount,
        lastMessageDate: messages.length > 0 ? messages[0].sentAt : null,
    };
};

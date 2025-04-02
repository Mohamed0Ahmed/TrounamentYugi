export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface ResultResponse {
  success: boolean;
  message: string;
}

export interface Player {
  playerId: number;
  fullName: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  matchesPlayed: number;
  rank: number;
  winRate: number;
}

export interface CommonResponse {
  success: boolean;
  message: string;
}

export interface MessagesResponse {
  success: boolean;
  message: string;
  messages: Message[];
}

export interface Message {
  id: number;
  senderId: string;
  senderFullName: string;
  senderPhoneNumber: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
  sentAt: string;
}

export interface Match {
  matchId: number;
  score1: number;
  score2: number;
  isCompleted: boolean;
  player1Name: string;
  player2Name: string;
  player1Id: number;
  player2Id: number;
}

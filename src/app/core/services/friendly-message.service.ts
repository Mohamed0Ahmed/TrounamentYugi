import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FriendlyMessageResponse,
  FriendlyMessageStatsResponse,
  FRIENDLY_MESSAGE_ENDPOINTS,
} from 'friendly-message-types';

@Injectable({
  providedIn: 'root',
})
export class FriendlyMessageService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Player Actions
  sendMessageToAdmin(
    playerId: number,
    content: string
  ): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.SEND_MESSAGE}`;
    return this.http.post<FriendlyMessageResponse>(url, { content });
  }

  getPlayerMessages(playerId: number): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.GET_PLAYER_MESSAGES}`;
    return this.http.get<FriendlyMessageResponse>(url);
  }

  // Admin Actions
  getAllMessages(): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.GET_ALL_MESSAGES}`;
    return this.http.get<FriendlyMessageResponse>(url);
  }

  getUnreadMessages(): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.GET_UNREAD_MESSAGES}`;
    return this.http.get<FriendlyMessageResponse>(url);
  }

  getReadMessages(): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.GET_READ_MESSAGES}`;
    return this.http.get<FriendlyMessageResponse>(url);
  }

  getPlayerConversation(playerId: number): Observable<FriendlyMessageResponse> {
    const url = `${
      this.baseUrl
    }${FRIENDLY_MESSAGE_ENDPOINTS.GET_PLAYER_CONVERSATION(playerId)}`;
    return this.http.get<FriendlyMessageResponse>(url);
  }

  sendAdminReply(
    playerId: number,
    content: string
  ): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.SEND_ADMIN_REPLY(
      playerId.toString()
    )}`;
    return this.http.post<FriendlyMessageResponse>(url, { content });
  }

  markMessageAsRead(messageId: number): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.MARK_MESSAGE_READ(
      messageId
    )}`;
    return this.http.post<FriendlyMessageResponse>(url, { marked: true });
  }

  markAllPlayerMessagesAsRead(
    playerId: number
  ): Observable<FriendlyMessageResponse> {
    const url = `${
      this.baseUrl
    }${FRIENDLY_MESSAGE_ENDPOINTS.MARK_ALL_PLAYER_MESSAGES_READ(playerId)}`;
    return this.http.post<FriendlyMessageResponse>(url, { marked: true });
  }

  deleteMessage(messageId: number): Observable<FriendlyMessageResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.DELETE_MESSAGE(
      messageId
    )}`;
    return this.http.post<FriendlyMessageResponse>(url, { marked: true });
  }

  // Statistics
  getUnreadMessagesCount(): Observable<FriendlyMessageStatsResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.GET_UNREAD_COUNT}`;
    return this.http.get<FriendlyMessageStatsResponse>(url);
  }

  getPlayerUnreadMessagesCount(
    playerId: number
  ): Observable<FriendlyMessageStatsResponse> {
    const url = `${
      this.baseUrl
    }${FRIENDLY_MESSAGE_ENDPOINTS.GET_PLAYER_UNREAD_COUNT(playerId)}`;
    return this.http.get<FriendlyMessageStatsResponse>(url);
  }

  // Test endpoint
  testConnection(): Observable<any> {
    const url = `${this.baseUrl}${FRIENDLY_MESSAGE_ENDPOINTS.TEST}`;
    return this.http.get(url);
  }
}

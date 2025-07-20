import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonResponse, MessagesResponse } from 'src/app/models/interfaces';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  sendMessage(message: string): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(`${this.baseUrl}/Message/send`, {
      Content: message,
    });
  }

  getMessages(): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(`${this.baseUrl}/Message/inbox`);
  }

  // Admin-specific method with 30-minute cache
  getAdminMessages(): Observable<MessagesResponse> {
    return this.cacheService.cacheAdminRequest(
      'admin-messages-list',
      this.http.get<MessagesResponse>(`${this.baseUrl}/Message/inbox`)
    );
  }

  toggleMarkMessage(
    messageId: number,
    marked: boolean
  ): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/Message/mark/${messageId}`,
      { Marked: marked }
    );
  }

  toggleDeleteMessage(
    messageId: number,
    marked: boolean
  ): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/Message/delete/${messageId}`,
      { Marked: marked }
    );
  }

  getPlayerMessages(): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(
      `${this.baseUrl}/Message/my-messages`
    );
  }

  sendAdminReply(
    playerId: string,
    message: string
  ): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/Message/reply/${playerId}`,
      { Content: message }
    );
  }
}

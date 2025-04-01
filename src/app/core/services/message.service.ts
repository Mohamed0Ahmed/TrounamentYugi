import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonResponse, MessagesResponse } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(`${this.baseUrl}/Message/send`, { Content:message });
  }

  getMessages(): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(`${this.baseUrl}/Message/inbox`);
  }

  toggleMarkMessage(messageId: number, marked: boolean): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(`${this.baseUrl}/Message/mark/${messageId}`, { Marked: marked });
  }
}

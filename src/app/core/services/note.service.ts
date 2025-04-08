import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommonResponse,
  NoteResponse,
} from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendNote(message: string): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(`${this.baseUrl}/note/write`, {
      Content: message,
    });
  }

  getNotes(): Observable<NoteResponse> {
    return this.http.get<NoteResponse>(`${this.baseUrl}/note/notes`);
  }

  toggleMarHide(noteId: number, marked: boolean): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/note/hide/${noteId}`,
      { Marked: marked }
    );
  }

  DeleteNote(
    noteId: number,
    marked: boolean
  ): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/note/delete/${noteId}`,
      { Marked: marked }
    );
  }


}

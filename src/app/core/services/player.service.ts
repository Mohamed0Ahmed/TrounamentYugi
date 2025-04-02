import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonResponse } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = environment.apiUrl;

  private rankingSubject = new BehaviorSubject<[]>([]);
  ranking$ = this.rankingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getrank(): Observable<[]> {
    return this.http
      .get<[]>(`${this.baseUrl}/player/ranking`)
      .pipe(tap((data) => this.rankingSubject.next(data)));
  }
  getPlayers(): Observable<[]> {
    return this.http
      .get<[]>(`${this.baseUrl}/player`)
      .pipe(tap((data) => this.rankingSubject.next(data)));
  }

  addPlayer(fullName: string): Observable<CommonResponse> {
    return this.http
      .post<CommonResponse>(`${this.baseUrl}/player`, { fullName })
      .pipe(tap(() => this.refreshPlayers()));
  }

  deletePlayer(playerId: number): Observable<CommonResponse> {
    return this.http
      .delete<CommonResponse>(`${this.baseUrl}/player/${playerId}`)
      .pipe(tap(() => this.refreshPlayers()));
  }

  refreshRanking() {
    this.http.get<[]>(`${this.baseUrl}/player/ranking`).subscribe((data) => {
      this.rankingSubject.next(data);
    });
  }
  refreshPlayers() {
    this.http.get<[]>(`${this.baseUrl}/player`).subscribe((data) => {
      this.rankingSubject.next(data);
    });
  }
}

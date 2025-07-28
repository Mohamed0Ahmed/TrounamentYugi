import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonResponse } from 'src/app/models/interfaces';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = environment.apiUrl;

  private rankingSubject = new BehaviorSubject<[]>([]);
  ranking$ = this.rankingSubject.asObservable();

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getrank(): Observable<[]> {
    return this.cacheService.cachePlayerRequest(
      'player-ranking',
      this.http
        .get<[]>(`${this.baseUrl}/player/ranking`)
        .pipe(tap((data) => this.rankingSubject.next(data)))
    );
  }

  getPlayers(): Observable<[]> {
    return this.cacheService.cachePlayerRequest(
      'players-list',
      this.http
        .get<[]>(`${this.baseUrl}/player`)
        .pipe(tap((data) => this.rankingSubject.next(data)))
    );
  }

  // Admin-specific method with 30-minute cache
  getAdminPlayers(): Observable<[]> {
    return this.http
      .get<[]>(`${this.baseUrl}/player`)
      .pipe(tap((data) => this.rankingSubject.next(data)));
  }

  addPlayer(fullName: string): Observable<CommonResponse> {
    return this.http
      .post<CommonResponse>(`${this.baseUrl}/player`, { fullName })
      .pipe(
        tap(() => {
          this.cacheService.invalidatePattern('player');
          this.refreshPlayers();
        })
      );
  }

  deletePlayer(playerId: number): Observable<CommonResponse> {
    return this.http
      .delete<CommonResponse>(`${this.baseUrl}/player/${playerId}`)
      .pipe(
        tap(() => {
          this.cacheService.invalidatePattern('player');
          this.refreshPlayers();
        })
      );
  }

  refreshRanking() {
    this.cacheService.remove('player-ranking');
    this.http.get<[]>(`${this.baseUrl}/player/ranking`).subscribe((data) => {
      this.rankingSubject.next(data);
    });
  }

  refreshPlayers() {
    this.cacheService.remove('players-list');
    this.http.get<[]>(`${this.baseUrl}/player`).subscribe((data) => {
      this.rankingSubject.next(data);
    });
  }

  // Get next update time
  getNextUpdateTime(): Date {
    return this.cacheService.getNextPlayerUpdateTime();
  }

  // Get last update time for ranking
  getLastRankingUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('player-ranking');
  }

  // Get last update time for players list
  getLastPlayersUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('players-list');
  }
}

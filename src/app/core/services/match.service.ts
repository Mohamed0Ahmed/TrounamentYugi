import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Match, ResultResponse } from 'src/app/models/interfaces';
import { PlayerService } from './player.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private playerService: PlayerService,
    private cacheService: CacheService
  ) {}

  getMatches(): Observable<Match[]> {
    return this.cacheService.cachePlayerRequest(
      'matches-list',
      this.http.get<Match[]>(`${this.baseUrl}/match`)
    );
  }

  // Admin-specific method with 30-minute cache
  getAdminMatches(): Observable<Match[]> {
    return this.cacheService.cacheAdminRequest(
      'admin-matches-list',
      this.http.get<Match[]>(`${this.baseUrl}/match`)
    );
  }

  updateMatch(
    matchId: number,
    winnerId: number | null
  ): Observable<ResultResponse> {
    return this.http
      .post<ResultResponse>(`${this.baseUrl}/match/${matchId}/result`, {
        winnerId,
      })
      .pipe(
        tap(() => {
          this.cacheService.invalidatePattern('match');
          this.cacheService.invalidatePattern('player');
          this.playerService.refreshPlayers();
        })
      );
  }

  resetMatch(matchId: number): Observable<ResultResponse> {
    return this.http
      .delete<ResultResponse>(`${this.baseUrl}/match/reset/${matchId}`)
      .pipe(
        tap(() => {
          this.cacheService.invalidatePattern('match');
          this.cacheService.invalidatePattern('player');
          this.playerService.refreshPlayers();
        })
      );
  }

  // Get last update time for matches
  getLastMatchesUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('matches-list');
  }
}

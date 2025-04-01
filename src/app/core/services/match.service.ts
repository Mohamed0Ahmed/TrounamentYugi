import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Match, ResultResponse } from 'src/app/models/interfaces';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private playerService: PlayerService) {}

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.baseUrl}/match`);
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
        tap(() => this.playerService.refreshRanking())
      );
  }

  resetMatch(matchId: number): Observable<ResultResponse> {
    return this.http
      .delete<ResultResponse>(`${this.baseUrl}/match/reset/${matchId}`)
      .pipe(
        tap(() => this.playerService.refreshRanking())
      );
  }
}

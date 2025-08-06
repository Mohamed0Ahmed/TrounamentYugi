import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';
import {
  FriendlyPlayerDto,
  FriendlyMatchHistoryDto,
  OverallScoreDto,
  ShutoutResultDto,
  PlayerStats,
  FRIENDLY_MATCH_ENDPOINTS,
  RecordFriendlyMatchDto,
  ApiResponse,
} from 'friendly-match-types';

@Injectable({
  providedIn: 'root',
})
export class FriendlyMatchService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  // Player Management (Public endpoints only)
  getAllFriendlyPlayers(): Observable<FriendlyPlayerDto[]> {
    return this.cacheService.cachePlayerRequest(
      'friendly-players',
      this.http.get<FriendlyPlayerDto[]>(
        `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_ALL_PLAYERS}`
      )
    );
  }

  getFriendlyPlayersRanking(): Observable<FriendlyPlayerDto[]> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_PLAYERS_RANKING}`;
    return this.http.get<FriendlyPlayerDto[]>(url);
  }

  getFriendlyPlayerStats(
    playerId: number
  ): Observable<FriendlyPlayerDto | null> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_PLAYER_STATS(
      playerId
    )}`;
    return this.http.get<FriendlyPlayerDto | null>(url);
  }

  getPlayersStatistics(): Observable<PlayerStats[]> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_PLAYERS_RANKING}`;
    return this.http.get<PlayerStats[]>(url);
  }

  // Admin-specific Player Management
  addFriendlyPlayerAsync(fullName: string): Observable<ApiResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.ADD_PLAYER}`;
    return this.http.post<ApiResponse>(url, { fullName });
  }

  deleteFriendlyPlayerAsync(playerId: number): Observable<ApiResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.DELETE_PLAYER(
      playerId
    )}`;
    return this.http.delete<ApiResponse>(url);
  }

  deactivateFriendlyPlayerAsync(playerId: number): Observable<ApiResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.DEACTIVATE_PLAYER(
      playerId
    )}`;
    return this.http.put<ApiResponse>(url, {});
  }

  // Match Management (Public endpoints only)
  getAllFriendlyMatches(): Observable<FriendlyMatchHistoryDto[]> {
    return this.cacheService.cachePlayerRequest(
      'friendly-matches',
      this.http.get<FriendlyMatchHistoryDto[]>(
        `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_ALL_MATCHES}`
      )
    );
  }

  getFriendlyMatchesBetweenPlayers(
    player1Id: number,
    player2Id: number
  ): Observable<FriendlyMatchHistoryDto[]> {
    const url = `${
      this.baseUrl
    }${FRIENDLY_MATCH_ENDPOINTS.GET_MATCHES_BETWEEN_PLAYERS(
      player1Id,
      player2Id
    )}`;
    return this.http.get<FriendlyMatchHistoryDto[]>(url);
  }

  // Admin-specific Match Management
  recordFriendlyMatchAsync(
    matchData: RecordFriendlyMatchDto
  ): Observable<ApiResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.RECORD_MATCH}`;
    return this.http.post<ApiResponse>(url, matchData);
  }

  updateFriendlyMatchAsync(
    matchId: number,
    matchData: RecordFriendlyMatchDto
  ): Observable<ApiResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.UPDATE_MATCH(
      matchId
    )}`;
    return this.http.put<ApiResponse>(url, matchData);
  }

  deleteFriendlyMatchAsync(matchId: number): Observable<ApiResponse> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.DELETE_MATCH(
      matchId
    )}`;
    return this.http.delete<ApiResponse>(url);
  }

  // Statistics and Analysis
  getOverallScoreBetweenPlayers(
    player1Id: number,
    player2Id: number
  ): Observable<OverallScoreDto | null> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_OVERALL_SCORE(
      player1Id,
      player2Id
    )}`;
    return this.http.get<OverallScoreDto | null>(url);
  }

  // Shutout Results (Public endpoints only)
  getAllShutoutResults(): Observable<ShutoutResultDto[]> {
    return this.cacheService.cachePlayerRequest(
      'friendly-shutouts',
      this.http.get<ShutoutResultDto[]>(
        `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_ALL_SHUTOUTS}`
      )
    );
  }

  getShutoutResultsByPlayer(playerId: number): Observable<ShutoutResultDto[]> {
    const url = `${
      this.baseUrl
    }${FRIENDLY_MATCH_ENDPOINTS.GET_SHUTOUTS_BY_PLAYER(playerId)}`;
    return this.http.get<ShutoutResultDto[]>(url);
  }

  getShutoutResultByMatch(
    matchId: number
  ): Observable<ShutoutResultDto | null> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_SHUTOUT_BY_MATCH(
      matchId
    )}`;
    return this.http.get<ShutoutResultDto | null>(url);
  }

  // Advanced Filtering (Public endpoints only)
  getFilteredMatches(filter: any): Observable<any> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_FILTERED_MATCHES}`;
    return this.http.get(url, { params: filter });
  }

  getPlayerMatches(playerId: number, filter: any): Observable<any> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.GET_PLAYER_MATCHES(
      playerId
    )}`;
    return this.http.get(url, { params: filter });
  }

  getPlayerVsOpponentsMatches(
    playerId: number,
    opponentIds: number[],
    filter: any
  ): Observable<any> {
    const url = `${
      this.baseUrl
    }${FRIENDLY_MATCH_ENDPOINTS.GET_PLAYER_VS_OPPONENTS(playerId)}`;
    return this.http.post(url, opponentIds, { params: filter });
  }

  // Test endpoint
  testConnection(): Observable<any> {
    const url = `${this.baseUrl}${FRIENDLY_MATCH_ENDPOINTS.TEST}`;
    return this.http.get(url);
  }

  // Cache Management (for admin component compatibility)
  refreshFriendlyPlayers(): void {
    this.cacheService.remove('friendly-players');
  }

  refreshFriendlyMatches(): void {
    this.cacheService.remove('friendly-matches');
  }

  refreshFriendlyShutouts(): void {
    this.cacheService.remove('friendly-shutouts');
  }
}

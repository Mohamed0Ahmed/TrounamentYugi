import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';

export interface FriendlyPlayerDto {
  playerId: number;
  fullName: string;
  createdOn: string;
  isActive: boolean;
  totalMatches?: number;
  totalWins?: number;
  totalLosses?: number;
  totalDraws?: number;
  winRate?: number;
}

export interface FriendlyMatchDto {
  matchId: number;
  player1Id: number;
  player2Id: number;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  playedOn: string;
  isDeleted: boolean;
}

export interface RecordFriendlyMatchDto {
  player1Id: number;
  player2Id: number;
  player1Score: number;
  player2Score: number;
  playedOn: Date;
}

export enum DateFilter {
  Today = 1,
  Last3Days = 2,
  LastWeek = 3,
  LastMonth = 4,
  AllTime = 5,
}

export interface MatchFilterDto {
  playerId?: number;
  opponentIds?: number[];
  dateFilter?: DateFilter;
  page?: number;
  pageSize?: number;
}

export interface PaginatedMatchResultDto {
  matches: FriendlyMatchDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class FriendlyMatchService {
  private baseUrl = `${environment.apiUrl}/FriendlyMatch`;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  // Player Management
  getAllFriendlyPlayersAsync(): Observable<FriendlyPlayerDto[]> {
    return this.cacheService.cachePlayerRequest(
      'friendly-players',
      this.http.get<FriendlyPlayerDto[]>(`${this.baseUrl}/players`)
    );
  }

  getFriendlyPlayerByIdAsync(
    playerId: number
  ): Observable<FriendlyPlayerDto | null> {
    return this.http.get<FriendlyPlayerDto | null>(
      `${this.baseUrl}/players/${playerId}`
    );
  }

  addFriendlyPlayerAsync(fullName: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/players`, { fullName });
  }

  deleteFriendlyPlayerAsync(playerId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/players/${playerId}`);
  }

  deactivateFriendlyPlayerAsync(playerId: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/players/${playerId}/deactivate`,
      {}
    );
  }

  // Player Statistics
  getFriendlyPlayersRankingAsync(): Observable<FriendlyPlayerDto[]> {
    return this.http.get<FriendlyPlayerDto[]>(
      `${this.baseUrl}/players/ranking`
    );
  }

  getFriendlyPlayerStatsAsync(
    playerId: number
  ): Observable<FriendlyPlayerDto | null> {
    return this.http.get<FriendlyPlayerDto | null>(
      `${this.baseUrl}/players/${playerId}/stats`
    );
  }

  getPlayersStatisticsAsync(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/players/statistics`);
  }

  // Match Management
  getAllFriendlyMatchesAsync(): Observable<FriendlyMatchDto[]> {
    return this.cacheService.cachePlayerRequest(
      'friendly-matches',
      this.http.get<FriendlyMatchDto[]>(`${this.baseUrl}/matches`)
    );
  }

  getFriendlyMatchesBetweenPlayersAsync(
    player1Id: number,
    player2Id: number
  ): Observable<FriendlyMatchDto[]> {
    return this.http.get<FriendlyMatchDto[]>(
      `${this.baseUrl}/matches/${player1Id}/${player2Id}`
    );
  }

  recordFriendlyMatchAsync(
    dto: RecordFriendlyMatchDto
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/matches/record`, dto);
  }

  deleteFriendlyMatchAsync(matchId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/matches/${matchId}`);
  }

  updateFriendlyMatchAsync(
    matchId: number,
    dto: RecordFriendlyMatchDto
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/matches/${matchId}`,
      dto
    );
  }

  // Overall Score
  getOverallScoreBetweenPlayersAsync(
    player1Id: number,
    player2Id: number
  ): Observable<any | null> {
    return this.http.get<any | null>(
      `${this.baseUrl}/overall-score/${player1Id}/${player2Id}`
    );
  }

  // Shutout Results
  getAllShutoutResultsAsync(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/shutouts`);
  }

  getShutoutResultsByPlayerAsync(playerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/shutouts/player/${playerId}`);
  }

  getShutoutResultByMatchAsync(matchId: number): Observable<any | null> {
    return this.http.get<any | null>(
      `${this.baseUrl}/shutouts/match/${matchId}`
    );
  }

  deleteShutoutResultAsync(shutoutId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/shutouts/${shutoutId}`
    );
  }

  // Advanced Filtering
  getFilteredShutoutsAsync(filter: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/shutouts/filtered`, {
      params: filter,
    });
  }

  getPlayerShutoutsAsync(playerId: number, filter: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/shutouts/player/${playerId}/filtered`,
      { params: filter }
    );
  }

  getPlayersShutoutsAsync(playerIds: number[], filter: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/shutouts/players/filtered`,
      playerIds,
      { params: filter }
    );
  }

  getFilteredMatchesAsync(
    filter: MatchFilterDto
  ): Observable<PaginatedMatchResultDto> {
    return this.http.get<PaginatedMatchResultDto>(
      `${this.baseUrl}/matches/filtered`,
      { params: filter as any }
    );
  }

  getPlayerMatchesAsync(playerId: number, filter: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/matches/player/${playerId}`, {
      params: filter,
    });
  }

  getPlayerVsOpponentsMatchesAsync(
    playerId: number,
    opponentIds: number[],
    filter: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/matches/player/${playerId}/vs-opponents`,
      opponentIds,
      { params: filter }
    );
  }

  // Cache Management
  refreshFriendlyPlayers(): void {
    this.cacheService.remove('friendly-players');
  }

  refreshFriendlyMatches(): void {
    this.cacheService.remove('friendly-matches');
  }
}

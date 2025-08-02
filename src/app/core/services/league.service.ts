import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import {
  AllLeagueRank,
  CommonResponse,
  LeagueResponse,
  StartLeagueDto,
} from 'src/app/models/interfaces';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  resetLeague(LeagueId: number): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/league/reset/${LeagueId}`,
      {}
    );
  }

  startLeague(dto: StartLeagueDto): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(`${this.baseUrl}/league/start`, dto);
  }

  GetCurrentLeague(forceRefresh: boolean = false): Observable<LeagueResponse> {
    const request = this.http.get<LeagueResponse>(
      `${this.baseUrl}/league/getCurrentLeague`
    );

    if (forceRefresh || this.cacheService.shouldRefreshCurrentLeague()) {
      return this.cacheService.forceRefresh(
        'current-league',
        request,
        30 * 60 * 1000
      );
    }

    return this.cacheService.cachePlayerRequest('current-league', request);
  }

  // Admin-specific method for current league without cache
  getAdminCurrentLeague(): Observable<LeagueResponse> {
    return this.http.get<LeagueResponse>(
      `${this.baseUrl}/league/getCurrentLeague`
    );
  }

  GetAllLeaguesRank(
    forceRefresh: boolean = false
  ): Observable<AllLeagueRank[]> {
    const request = this.http.get<AllLeagueRank[]>(
      `${this.baseUrl}/player/players/all`
    );

    if (forceRefresh || this.cacheService.shouldRefreshRankings()) {
      return this.cacheService.forceRefresh(
        'all-leagues-rank',
        request,
        30 * 60 * 1000
      );
    }

    return this.cacheService.cacheAllLeaguesRequest(
      'all-leagues-rank',
      request
    );
  }

  // Admin-specific method with 30-minute cache
  getAdminAllLeagues(): Observable<AllLeagueRank[]> {
    return this.http.get<AllLeagueRank[]>(`${this.baseUrl}/player/players/all`);
  }

  DeleteLeague(leagueId: number): Observable<CommonResponse> {
    return this.http.delete<CommonResponse>(
      `${this.baseUrl}/league/delete/${leagueId}`
    );
  }

  createGroupsAndMatches(leagueId: number): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/league/${leagueId}/create-groups`,
      {}
    );
  }

  startKnockoutStage(leagueId: number): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/league/${leagueId}/start-knockouts`,
      {}
    );
  }

  startSemiFinals(leagueId: number): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/league/${leagueId}/start-semifinals`,
      {}
    );
  }

  startFinal(leagueId: number): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${this.baseUrl}/league/${leagueId}/start-final`,
      {}
    );
  }

  // Get last update time for leagues rank
  getLastLeaguesRankUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('all-leagues-rank');
  }

  // Get last update time for current league
  getLastCurrentLeagueUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('current-league');
  }

  // Check if rankings cache is expired
  isRankingsCacheExpired(): boolean {
    return this.cacheService.isCacheExpired('all-leagues-rank');
  }

  // Check if current league cache is expired
  isCurrentLeagueCacheExpired(): boolean {
    return this.cacheService.isCacheExpired('current-league');
  }

  // Get next rankings update time
  getNextRankingsUpdateTime(): Date | null {
    return this.cacheService.getCacheExpiryTime('all-leagues-rank');
  }

  // Get next current league update time
  getNextCurrentLeagueUpdateTime(): Date | null {
    return this.cacheService.getCacheExpiryTime('current-league');
  }

  // Force refresh rankings data
  forceRefreshRankings(): Observable<AllLeagueRank[]> {
    return this.GetAllLeaguesRank(true);
  }

  // Force refresh current league data
  forceRefreshCurrentLeague(): Observable<LeagueResponse> {
    return this.GetCurrentLeague(true);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import {
  AllLeagueMatches,
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

  GetCurrentLeague(): Observable<LeagueResponse> {
    return this.cacheService.cacheAdminRequest(
      'admin-current-league',
      this.http.get<LeagueResponse>(`${this.baseUrl}/league/getCurrentLeague`)
    );
  }

  GetAllLeaguesMatches(): Observable<AllLeagueMatches[]> {
    return this.cacheService.cacheLeagueRequest(
      'all-leagues-matches',
      this.http.get<AllLeagueMatches[]>(`${this.baseUrl}/match/matches/all`)
    );
  }

  GetAllLeaguesRank(): Observable<AllLeagueRank[]> {
    return this.cacheService.cacheLeagueRequest(
      'all-leagues-rank',
      this.http.get<AllLeagueRank[]>(`${this.baseUrl}/player/players/all`)
    );
  }

  // Admin-specific method with 30-minute cache
  getAdminAllLeagues(): Observable<AllLeagueRank[]> {
    return this.cacheService.cacheAdminRequest(
      'admin-all-leagues-list',
      this.http.get<AllLeagueRank[]>(`${this.baseUrl}/player/players/all`)
    );
  }

  DeleteLeague(leagueId: number): Observable<CommonResponse> {
    return this.http.delete<CommonResponse>(
      `${this.baseUrl}/league/delete/${leagueId}`
    );
  }

  // Get last update time for leagues matches
  getLastLeaguesMatchesUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('all-leagues-matches');
  }

  // Get last update time for leagues rank
  getLastLeaguesRankUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('all-leagues-rank');
  }

  // Get last update time for current league
  getLastCurrentLeagueUpdateTime(): Date | null {
    return this.cacheService.getLastUpdateTime('admin-current-league');
  }
}

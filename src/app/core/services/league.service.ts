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

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
    return this.http.get<LeagueResponse>(
      `${this.baseUrl}/league/getCurrentLeague`
    );
  }

  GetAllLeaguesMatches(): Observable<AllLeagueMatches[]> {
    return this.http.get<AllLeagueMatches[]>(
      `${this.baseUrl}/match/matches/all`
    );
  }

  GetAllLeaguesRank(): Observable<AllLeagueRank[]> {
    return this.http.get<AllLeagueRank[]>(`${this.baseUrl}/player/players/all`);
  }

  DeleteLeague(leagueId: number): Observable<CommonResponse> {
    return this.http.delete<CommonResponse>(
      `${this.baseUrl}/league/delete/${leagueId}`
    );
  }
}

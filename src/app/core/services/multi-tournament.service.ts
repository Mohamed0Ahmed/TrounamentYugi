import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MultiTournamentService {
  private readonly apiUrl = `${environment.apiUrl}/multi`;

  constructor(private http: HttpClient) {}

  // ============================
  // 🏆 Tournament Management
  // ============================

  /**
   * إنشاء بطولة جديدة
   * POST /api/multi/tournaments
   */
  createTournament(request: CreateTournamentDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/tournaments`, request);
  }

  /**
   * تحديث حالة البطولة
   * PUT /api/multi/tournaments/{id}/status
   */
  updateTournamentStatus(
    id: number,
    request: UpdateTournamentStatusDto
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/tournaments/${id}/status`,
      request
    );
  }

  /**
   * حذف البطولة
   * DELETE /api/multi/tournaments/{id}
   */
  deleteTournament(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/tournaments/${id}`);
  }

  // ============================
  // 👥 Team Management
  // ============================

  /**
   * إنشاء فريق جديد
   * POST /api/multi/tournaments/{tournamentId}/teams
   */
  createTeam(
    tournamentId: number,
    request: TeamCreateDto
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/tournaments/${tournamentId}/teams`,
      request
    );
  }

  /**
   * تحديث الفريق
   * PUT /api/multi/teams/{teamId}
   */
  updateTeam(teamId: number, request: TeamUpdateDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/teams/${teamId}`,
      request
    );
  }

  /**
   * استبدال لاعب في الفريق (أثناء البطولة)
   * POST /api/multi/teams/{teamId}/replace-player
   */
  replacePlayer(
    teamId: number,
    request: PlayerReplaceDto
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/teams/${teamId}/replace-player`,
      request
    );
  }

  // ============================
  // ⚔️ Match & Results
  // ============================

  /**
   * تسجيل نتيجة مباراة
   * POST /api/multi/matches/{matchId}/result
   */
  recordMatchResult(
    matchId: number,
    request: MultiMatchResultDto
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/matches/${matchId}/result`,
      request
    );
  }

  /**
   * إلغاء نتيجة مباراة (Undo)
   * POST /api/multi/matches/{matchId}/undo
   */
  undoMatchResult(matchId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/matches/${matchId}/undo`,
      {}
    );
  }

  /**
   * جلب مباريات البطولة
   * GET /api/multi/tournaments/{id}/matches
   */
  getTournamentMatches(id: number): Observable<ApiResponse<TeamMatchesDto[]>> {
    return this.http.get<ApiResponse<TeamMatchesDto[]>>(
      `${this.apiUrl}/tournaments/${id}/matches`
    );
  }

  /**
   * جلب مباريات البطولة النشطة
   * GET /api/multi/tournaments/active/matches
   */
  getActiveTournamentMatches(): Observable<ApiResponse<TeamMatchesDto[]>> {
    return this.http.get<ApiResponse<TeamMatchesDto[]>>(
      `${this.apiUrl}/tournaments/active/matches`
    );
  }

  /**
   * جلب مباريات لاعب معين
   * GET /api/multi/players/{playerId}/matches
   */
  getPlayerMatches(
    playerId: number
  ): Observable<ApiResponse<PlayerMatchesDto>> {
    return this.http.get<ApiResponse<PlayerMatchesDto>>(
      `${this.apiUrl}/players/${playerId}/matches`
    );
  }

  // ============================
  // 👤 Player Management
  // ============================

  /**
   * جلب كل اللاعبين
   * GET /api/multi/players
   */
  getAllPlayers(): Observable<ApiResponse<PlayerDetail[]>> {
    return this.http.get<ApiResponse<PlayerDetail[]>>(`${this.apiUrl}/players`);
  }

  /**
   * جلب لاعب محدد
   * GET /api/multi/players/{playerId}
   */
  getPlayerById(playerId: number): Observable<ApiResponse<PlayerDetail>> {
    return this.http.get<ApiResponse<PlayerDetail>>(
      `${this.apiUrl}/players/${playerId}`
    );
  }

  /**
   * إضافة لاعب جديد
   * POST /api/multi/players
   */
  addNewPlayer(request: AddPlayerDto): Observable<ApiResponse<PlayerDetail>> {
    return this.http.post<ApiResponse<PlayerDetail>>(
      `${this.apiUrl}/players`,
      request
    );
  }

  // ============================
  // 📊 General Data
  // ============================

  /**
   * جلب البطولة النشطة (Started فقط)
   * GET /api/multi/tournaments/active
   */
  getActiveTournament(): Observable<ApiResponse<MultiTournamentDto | null>> {
    return this.http
      .get<ApiResponse<MultiTournamentDto>>(`${this.apiUrl}/tournaments/active`)
      .pipe(
        map((response: ApiResponse<MultiTournamentDto>) => {
          if (response.success && response.data) {
            // تأكد أن البطولة نشطة (Started) مش مكتملة (Finished)
            if (response.data.status === 'Finished') {
              return {
                success: false,
                message: 'No active tournament found',
                data: null,
              };
            }
          }
          return response;
        })
      );
  }

  /**
   * جلب كل البطولات
   * GET /api/multi/tournaments
   */
  getAllTournaments(): Observable<ApiResponse<MultiTournamentDto[]>> {
    return this.http.get<ApiResponse<MultiTournamentDto[]>>(
      `${this.apiUrl}/tournaments`
    );
  }

  /**
   * جلب بطولة محددة
   * GET /api/multi/tournaments/{id}
   */
  getTournament(id: number): Observable<ApiResponse<MultiTournamentDto>> {
    return this.http.get<ApiResponse<MultiTournamentDto>>(
      `${this.apiUrl}/tournaments/${id}`
    );
  }

  /**
   * جلب ترتيب البطولة
   * GET /api/multi/tournaments/{id}/standings
   */
  getTournamentStandings(
    id: number
  ): Observable<ApiResponse<TournamentStandingsDto>> {
    return this.http.get<ApiResponse<TournamentStandingsDto>>(
      `${this.apiUrl}/tournaments/${id}/standings`
    );
  }

  // ============================
  // 🔧 Helper Methods
  // ============================

  /**
   * بدء البطولة
   * POST /api/multi/tournaments/{id}/start
   */
  startTournament(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/tournaments/${id}/start`,
      {}
    );
  }

  /**
   * إنهاء البطولة
   * POST /api/multi/tournaments/{id}/finish
   */
  finishTournament(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/tournaments/${id}/finish`,
      {}
    );
  }
}

// ============================
// 🔗 Types & Interfaces
// ============================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Request DTOs
export interface CreateTournamentDto {
  name: string;
  systemOfScoring: 'Classic' | 'Points';
  teamCount: number;
  playersPerTeam: number;
}

export interface UpdateTournamentStatusDto {
  status: 'Started' | 'Finished';
}

export interface TeamCreateDto {
  teamName: string;
  playerIds: number[];
}

export interface TeamUpdateDto {
  teamName?: string;
  playerIds?: number[];
}

export interface MultiMatchResultDto {
  winnerId?: number; // للكلاسيك
  score1?: number; // للنقاط
  score2?: number; // للنقاط
}

export interface PlayerReplaceDto {
  replacedPlayerId: number;
  newPlayerId: number;
}

export interface AddPlayerDto {
  fullName: string;
}

// Response DTOs
export interface MatchDetail {
  multiMatchId: number;
  player1Id: number;
  player1Name: string;
  player2Id: number;
  player2Name: string;
  team1Id: number;
  team1Name: string;
  team2Id: number;
  team2Name: string;
  score1: number | null;
  score2: number | null;
  winnerId: number | null;
  winnerName: string | null;
  isCompleted: boolean;
  completedOn: string | null;
}

export interface PlayerDetail {
  playerId: number;
  fullName: string;
  isActive: boolean;
  createdOn: string;
  multiParticipations: number;
  multiTitlesWon: number;
}

export interface TeamDetail {
  multiTeamId: number;
  teamName: string;
  totalPoints: number;
  wins: number;
  draws: number;
  losses: number;
  createdOn: string;
  players: PlayerDetail[];
}

export interface MultiTournamentDto {
  multiTournamentId: number;
  name: string;
  systemOfScoring: 'Classic' | 'Points';
  teamCount: number;
  playersPerTeam: number;
  status: 'Created' | 'Started' | 'Finished';
  isActive: boolean;
  createdOn: string;
  startedOn: string | null;
  finishedOn: string | null;
  championTeamId: number | null;
  championTeamName: string | null;
  teams: TeamDetail[];
}

export interface TeamMatchesDto {
  team1Id: number;
  team1Name: string;
  team2Id: number;
  team2Name: string;
  matches: MatchDetail[];
}

export interface PlayerMatchesDto {
  playerId: number;
  playerName: string;
  tournamentId: number;
  tournamentName: string;
  totalMatches: number;
  completedMatches: number;
  pendingMatches: number;
  matches: MatchDetail[];
}

export interface StandingItem {
  position: number;
  multiTeamId: number;
  teamName: string;
  totalPoints: number;
  wins: number;
  draws: number;
  losses: number;
  matchesPlayed: number;
}

export interface TournamentStandingsDto {
  tournamentId: number;
  tournamentName: string;
  status: string;
  championTeamId: number | null;
  standings: StandingItem[];
}

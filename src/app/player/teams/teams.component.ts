import { Component, OnInit } from '@angular/core';
import {
  MultiTournamentService,
  MultiTournamentDto,
  TeamMatchesDto,
  TournamentStandingsDto,
  ApiResponse,
  TeamDetail,
  PlayerDetail,
  StandingItem,
} from '../../core/services/multi-tournament.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  activeTournament: MultiTournamentDto | null = null;
  standings: TournamentStandingsDto | null = null;
  tournamentMatches: TeamMatchesDto[] = [];

  // Team Matches Modal
  showTeamMatchesModal = false;
  selectedTeam: any = null;
  selectedOpponent: any = null;
  teamMatches: TeamMatchesDto[] = [];
  isLoadingMatches = false;

  // Player Individual Results Modal
  showPlayerResultsModal = false;
  selectedPlayer: any = null;
  playerIndividualMatches: any[] = [];
  isLoadingPlayerMatches = false;

  // Player Stats Cache
  playerStatsCache: { [playerId: number]: any } = {};

  // Archive Data
  allPlayers: any[] = [];
  pastTournaments: any[] = [];
  isLoadingArchive = false;
  isLoadingPlayers = false;
  isLoadingPastTournaments = false;

  // Archive Team Players Modal
  showArchiveTeamPlayersModal = false;
  selectedArchiveTournament: MultiTournamentDto | null = null;
  selectedArchiveTeam: TeamDetail | null = null;
  archiveTeamPlayers: PlayerDetail[] = [];
  isLoadingArchiveTeamPlayers = false;

  // Tab Management
  activeTab: 'current' | 'archive' = 'current';

  isLoading = false;
  errorMessage = '';

  constructor(private multiTournamentService: MultiTournamentService) {}

  ngOnInit(): void {
    this.loadActiveTournament();
    this.loadArchiveData();
  }

  loadActiveTournament(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.multiTournamentService.getActiveTournament().subscribe({
      next: (response: ApiResponse<MultiTournamentDto | null>) => {
        if (response.success && response.data) {
          this.activeTournament = response.data;
          this.loadTournamentData();
        } else {
          this.activeTournament = null;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading active tournament:', error);
        this.errorMessage = 'Failed to load tournament data';
        this.activeTournament = null;
        this.isLoading = false;
      },
    });
  }

  private loadTournamentData(): void {
    if (!this.activeTournament) return;

    // Load standings
    this.multiTournamentService
      .getTournamentStandings(this.activeTournament.multiTournamentId)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.standings = response.data;
          }
        },
        error: (error) => console.error('Error loading standings:', error),
      });

    // Load matches
    this.multiTournamentService.getActiveTournamentMatches().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.tournamentMatches = response.data;
          // مسح الـ cache عند تحديث المباريات
          this.clearPlayerStatsCache();
        }
      },
      error: (error) => console.error('Error loading matches:', error),
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Created':
        return 'text-yellow-400';
      case 'Started':
        return 'text-green-400';
      case 'Finished':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }

  getTrophyIcon(position: number): string {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  }

  getCompletedMatchesCount(): number {
    return this.tournamentMatches.reduce(
      (total, fixture) =>
        total + fixture.matches.filter((match) => match.isCompleted).length,
      0
    );
  }

  getTotalMatchesCount(): number {
    return this.tournamentMatches.reduce(
      (total, fixture) => total + fixture.matches.length,
      0
    );
  }

  getTotalPlayersCount(): number {
    return (
      this.activeTournament?.teams.reduce(
        (total, team) => total + team.players.length,
        0
      ) || 0
    );
  }

  // Team Matches Modal Methods
  showTeamMatches(team: any, opponent: any): void {
    this.selectedTeam = team;
    this.selectedOpponent = opponent;
    this.showTeamMatchesModal = true;
    this.loadTeamMatches(team, opponent);
  }

  closeTeamMatchesModal(): void {
    this.showTeamMatchesModal = false;
    this.selectedTeam = null;
    this.selectedOpponent = null;
    this.teamMatches = [];
  }

  private loadTeamMatches(team: any, opponent: any): void {
    if (!this.activeTournament || !this.tournamentMatches) return;

    this.isLoadingMatches = true;

    // Filter matches between the selected team and opponent
    this.teamMatches = this.tournamentMatches.filter((fixture) => {
      const team1Name = fixture.team1Name;
      const team2Name = fixture.team2Name;
      return (
        (team1Name === team.teamName && team2Name === opponent.teamName) ||
        (team1Name === opponent.teamName && team2Name === team.teamName)
      );
    });

    this.isLoadingMatches = false;
  }

  // Get all opponents for a team (excluding the team itself)
  getTeamOpponents(team: any): any[] {
    if (!this.activeTournament) return [];
    return this.activeTournament.teams.filter(
      (t) => t.teamName !== team.teamName
    );
  }

  // Player Individual Results Modal Methods
  showPlayerResults(player: any): void {
    this.selectedPlayer = player;
    this.showPlayerResultsModal = true;
    this.loadPlayerIndividualMatches(player);
  }

  closePlayerResultsModal(): void {
    this.showPlayerResultsModal = false;
    this.selectedPlayer = null;
    this.playerIndividualMatches = [];
  }

  private loadPlayerIndividualMatches(player: any): void {
    if (!this.activeTournament || !this.tournamentMatches) return;

    this.isLoadingPlayerMatches = true;

    // Filter all matches for this specific player
    this.playerIndividualMatches = [];

    this.tournamentMatches.forEach((fixture) => {
      fixture.matches.forEach((match) => {
        if (
          match.player1Id === player.playerId ||
          match.player2Id === player.playerId
        ) {
          // Create a match object with player info
          const isPlayer1 = match.player1Id === player.playerId;
          const playerName = isPlayer1 ? match.player1Name : match.player2Name;
          const opponentName = isPlayer1
            ? match.player2Name
            : match.player1Name;
          const playerScore = isPlayer1 ? match.score1 || 0 : match.score2 || 0;
          const opponentScore = isPlayer1
            ? match.score2 || 0
            : match.score1 || 0;

          this.playerIndividualMatches.push({
            ...match,
            playerName: playerName,
            opponentName: opponentName,
            playerScore: playerScore,
            opponentScore: opponentScore,
            isPlayer1: isPlayer1,
            team1Name: fixture.team1Name,
            team2Name: fixture.team2Name,
          });
        }
      });
    });

    // Sort matches by completion status and then by date if available
    this.playerIndividualMatches.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return b.isCompleted ? 1 : -1; // Completed matches first
      }
      return 0;
    });

    this.isLoadingPlayerMatches = false;
  }

  // Get player's team name
  getPlayerTeamName(player: any): string {
    if (!this.activeTournament || !player) return '';

    const team = this.activeTournament.teams.find((t) =>
      t.players.some((p) => p.playerId === player.playerId)
    );

    return team ? team.teamName : '';
  }

  /**
   * حساب إحصائيات اللاعب من المباريات الموجودة
   * يستخدم tournamentMatches لحساب الانتصارات والخسائر والنقاط
   *
   * مثال: إذا لعب لاعب مع خصم 4 مباريات:
   * - كسب 2-2 (4 نقاط)
   * - خسر 1-3 (1 نقطة)
   * - كسب 3-1 (3 نقاط)
   * - خسر 0-4 (0 نقاط)
   *
   * النتيجة: 8 نقاط باللون الأخضر، 8 نقاط باللون الأحمر
   */
  getPlayerStats(playerId: number): any {
    // استخدام الـ cache إذا كانت البيانات محفوظة
    if (this.playerStatsCache[playerId]) {
      return this.playerStatsCache[playerId];
    }

    if (!this.tournamentMatches || this.tournamentMatches.length === 0) {
      const stats = {
        wins: 0,
        losses: 0,
        totalPoints: 0,
        totalPointsAgainst: 0,
        totalMatches: 0,
      };
      this.playerStatsCache[playerId] = stats;
      return stats;
    }

    let wins = 0;
    let losses = 0;
    let totalPoints = 0;
    let totalPointsAgainst = 0;
    let totalMatches = 0;

    // البحث في جميع المباريات عن مباريات هذا اللاعب
    this.tournamentMatches.forEach((fixture) => {
      fixture.matches.forEach((match) => {
        if (
          match.isCompleted &&
          (match.player1Id === playerId || match.player2Id === playerId)
        ) {
          totalMatches++;

          const isPlayer1 = match.player1Id === playerId;
          const playerScore = isPlayer1 ? match.score1 || 0 : match.score2 || 0;
          const opponentScore = isPlayer1
            ? match.score2 || 0
            : match.score1 || 0;
          // استخدام النقاط من النتيجة (score) بدلاً من totalPoints
          const playerPoints = playerScore;
          const opponentPoints = opponentScore;

          if (playerScore > opponentScore) {
            wins++;
          } else {
            losses++;
          }

          totalPoints += playerPoints;
          totalPointsAgainst += opponentPoints;
        }
      });
    });

    const stats = {
      wins,
      losses,
      totalPoints,
      totalPointsAgainst,
      totalMatches,
    };

    // حفظ النتائج في الـ cache
    this.playerStatsCache[playerId] = stats;
    return stats;
  }

  /**
   * مسح cache إحصائيات اللاعبين
   */
  private clearPlayerStatsCache(): void {
    this.playerStatsCache = {};
  }

  // Archive Methods
  loadArchiveData(): void {
    this.isLoadingArchive = true;
    this.loadAllPlayers();
    this.loadPastTournaments();
  }

  private loadAllPlayers(): void {
    this.isLoadingPlayers = true;
    this.multiTournamentService.getAllPlayers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allPlayers = response.data;
        } else {
          // Fallback data for testing
          this.allPlayers = [
            {
              fullName: 'Test Player 1',
              multiParticipations: 5,
              multiTitlesWon: 2,
            },
            {
              fullName: 'Test Player 2',
              multiParticipations: 3,
              multiTitlesWon: 1,
            },
          ];
        }
        this.isLoadingPlayers = false;
        this.checkArchiveLoadingComplete();
      },
      error: (error) => {
        // Fallback data on error
        this.allPlayers = [
          {
            fullName: 'Error Player 1',
            multiParticipations: 0,
            multiTitlesWon: 0,
          },
          {
            fullName: 'Error Player 2',
            multiParticipations: 0,
            multiTitlesWon: 0,
          },
        ];
        this.isLoadingPlayers = false;
        this.checkArchiveLoadingComplete();
      },
    });
  }

  private loadPastTournaments(): void {
    this.isLoadingPastTournaments = true;
    this.multiTournamentService.getAllTournaments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filter finished tournaments and load their standings
          this.pastTournaments = response.data.filter(
            (t) => t.status === 'Finished'
          );
          this.loadTournamentsStandings();
        } else {
          // Fallback data for testing
          this.pastTournaments = [
            {
              name: 'Test Tournament 1',
              systemOfScoring: 'League',
              status: 'Finished',
              championTeamName: 'Test Champions',
              standings: [
                {
                  teamName: 'Team A',
                  totalPoints: 15,
                  wins: 5,
                  draws: 0,
                  losses: 0,
                  matchesPlayed: 5,
                },
                {
                  teamName: 'Team B',
                  totalPoints: 12,
                  wins: 4,
                  draws: 0,
                  losses: 1,
                  matchesPlayed: 5,
                },
              ],
            },
          ];
        }
        this.isLoadingPastTournaments = false;
        this.checkArchiveLoadingComplete();
      },
      error: (error) => {
        // Fallback data on error
        this.pastTournaments = [
          {
            name: 'Error Tournament',
            systemOfScoring: 'League',
            status: 'Finished',
            championTeamName: 'No Champion',
            standings: [],
          },
        ];
        this.isLoadingPastTournaments = false;
        this.checkArchiveLoadingComplete();
      },
    });
  }

  private checkArchiveLoadingComplete(): void {
    if (!this.isLoadingPlayers && !this.isLoadingPastTournaments) {
      this.isLoadingArchive = false;
    }
  }

  private loadTournamentsStandings(): void {
    this.pastTournaments.forEach((tournament) => {
      this.multiTournamentService
        .getTournamentStandings(tournament.multiTournamentId)
        .subscribe({
          next: (response) => {
            if (response.success && response.data) {
              tournament.standings = response.data.standings;
            }
          },
          error: (error) =>
            console.error(
              `Error loading standings for tournament ${tournament.multiTournamentId}:`,
              error
            ),
        });
    });
  }

  // ============================
  // 📚 Archive: Team Players Modal
  // ============================
  openArchiveTeamPlayers(
    tournament: MultiTournamentDto,
    standing: StandingItem
  ): void {
    if (!tournament || !standing) {
      return;
    }

    this.showArchiveTeamPlayersModal = true;
    this.isLoadingArchiveTeamPlayers = true;
    this.selectedArchiveTournament = tournament;
    this.selectedArchiveTeam = null;
    this.archiveTeamPlayers = [];

    this.multiTournamentService
      .getTournament(tournament.multiTournamentId)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const fullTournament = response.data;
            const team =
              fullTournament.teams.find(
                (t) =>
                  t.multiTeamId === standing.multiTeamId ||
                  t.teamName === standing.teamName
              ) || null;

            this.selectedArchiveTeam = team;
            this.archiveTeamPlayers = team?.players ?? [];
          }
          this.isLoadingArchiveTeamPlayers = false;
        },
        error: () => {
          this.isLoadingArchiveTeamPlayers = false;
        },
      });
  }

  closeArchiveTeamPlayersModal(): void {
    this.showArchiveTeamPlayersModal = false;
    this.isLoadingArchiveTeamPlayers = false;
    this.selectedArchiveTournament = null;
    this.selectedArchiveTeam = null;
    this.archiveTeamPlayers = [];
  }

  /**
   * ترتيب المباريات: المكتملة أولاً، ثم المعلقة
   */
  getCompletedMatches(matches: any[]): any[] {
    return matches.filter((match) => match.isCompleted);
  }

  getPendingMatches(matches: any[]): any[] {
    return matches.filter((match) => !match.isCompleted);
  }
}

import { Component, OnInit } from '@angular/core';
import {
  MultiTournamentService,
  MultiTournamentDto,
  TeamMatchesDto,
  TournamentStandingsDto,
  ApiResponse,
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
  teamMatches: TeamMatchesDto[] = [];
  isLoadingMatches = false;

  // Archive Data
  allPlayers: any[] = [];
  pastTournaments: any[] = [];
  isLoadingArchive = false;
  isLoadingPlayers = false;
  isLoadingPastTournaments = false;

  // Tab Management
  activeTab: 'current' | 'archive' = 'current';

  isLoading = false;
  errorMessage = '';

  constructor(private multiTournamentService: MultiTournamentService) {}

  ngOnInit(): void {
    console.log('Teams component initialized');
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
  showTeamMatches(team: any): void {
    this.selectedTeam = team;
    this.showTeamMatchesModal = true;
    this.loadTeamMatches(team);
  }

  closeTeamMatchesModal(): void {
    this.showTeamMatchesModal = false;
    this.selectedTeam = null;
    this.teamMatches = [];
  }

  private loadTeamMatches(team: any): void {
    if (!this.activeTournament || !this.tournamentMatches) return;

    this.isLoadingMatches = true;

    // Filter matches where the selected team is involved
    this.teamMatches = this.tournamentMatches.filter((fixture) => {
      const team1Name = fixture.team1Name;
      const team2Name = fixture.team2Name;
      return team1Name === team.teamName || team2Name === team.teamName;
    });

    this.isLoadingMatches = false;
  }

  // Archive Methods
  loadArchiveData(): void {
    this.isLoadingArchive = true;
    this.loadAllPlayers();
    this.loadPastTournaments();
  }

  private loadAllPlayers(): void {
    this.isLoadingPlayers = true;
    console.log('Loading all players...');
    this.multiTournamentService.getAllPlayers().subscribe({
      next: (response) => {
        console.log('Players response:', response);
        if (response.success && response.data) {
          this.allPlayers = response.data;
          console.log('Players loaded:', this.allPlayers);
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
          console.log('Using fallback players:', this.allPlayers);
        }
        this.isLoadingPlayers = false;
        this.checkArchiveLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading players:', error);
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
    console.log('Loading past tournaments...');
    this.multiTournamentService.getAllTournaments().subscribe({
      next: (response) => {
        console.log('Tournaments response:', response);
        if (response.success && response.data) {
          // Filter finished tournaments and load their standings
          this.pastTournaments = response.data.filter(
            (t) => t.status === 'Finished'
          );
          console.log('Past tournaments filtered:', this.pastTournaments);
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
          console.log('Using fallback tournaments:', this.pastTournaments);
        }
        this.isLoadingPastTournaments = false;
        this.checkArchiveLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading past tournaments:', error);
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
    console.log('Checking archive loading complete...', {
      isLoadingPlayers: this.isLoadingPlayers,
      isLoadingPastTournaments: this.isLoadingPastTournaments,
    });
    if (!this.isLoadingPlayers && !this.isLoadingPastTournaments) {
      this.isLoadingArchive = false;
      console.log('Archive loading complete!');
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
}

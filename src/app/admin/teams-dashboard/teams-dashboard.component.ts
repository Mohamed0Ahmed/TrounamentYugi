import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  MultiTournamentService,
  CreateTournamentDto,
  TeamCreateDto,
  MultiTournamentDto,
  PlayerDetail,
  AddPlayerDto,
  TeamMatchesDto,
  MatchDetail,
  ApiResponse,
} from '../../core/services/multi-tournament.service';

@Component({
  selector: 'app-teams-dashboard',
  templateUrl: './teams-dashboard.component.html',
  styleUrls: ['./teams-dashboard.component.css'],
})
export class TeamsDashboardComponent implements OnInit {
  // Data
  tournaments: MultiTournamentDto[] = [];
  activeTournament: MultiTournamentDto | null = null;
  availablePlayers: PlayerDetail[] = [];
  tournamentMatches: TeamMatchesDto[] = [];
  selectedPlayer: PlayerDetail | null = null;

  // Modals
  showCreateTournamentModal = false;
  showCreateTeamModal = false;
  showAddPlayerModal = false;
  showRecordResultModal = false;
  showPlayerMatchesModal = false;

  // Forms
  createTournamentForm: CreateTournamentDto = {
    name: '',
    systemOfScoring: 'Classic',
    teamCount: 4,
    playersPerTeam: 3,
  };

  createTeamForm: TeamCreateDto = {
    teamName: '',
    playerIds: [],
  };

  newPlayerName = '';

  // Match Recording
  selectedMatchId: number | null = null;
  selectedPlayer1Id: number | null = null;
  selectedPlayer2Id: number | null = null;
  recordingScore1: number | null = null;
  recordingScore2: number | null = null;

  // Loading States
  isLoadingTournaments = false;
  isLoadingPlayers = false;
  isLoadingMatches = false;
  isCreatingTournament = false;
  isCreatingTeam = false;
  isAddingPlayer = false;
  isRecordingResult = false;

  constructor(
    private multiTournamentService: MultiTournamentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTournaments();
    this.loadAvailablePlayers();
  }

  // Tournament Management
  loadTournaments(): void {
    this.isLoadingTournaments = true;

    this.multiTournamentService.getAllTournaments().subscribe({
      next: (response: ApiResponse<MultiTournamentDto[]>) => {
        if (response.success && response.data) {
          this.tournaments = response.data;
          this.activeTournament =
            this.tournaments.find((t) => t.isActive) || null;

          if (this.activeTournament) {
            this.loadTournamentMatches();
          }
        }
        this.isLoadingTournaments = false;
      },
      error: (error) => {
        console.error('Error loading tournaments:', error);
        this.toastr.error('خطأ في تحميل البطولات', 'خطأ');
        this.isLoadingTournaments = false;
      },
    });
  }

  createTournament(): void {
    if (!this.createTournamentForm.name.trim()) {
      this.toastr.warning('يرجى إدخال اسم البطولة', 'تحذير');
      return;
    }

    this.isCreatingTournament = true;

    this.multiTournamentService
      .createTournament(this.createTournamentForm)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('تم إنشاء البطولة بنجاح', 'نجاح');
            this.loadTournaments();
            this.closeCreateTournamentModal();
          } else {
            this.toastr.error(
              response.message || 'فشل في إنشاء البطولة',
              'خطأ'
            );
          }
          this.isCreatingTournament = false;
        },
        error: (error) => {
          console.error('Error creating tournament:', error);
          this.toastr.error('خطأ في إنشاء البطولة', 'خطأ');
          this.isCreatingTournament = false;
        },
      });
  }

  // Modal Controls
  openCreateTournamentModal(): void {
    this.createTournamentForm = {
      name: '',
      systemOfScoring: 'Classic',
      teamCount: 4,
      playersPerTeam: 3,
    };
    this.showCreateTournamentModal = true;
  }

  closeCreateTournamentModal(): void {
    this.showCreateTournamentModal = false;
  }

  // Helper Methods
  getRemainingTeams(tournament: MultiTournamentDto): number {
    return tournament.teamCount - tournament.teams.length;
  }

  canStartTournament(tournament: MultiTournamentDto): boolean {
    return (
      tournament.status === 'Created' &&
      tournament.teams.length === tournament.teamCount
    );
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

  // Player Management
  loadAvailablePlayers(): void {
    this.isLoadingPlayers = true;

    this.multiTournamentService.getAllPlayers().subscribe({
      next: (response: ApiResponse<PlayerDetail[]>) => {
        if (response.success && response.data) {
          this.availablePlayers = response.data.filter((p) => p.isActive);
        }
        this.isLoadingPlayers = false;
      },
      error: (error) => {
        console.error('Error loading players:', error);
        this.toastr.error('خطأ في تحميل اللاعبين', 'خطأ');
        this.isLoadingPlayers = false;
      },
    });
  }

  // Match Management
  loadTournamentMatches(): void {
    if (!this.activeTournament) return;

    this.isLoadingMatches = true;

    this.multiTournamentService.getActiveTournamentMatches().subscribe({
      next: (response: ApiResponse<TeamMatchesDto[]>) => {
        if (response.success && response.data) {
          this.tournamentMatches = response.data;
        }
        this.isLoadingMatches = false;
      },
      error: (error) => {
        console.error('Error loading tournament matches:', error);
        this.toastr.error('خطأ في تحميل المباريات', 'خطأ');
        this.isLoadingMatches = false;
      },
    });
  }

  // Start Tournament
  startTournament(tournament: MultiTournamentDto): void {
    if (confirm(`هل أنت متأكد من بدء البطولة "${tournament.name}"؟`)) {
      this.multiTournamentService
        .startTournament(tournament.multiTournamentId)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.success) {
              this.toastr.success('تم بدء البطولة بنجاح', 'نجاح');
              this.loadTournaments();
            } else {
              this.toastr.error(
                response.message || 'فشل في بدء البطولة',
                'خطأ'
              );
            }
          },
          error: (error) => {
            console.error('Error starting tournament:', error);
            this.toastr.error('خطأ في بدء البطولة', 'خطأ');
          },
        });
    }
  }

  // Finish Tournament
  finishTournament(tournament: MultiTournamentDto): void {
    if (confirm(`هل أنت متأكد من إنهاء البطولة "${tournament.name}"؟`)) {
      this.multiTournamentService
        .finishTournament(tournament.multiTournamentId)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.success) {
              this.toastr.success('تم إنهاء البطولة بنجاح', 'نجاح');
              this.loadTournaments();
            } else {
              this.toastr.error(
                response.message || 'فشل في إنهاء البطولة',
                'خطأ'
              );
            }
          },
          error: (error) => {
            console.error('Error finishing tournament:', error);
            this.toastr.error('خطأ في إنهاء البطولة', 'خطأ');
          },
        });
    }
  }

  // Delete Tournament
  deleteTournament(tournament: MultiTournamentDto): void {
    if (
      confirm(
        `هل أنت متأكد من حذف البطولة "${tournament.name}"؟ سيتم حذف كل البيانات المرتبطة بها.`
      )
    ) {
      this.multiTournamentService
        .deleteTournament(tournament.multiTournamentId)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.success) {
              this.toastr.success('تم حذف البطولة بنجاح', 'نجاح');
              this.loadTournaments();
            } else {
              this.toastr.error(
                response.message || 'فشل في حذف البطولة',
                'خطأ'
              );
            }
          },
          error: (error) => {
            console.error('Error deleting tournament:', error);
            this.toastr.error('خطأ في حذف البطولة', 'خطأ');
          },
        });
    }
  }

  // Create Team
  createTeam(): void {
    if (!this.createTeamForm.teamName.trim()) {
      this.toastr.warning('يرجى إدخال اسم الفريق', 'تحذير');
      return;
    }

    if (
      this.createTeamForm.playerIds.length !==
      (this.activeTournament?.playersPerTeam || 3)
    ) {
      this.toastr.warning(
        `يجب اختيار ${this.activeTournament?.playersPerTeam} لاعبين بالضبط`,
        'تحذير'
      );
      return;
    }

    if (!this.activeTournament) return;

    this.isCreatingTeam = true;

    this.multiTournamentService
      .createTeam(this.activeTournament.multiTournamentId, this.createTeamForm)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('تم إنشاء الفريق بنجاح', 'نجاح');
            this.loadTournaments();
            this.closeCreateTeamModal();
          } else {
            this.toastr.error(response.message || 'فشل في إنشاء الفريق', 'خطأ');
          }
          this.isCreatingTeam = false;
        },
        error: (error) => {
          console.error('Error creating team:', error);
          this.toastr.error('خطأ في إنشاء الفريق', 'خطأ');
          this.isCreatingTeam = false;
        },
      });
  }

  // Add Player
  addNewPlayer(): void {
    if (!this.newPlayerName.trim()) {
      this.toastr.warning('يرجى إدخال اسم اللاعب', 'تحذير');
      return;
    }

    this.isAddingPlayer = true;

    this.multiTournamentService
      .addNewPlayer({ fullName: this.newPlayerName.trim() })
      .subscribe({
        next: (response: ApiResponse<PlayerDetail>) => {
          if (response.success) {
            this.toastr.success(
              `تم إضافة اللاعب ${this.newPlayerName} بنجاح`,
              'نجاح'
            );
            this.loadAvailablePlayers();
            this.showAddPlayerModal = false;
            this.newPlayerName = '';
          } else {
            this.toastr.error(response.message || 'فشل في إضافة اللاعب', 'خطأ');
          }
          this.isAddingPlayer = false;
        },
        error: (error) => {
          console.error('Error adding player:', error);
          this.toastr.error('خطأ في إضافة اللاعب', 'خطأ');
          this.isAddingPlayer = false;
        },
      });
  }

  // Team Management
  togglePlayerSelection(playerId: number): void {
    const index = this.createTeamForm.playerIds.indexOf(playerId);
    if (index === -1) {
      if (
        this.createTeamForm.playerIds.length <
        (this.activeTournament?.playersPerTeam || 3)
      ) {
        this.createTeamForm.playerIds.push(playerId);
      } else {
        this.toastr.warning(
          `يمكن اختيار ${this.activeTournament?.playersPerTeam} لاعبين فقط`,
          'تحذير'
        );
      }
    } else {
      this.createTeamForm.playerIds.splice(index, 1);
    }
  }

  isPlayerSelected(playerId: number): boolean {
    return this.createTeamForm.playerIds.includes(playerId);
  }

  // Match Recording
  recordMatchResult(): void {
    if (!this.selectedMatchId || !this.activeTournament) return;

    let requestBody: any = {};

    if (this.activeTournament.systemOfScoring === 'Classic') {
      // Classic system: determine winner automatically based on scores
      if (this.recordingScore1! > this.recordingScore2!) {
        requestBody.winnerId = this.selectedPlayer1Id;
      } else if (this.recordingScore2! > this.recordingScore1!) {
        requestBody.winnerId = this.selectedPlayer2Id;
      } else {
        requestBody.winnerId = null; // Draw
      }
    } else {
      // Points system: send scores directly
      requestBody.score1 = this.recordingScore1;
      requestBody.score2 = this.recordingScore2;
    }

    this.isRecordingResult = true;

    this.multiTournamentService
      .recordMatchResult(this.selectedMatchId, requestBody)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('تم تسجيل نتيجة المباراة بنجاح', 'نجاح');
            this.loadTournaments();
            this.loadTournamentMatches();
            this.closeRecordResultModal();
          } else {
            this.toastr.error(
              response.message || 'فشل في تسجيل النتيجة',
              'خطأ'
            );
          }
          this.isRecordingResult = false;
        },
        error: (error) => {
          console.error('Error recording match result:', error);
          this.toastr.error('خطأ في تسجيل نتيجة المباراة', 'خطأ');
          this.isRecordingResult = false;
        },
      });
  }

  undoMatchResult(match: MatchDetail): void {
    if (confirm('هل أنت متأكد من إلغاء نتيجة هذه المباراة؟')) {
      this.multiTournamentService
        .undoMatchResult(match.multiMatchId)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.success) {
              this.toastr.success('تم إلغاء نتيجة المباراة بنجاح', 'نجاح');
              this.loadTournaments();
              this.loadTournamentMatches();
            } else {
              this.toastr.error(
                response.message || 'فشل في إلغاء النتيجة',
                'خطأ'
              );
            }
          },
          error: (error) => {
            console.error('Error undoing match result:', error);
            this.toastr.error('خطأ في إلغاء نتيجة المباراة', 'خطأ');
          },
        });
    }
  }

  // Modal Controls
  openCreateTeamModal(tournament: MultiTournamentDto): void {
    this.activeTournament = tournament;
    this.createTeamForm = {
      teamName: '',
      playerIds: [],
    };
    this.showCreateTeamModal = true;
  }

  closeCreateTeamModal(): void {
    this.showCreateTeamModal = false;
    this.activeTournament = null;
  }

  closeRecordResultModal(): void {
    this.showRecordResultModal = false;
    this.selectedMatchId = null;
    this.selectedPlayer1Id = null;
    this.selectedPlayer2Id = null;
    this.recordingScore1 = null;
    this.recordingScore2 = null;
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

  canFinishTournament(tournament: MultiTournamentDto): boolean {
    return tournament.status === 'Started';
  }

  canDeleteTournament(tournament: MultiTournamentDto): boolean {
    return tournament.status === 'Created';
  }

  openRecordResultModal(match: MatchDetail): void {
    this.selectedMatchId = match.multiMatchId;
    this.selectedPlayer1Id = match.player1Id;
    this.selectedPlayer2Id = match.player2Id;
    this.recordingScore1 = null;
    this.recordingScore2 = null;
    this.showRecordResultModal = true;
    // Close player matches modal when opening record result modal
    this.showPlayerMatchesModal = false;
  }

  // Close Player Matches Modal
  closePlayerMatchesModal(): void {
    this.showPlayerMatchesModal = false;
    this.selectedPlayer = null;
  }

  // Player Selection
  selectPlayer(player: PlayerDetail): void {
    this.selectedPlayer = player;
    this.showPlayerMatchesModal = true;
    this.loadTournamentMatches();
  }

  // Get Player Matches
  getPlayerMatches(playerId: number): MatchDetail[] {
    if (!this.tournamentMatches || this.tournamentMatches.length === 0) {
      return [];
    }

    const playerMatches: MatchDetail[] = [];

    this.tournamentMatches.forEach((fixture) => {
      fixture.matches.forEach((match) => {
        if (match.player1Id === playerId || match.player2Id === playerId) {
          playerMatches.push(match);
        }
      });
    });

    return playerMatches;
  }

  // Get Player Name by ID
  getPlayerName(playerId: number | null): string {
    if (!playerId) return 'Unknown Player';

    const player = this.availablePlayers.find((p) => p.playerId === playerId);
    return player ? player.fullName : 'Unknown Player';
  }
}

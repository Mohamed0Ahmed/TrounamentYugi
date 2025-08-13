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
  TeamDetail,
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
  filteredPlayers: PlayerDetail[] = [];
  tournamentMatches: TeamMatchesDto[] = [];
  filteredPlayerMatches: MatchDetail[] = [];
  selectedPlayer: PlayerDetail | null = null;

  // Modals
  showCreateTournamentModal = false;
  showCreateTeamModal = false;
  showAddPlayerModal = false;
  showRecordResultModal = false;
  showPlayerMatchesModal = false;

  // Confirmation Modals
  showConfirmStartTournamentModal = false;
  showConfirmFinishTournamentModal = false;
  showConfirmDeleteTournamentModal = false;
  showConfirmUndoMatchModal = false;

  // Confirmation Data
  tournamentToConfirm: MultiTournamentDto | null = null;
  matchToUndo: MatchDetail | null = null;

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
  playerSearchTerm = '';
  opponentSearchTerm = '';

  // Match Recording
  selectedMatchId: number | null = null;
  selectedPlayer1Id: number | null = null;
  selectedPlayer2Id: number | null = null;
  recordingScore1: string = '';
  recordingScore2: string = '';

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
          this.filteredPlayers = [...this.availablePlayers];
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
          // Initialize filtered player matches if a player is selected
          if (this.selectedPlayer) {
            this.filteredPlayerMatches = this.getPlayerMatches(
              this.selectedPlayer.playerId || 0
            );
          }
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
    this.openConfirmStartTournamentModal(tournament);
  }

  // Confirm and Start Tournament
  confirmStartTournament(): void {
    if (!this.tournamentToConfirm) return;

    this.multiTournamentService
      .startTournament(this.tournamentToConfirm.multiTournamentId)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('تم بدء البطولة بنجاح', 'نجاح');
            this.loadTournaments();
            this.closeConfirmStartTournamentModal();
          } else {
            this.toastr.error(response.message || 'فشل في بدء البطولة', 'خطأ');
          }
        },
        error: (error) => {
          console.error('Error starting tournament:', error);
          this.toastr.error('خطأ في بدء البطولة', 'خطأ');
        },
      });
  }

  // Finish Tournament
  finishTournament(tournament: MultiTournamentDto): void {
    this.openConfirmFinishTournamentModal(tournament);
  }

  // Confirm and Finish Tournament
  confirmFinishTournament(): void {
    if (!this.tournamentToConfirm) return;

    this.multiTournamentService
      .finishTournament(this.tournamentToConfirm.multiTournamentId)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('تم إنهاء البطولة بنجاح', 'نجاح');
            this.loadTournaments();
            this.closeConfirmFinishTournamentModal();
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

  // Delete Tournament
  deleteTournament(tournament: MultiTournamentDto): void {
    this.openConfirmDeleteTournamentModal(tournament);
  }

  // Confirm and Delete Tournament
  confirmDeleteTournament(): void {
    if (!this.tournamentToConfirm) return;

    this.multiTournamentService
      .deleteTournament(this.tournamentToConfirm.multiTournamentId)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('تم حذف البطولة بنجاح', 'نجاح');
            this.loadTournaments();
            this.closeConfirmDeleteTournamentModal();
          } else {
            this.toastr.error(response.message || 'فشل في حذف البطولة', 'خطأ');
          }
        },
        error: (error) => {
          console.error('Error deleting tournament:', error);
          this.toastr.error('خطأ في حذف البطولة', 'خطأ');
        },
      });
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
            this.toastr.success(
              `تم إنشاء الفريق "${this.createTeamForm.teamName}" بنجاح`,
              'نجاح'
            );
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

    // Validate scores
    if (!this.recordingScore1.trim() || !this.recordingScore2.trim()) {
      this.toastr.warning('يرجى إدخال النتيجة للاعبين', 'تحذير');
      return;
    }

    // Parse scores to numbers
    const score1 = parseFloat(this.recordingScore1);
    const score2 = parseFloat(this.recordingScore2);

    // Check if scores are valid numbers
    if (isNaN(score1) || isNaN(score2)) {
      this.toastr.warning('يرجى إدخال أرقام صحيحة', 'تحذير');
      return;
    }



    let requestBody: any = {};

    if (this.activeTournament.systemOfScoring === 'Classic') {
      // Classic system: determine winner automatically based on scores
      if (score1 > score2) {
        requestBody.winnerId = this.selectedPlayer1Id;
      } else if (score2 > score1) {
        requestBody.winnerId = this.selectedPlayer2Id;
      } else {
        requestBody.winnerId = null; // Draw
      }
    } else {
      // Points system: send scores directly
      requestBody.score1 = score1;
      requestBody.score2 = score2;
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
    this.openConfirmUndoMatchModal(match);
  }

  // Confirm and Undo Match Result
  confirmUndoMatchResult(): void {
    if (!this.matchToUndo) return;

    this.multiTournamentService
      .undoMatchResult(this.matchToUndo.multiMatchId)
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('تم إلغاء نتيجة المباراة بنجاح', 'نجاح');
            this.loadTournaments();
            this.loadTournamentMatches();
            this.closeConfirmUndoMatchModal();
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
    this.recordingScore1 = '';
    this.recordingScore2 = '';
  }

  // Confirmation Modal Controls
  openConfirmStartTournamentModal(tournament: MultiTournamentDto): void {
    this.tournamentToConfirm = tournament;
    this.showConfirmStartTournamentModal = true;
  }

  closeConfirmStartTournamentModal(): void {
    this.showConfirmStartTournamentModal = false;
    this.tournamentToConfirm = null;
  }

  openConfirmFinishTournamentModal(tournament: MultiTournamentDto): void {
    this.tournamentToConfirm = tournament;
    this.showConfirmFinishTournamentModal = true;
  }

  closeConfirmFinishTournamentModal(): void {
    this.showConfirmFinishTournamentModal = false;
    this.tournamentToConfirm = null;
  }

  openConfirmDeleteTournamentModal(tournament: MultiTournamentDto): void {
    this.tournamentToConfirm = tournament;
    this.showConfirmDeleteTournamentModal = true;
  }

  closeConfirmDeleteTournamentModal(): void {
    this.showConfirmDeleteTournamentModal = false;
    this.tournamentToConfirm = null;
  }

  openConfirmUndoMatchModal(match: MatchDetail): void {
    this.matchToUndo = match;
    this.showConfirmUndoMatchModal = true;
  }

  closeConfirmUndoMatchModal(): void {
    this.showConfirmUndoMatchModal = false;
    this.matchToUndo = null;
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
    this.recordingScore1 = '';
    this.recordingScore2 = '';
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
    this.opponentSearchTerm = '';
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

  // Get Team Players Names
  getTeamPlayersNames(team: TeamDetail): string[] {
    if (!team.players || team.players.length === 0) {
      return ['No players'];
    }
    return team.players.map((p) => p.fullName);
  }

  // Filter Players by Search Term
  filterPlayers(): void {
    if (!this.playerSearchTerm || this.playerSearchTerm.trim() === '') {
      this.filteredPlayers = [...this.availablePlayers];
    } else {
      const searchTerm = this.playerSearchTerm.trim();
      this.filteredPlayers = this.availablePlayers.filter((player) =>
        player.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  // Filter Player Matches by Opponent Name
  filterPlayerMatches(): void {
    if (!this.selectedPlayer) return;

    const allMatches = this.getPlayerMatches(this.selectedPlayer.playerId || 0);

    if (!this.opponentSearchTerm || this.opponentSearchTerm.trim() === '') {
      this.filteredPlayerMatches = allMatches;
    } else {
      const searchTerm = this.opponentSearchTerm.trim();
      this.filteredPlayerMatches = allMatches.filter((match) => {
        const player1Name = match.player1Name?.toLowerCase() || '';
        const player2Name = match.player2Name?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();

        // Search in both player names (excluding the selected player)
        if (match.player1Id === this.selectedPlayer?.playerId) {
          return player2Name.includes(searchLower);
        } else if (match.player2Id === this.selectedPlayer?.playerId) {
          return player1Name.includes(searchLower);
        }
        return false;
      });
    }
  }
}

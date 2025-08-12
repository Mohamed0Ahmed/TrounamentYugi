import { MatchService } from 'src/app/core/services/match.service';
import { PlayerService } from './../../core/services/player.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Player,
  Match,
  StartLeagueDto,
  League,
  AllLeagueRank,
  Note,
  TournamentStage,
  LeagueType,
} from 'src/app/models/interfaces';
import { ToastrService } from 'ngx-toastr';
import { LeagueService } from 'src/app/core/services/league.service';
import { NoteService } from 'src/app/core/services/note.service';
import {
  AdminDashboardService,
  AdminDashboardData,
} from 'src/app/core/services/admin-dashboard.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  playerMatches: Match[] = [];
  displayMatches: Match[] = [];
  notes: Note[] = [];
  showModal = false;
  newPlayerName = '';
  isSidebarOpen = false;
  showDeleteModal = false;
  showNoteModal = false;
  showDeleteLeagueModal = false;
  showEndLeagueModal = false;
  loadingMatches: { [matchId: number]: boolean } = {};
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  showResetModal: boolean = false;
  leagueData: League | null = null;
  showStartLeagueModal: boolean = false;
  newLeague: StartLeagueDto = {
    name: '',
    description: '',
    typeOfLeague: 0,
    systemOfLeague: 0,
    roundsPerMatch: 3, // Default value for Points system
  };
  totalMessagesLeft: number = 0;
  totalPlayers: number = 0;
  totalMatches: number = 0;
  totalMatchesLeft: number = 0;
  totalMessages: number = 0;
  leagues: AllLeagueRank[] = [];
  newNote: string = '';
  selectedLeagueToDelete: AllLeagueRank | null = null;

  // New properties for tournament stage management
  currentMatches: Match[] = [];
  showTournamentStageButton = false;
  tournamentStageButtonText = '';
  tournamentStageButtonAction: (() => void) | null = null;

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private toastr: ToastrService,
    private leagueService: LeagueService,
    private noteService: NoteService,
    private adminDashboardService: AdminDashboardService
  ) {}

  ngOnInit(): void {
    // تحميل البيانات الأساسية مع Smart Caching
    this.loadEssentialData();
  }

  ngOnDestroy(): void {}

  private loadCurrentLeagueFromServer(): void {
    this.leagueService.getAdminCurrentLeague().subscribe({
      next: (data) => {
        this.leagueData = data.league;
        this.updateTournamentStageButton(); // Update button state when league data changes
      },
      error: (err) => {
        this.leagueData = null;
        this.updateTournamentStageButton(); // Update button state when league data changes
      },
    });
  }

  private loadEssentialData(): void {
    this.adminDashboardService.getEssentialData().subscribe({
      next: (data: AdminDashboardData) => {
        // ✅ عرض جميع البيانات فوراً من الكاش
        this.players = data.players;
        this.currentMatches = data.matches;
        this.leagueData = data.currentLeague;
        this.leagues = data.allLeagues;
        this.notes = data.notes;

        // ✅ عرض إحصائيات كاملة بما فيها عدد الرسائل
        this.totalPlayers = data.stats.totalPlayers;
        this.totalMatches = data.stats.totalMatches;
        this.totalMatchesLeft = data.stats.totalMatchesLeft;
        this.totalMessagesLeft = data.stats.totalMessagesLeft;

        // Update tournament stage button
        this.updateTournamentStageButton();
      },
      error: (err) => {
        this.toastr.error('حدث خطأ أثناء تحميل البيانات');
      },
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.selectedPlayer = null;
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
    this.loadMatches();
  }

  loadMatches(): void {
    if (!this.selectedPlayer) return;
    this.matchService.getAdminMatches().subscribe((matches) => {
      this.playerMatches = matches
        .filter(
          (m) =>
            m.player1Id === this.selectedPlayer!.playerId ||
            m.player2Id === this.selectedPlayer!.playerId
        )
        .sort((a, b) => {
          const nameA =
            (a.player1Id === this.selectedPlayer!.playerId
              ? a.player2Name
              : a.player1Name
            )?.toLowerCase() ?? '';
          const nameB =
            (b.player1Id === this.selectedPlayer!.playerId
              ? b.player2Name
              : b.player1Name
            )?.toLowerCase() ?? '';
          return nameA.localeCompare(nameB);
        });
      this.displayMatches = this.playerMatches.map((match) => {
        if (match.player2Id === this.selectedPlayer!.playerId) {
          return {
            ...match,
            player1Name: match.player2Name,
            player2Name: match.player1Name,
            score1: match.score2,
            score2: match.score1,
            player1Id: match.player2Id,
            player2Id: match.player1Id,
          };
        }
        return { ...match };
      });
      this.playerMatches.forEach((match) => {
        this.loadingMatches[match.matchId] = false;
      });
    });
  }

  private addToQueue(request: () => Promise<void>): void {
    this.requestQueue.push(request);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;
    const request = this.requestQueue.shift();

    if (request) {
      try {
        await request();
      } catch (error) {}
    }

    this.isProcessingQueue = false;
    this.processQueue();
  }

  updateMatch(matchId: number, winnerId: number | null) {
    this.loadingMatches[matchId] = true;

    this.addToQueue(
      () =>
        new Promise<void>((resolve, reject) => {
          this.matchService.updateMatch(matchId, winnerId).subscribe({
            next: (response) => {
              if (response.success) {
                this.toastr.success(response.message);
                // Invalidate cache and reload essential data
                this.adminDashboardService.invalidateCache('essential');
                this.loadEssentialData();
                this.loadMatches();
              } else {
                this.toastr.error(response.message);
              }
              this.loadingMatches[matchId] = false;
              resolve();
            },
            error: (error) => {
              this.toastr.error(error.error.message);
              this.loadingMatches[matchId] = false;
              reject(error);
            },
          });
        })
    );
  }

  resetMatch(matchId: number) {
    this.loadingMatches[matchId] = true;

    this.addToQueue(
      () =>
        new Promise<void>((resolve, reject) => {
          this.matchService.resetMatch(matchId).subscribe({
            next: (response) => {
              if (response.success) {
                this.toastr.success(response.message);
                this.loadMatches();
              } else {
                this.toastr.error(response.message, 'Error');
              }
              this.loadingMatches[matchId] = false;
              resolve();
            },
            error: (error) => {
              this.toastr.error(error.error.message);
              this.loadingMatches[matchId] = false;
              reject(error);
            },
          });
        })
    );
  }

  deletePlayer(playerId: number, event: Event): void {
    event.stopPropagation();
    this.playerService.deletePlayer(playerId).subscribe(() => {
      this.toastr.warning('Player deleted!', 'Deleted');
      this.loadMatches();
      // Invalidate cache and reload essential data
      this.adminDashboardService.invalidateCache('essential');
      this.loadEssentialData();
      this.updateTournamentStageButton(); // Update button state after deleting player
      if (this.selectedPlayer?.playerId === playerId) {
        this.selectedPlayer = null;
        this.playerMatches = [];
        this.displayMatches = [];
      }
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newPlayerName = '';
  }

  addPlayer(): void {
    if (!this.newPlayerName.trim()) return;
    this.playerService.addPlayer(this.newPlayerName).subscribe((response) => {
      if (response.success) {
        this.toastr.success(response.message);
        // Invalidate cache and reload essential data
        this.adminDashboardService.invalidateCache('essential');
        this.loadEssentialData();
        this.loadMatches();
        this.closeModal();
      } else this.toastr.warning(response.message);
    });
  }

  selectedPlayerToDelete: { playerId: number; fullName: string } | null = null;

  confirmDelete(player: { playerId: number; fullName: string }, event: Event) {
    event.stopPropagation();
    this.selectedPlayerToDelete = player;
    this.showDeleteModal = true;
  }

  deleteConfirmedPlayer() {
    if (this.selectedPlayerToDelete) {
      this.playerService
        .deletePlayer(this.selectedPlayerToDelete.playerId)
        .subscribe((response) => {
          if (response.success) {
            this.toastr.success(response.message);
            // Invalidate cache and reload essential data
            this.adminDashboardService.invalidateCache('essential');
            this.loadEssentialData();
            this.loadMatches();
          } else {
            this.toastr.error(response.message, 'Error');
          }
        });

      this.showDeleteModal = false;
      this.selectedPlayerToDelete = null;
    }
  }

  resetTournament(id: number): void {
    this.leagueService.resetLeague(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          this.showResetModal = false;
          this.loadMatches();
          // Invalidate cache and reload essential data
          this.adminDashboardService.invalidateCache('essential');
          this.loadEssentialData();
          this.showEndLeagueModal = false;
        } else {
          this.toastr.error(response.message);
        }
      },

      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  openStartLeagueModal(): void {
    this.showStartLeagueModal = true;
    this.newLeague = {
      name: '',
      description: '',
      typeOfLeague: 0,
      systemOfLeague: 0,
      roundsPerMatch: 3, // Default value for Points system
    };
  }

  closeStartLeagueModal(): void {
    this.showStartLeagueModal = false;
  }

  startLeague(): void {
    if (!this.newLeague.name.trim()) {
      this.toastr.error('League name is required', 'Error');
      return;
    }

    // Validate rounds per match for Points system
    if (
      this.newLeague.systemOfLeague === 0 &&
      (!this.newLeague.roundsPerMatch || this.newLeague.roundsPerMatch < 1)
    ) {
      this.toastr.error(
        'Rounds per match is required for Points system and must be at least 1',
        'Error'
      );
      return;
    }

    this.leagueService.startLeague(this.newLeague).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          this.closeStartLeagueModal();
          this.loadMatches();
          // Invalidate cache and reload essential data
          this.adminDashboardService.invalidateCache('essential');
          this.loadEssentialData();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
        // console.error(err);
      },
    });
  }

  DeleteLeague(id: number): void {
    this.leagueService.DeleteLeague(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          this.showDeleteLeagueModal = false;
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  openDeleteLeagueModal(leagueId: number): void {
    this.selectedLeagueToDelete =
      this.leagues.find((l) => l.leagueId === leagueId) || null;
    this.showDeleteLeagueModal = true;
  }

  closeDeleteLeagueModal(): void {
    this.showDeleteLeagueModal = false;
    this.selectedLeagueToDelete = null;
  }

  deleteConfirmedLeague(): void {
    if (this.selectedLeagueToDelete) {
      this.DeleteLeague(this.selectedLeagueToDelete.leagueId);
      this.leagues = this.leagues.filter(
        (l) => l.leagueId !== this.selectedLeagueToDelete?.leagueId
      );
      this.closeDeleteLeagueModal();
    }
  }

  sendNote(): void {
    if (!this.newNote.trim()) return;

    this.noteService.sendNote(this.newNote).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.newNote = '';
        // Invalidate cache and reload all data
        this.adminDashboardService.invalidateCache('essential');
        this.loadEssentialData();
      },
      error: () => this.toastr.error('حصل مشكلة وانت بتبعت الملاحظة'),
    });
  }

  toggleHideNote(note: any): void {
    this.noteService.toggleMarHide(note.id, !note.isHidden).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.loadEssentialData(); // ✅ محل getNotes()
      },
      error: () => this.toastr.error('حصل مشكلة وانت بتغير الظهور'),
    });
  }

  toggleDeleteNote(noteId: number): void {
    this.noteService.DeleteNote(noteId, false).subscribe({
      next: (res) => {
        this.toastr.warning(res.message);
        this.loadEssentialData(); // ✅ محل getNotes()
      },
      error: () => this.toastr.error('حصل مشكلة وانت بتحذف '),
    });
  }

  openNoteModal(): void {
    this.showNoteModal = true;
  }
  closeNoteModal(): void {
    this.showNoteModal = false;
  }

  // New method to load current matches for tournament stage logic
  private loadCurrentMatches(): void {
    this.matchService.getAdminMatches().subscribe({
      next: (matches) => {
        this.currentMatches = matches;
        this.updateTournamentStageButton();
      },
      error: (err) => {
        this.currentMatches = [];
        this.updateTournamentStageButton(); // Update button state even on error
      },
    });
  }

  // Method to determine tournament stage and update button
  private updateTournamentStageButton(): void {
    // Only show button for Groups type leagues
    if (
      !this.leagueData ||
      this.leagueData.typeOfLeague !== LeagueType.Groups
    ) {
      this.showTournamentStageButton = false;
      return;
    }

    // Check if there are players but no matches (need to start group stage)
    if (this.totalPlayers > 0 && this.currentMatches.length === 0) {
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'Start Group Stage';
      this.tournamentStageButtonAction = () => this.startGroupStage();
      return;
    }

    // Check current stage based on matches
    const groupMatches = this.currentMatches.filter(
      (m) =>
        m.stage === TournamentStage.GroupStage ||
        m.tournamentStage === 'GroupStage'
    );
    const quarterMatches = this.currentMatches.filter(
      (m) =>
        m.stage === TournamentStage.QuarterFinals ||
        m.tournamentStage === 'QuarterFinals'
    );
    const semiMatches = this.currentMatches.filter(
      (m) =>
        m.stage === TournamentStage.SemiFinals ||
        m.tournamentStage === 'SemiFinals'
    );
    const finalMatches = this.currentMatches.filter(
      (m) => m.stage === TournamentStage.Final || m.tournamentStage === 'Final'
    );

    // Check if all matches in a stage are completed
    const allGroupMatchesCompleted =
      groupMatches.length > 0 &&
      groupMatches.every((match) => match.isCompleted);
    const allQuarterMatchesCompleted =
      quarterMatches.length > 0 &&
      quarterMatches.every((match) => match.isCompleted);
    const allSemiMatchesCompleted =
      semiMatches.length > 0 && semiMatches.every((match) => match.isCompleted);

    // Show quarter button when group stage is completed and no quarter matches exist
    if (
      groupMatches.length > 0 &&
      allGroupMatchesCompleted &&
      quarterMatches.length === 0
    ) {
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'Start Quarter';
      this.tournamentStageButtonAction = () => this.startQuarterStage();
      return;
    }

    // Show semi button when quarter stage is completed and no semi matches exist
    if (
      quarterMatches.length > 0 &&
      allQuarterMatchesCompleted &&
      semiMatches.length === 0
    ) {
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'Start Semi Final';
      this.tournamentStageButtonAction = () => this.startSemiFinalStage();
      return;
    }

    // Show final button when semi stage is completed and no final matches exist
    if (
      semiMatches.length > 0 &&
      allSemiMatchesCompleted &&
      finalMatches.length === 0
    ) {
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'Start Final';
      this.tournamentStageButtonAction = () => this.startFinalStage();
      return;
    }

    if (finalMatches.length > 0) {
      // Final stage is active, hide button
      this.showTournamentStageButton = false;
      return;
    }

    // Default: hide button
    this.showTournamentStageButton = false;
  }

  // Tournament stage action methods
  startGroupStage(): void {
    if (!this.leagueData) return;

    this.leagueService.createGroupsAndMatches(this.leagueData.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          // Invalidate cache and reload essential data
          this.adminDashboardService.invalidateCache('essential');
          this.loadEssentialData();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  startQuarterStage(): void {
    if (!this.leagueData) return;

    this.leagueService.startKnockoutStage(this.leagueData.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          // Invalidate cache and reload essential data
          this.adminDashboardService.invalidateCache('essential');
          this.loadEssentialData();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
        // console.error(err);
      },
    });
  }

  startSemiFinalStage(): void {
    if (!this.leagueData) return;

    this.leagueService.startSemiFinals(this.leagueData.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          // Invalidate cache and reload essential data
          this.adminDashboardService.invalidateCache('essential');
          this.loadEssentialData();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  startFinalStage(): void {
    if (!this.leagueData) return;

    this.leagueService.startFinal(this.leagueData.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          // Invalidate cache and reload essential data
          this.adminDashboardService.invalidateCache('essential');
          this.loadEssentialData();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  // Method to handle tournament stage button click
  onTournamentStageButtonClick(): void {
    if (this.tournamentStageButtonAction) {
      this.tournamentStageButtonAction();
    }
  }
}

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
  SystemOfLeague,
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
  // Main data properties
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  playerMatches: Match[] = [];
  displayMatches: Match[] = [];
  notes: Note[] = [];

  // UI state properties
  showModal = false;
  newPlayerName = '';
  isSidebarOpen = false;
  showDeleteModal = false;
  showNoteModal = false;
  showDeleteLeagueModal = false;
  showEndLeagueModal = false;
  loadingMatches: { [matchId: number]: boolean } = {};

  // League management properties
  leagueData: League | null = null;
  showStartLeagueModal: boolean = false;
  newLeague: StartLeagueDto = {
    name: '',
    description: '',
    typeOfLeague: 0,
    systemOfLeague: 0,
    roundsPerMatch: 3, // Default value for Points system
  };

  // Statistics properties
  totalMessagesLeft: number = 0;
  totalPlayers: number = 0;
  totalMatches: number = 0;
  totalMatchesLeft: number = 0;
  totalMessages: number = 0;
  leagues: AllLeagueRank[] = [];
  newNote: string = '';
  selectedLeagueToDelete: AllLeagueRank | null = null;

  // Tournament stage management properties
  currentMatches: Match[] = [];
  showTournamentStageButton = false;
  tournamentStageButtonText = '';
  tournamentStageButtonAction: (() => void) | null = null;

  // Queue management properties
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  showResetModal: boolean = false;

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

  // Method to determine tournament stage and update button
  // This method checks the current tournament stage and shows appropriate buttons
  // For Groups type leagues, it shows buttons to progress through tournament stages
  private updateTournamentStageButton(): void {
    console.log('🔍 updateTournamentStageButton called');
    console.log('📊 leagueData:', this.leagueData);
    console.log('👥 totalPlayers:', this.totalPlayers);
    console.log('⚽ currentMatches:', this.currentMatches);

    // Only show button for Groups type leagues
    if (!this.leagueData) {
      console.log('❌ No league data available');
      this.showTournamentStageButton = false;
      return;
    }

    console.log('🏆 League type:', this.leagueData.typeOfLeague);
    console.log('🏆 LeagueType.Groups:', LeagueType.Groups);

    // Check if it's a Groups type league (can be string 'Groups' or number 2)
    const leagueType = this.leagueData.typeOfLeague as any;
    const isGroupsLeague =
      leagueType === LeagueType.Groups ||
      leagueType === 'Groups' ||
      leagueType === 2;

    if (!isGroupsLeague) {
      console.log('❌ Not a Groups type league');
      this.showTournamentStageButton = false;
      return;
    }

    console.log('✅ Confirmed: This is a Groups type league');

    // Check if there are players but no matches (need to start group stage)
    if (this.totalPlayers > 0 && this.currentMatches.length === 0) {
      console.log('✅ Showing start group stage button');
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'ابدأ دور المجموعات';
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

    console.log('📊 Group matches:', groupMatches.length);
    console.log('📊 Quarter matches:', quarterMatches.length);
    console.log('📊 Semi matches:', semiMatches.length);
    console.log('📊 Final matches:', finalMatches.length);

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
      console.log('✅ Showing start quarter button');
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'ابدأ دور ربع النهائي';
      this.tournamentStageButtonAction = () => this.startQuarterStage();
      return;
    }

    // Show semi button when quarter stage is completed and no semi matches exist
    if (
      quarterMatches.length > 0 &&
      allQuarterMatchesCompleted &&
      semiMatches.length === 0
    ) {
      console.log('✅ Showing start semi final button');
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'ابدأ دور نصف النهائي';
      this.tournamentStageButtonAction = () => this.startSemiFinalStage();
      return;
    }

    // Show final button when semi stage is completed and no final matches exist
    if (
      semiMatches.length > 0 &&
      allSemiMatchesCompleted &&
      finalMatches.length === 0
    ) {
      console.log('✅ Showing start final button');
      this.showTournamentStageButton = true;
      this.tournamentStageButtonText = 'ابدأ النهائي';
      this.tournamentStageButtonAction = () => this.startFinalStage();
      return;
    }

    if (finalMatches.length > 0) {
      // Final stage is active, hide button
      console.log('🏁 Final stage active, hiding button');
      this.showTournamentStageButton = false;
      return;
    }

    // Default: hide button
    console.log('❌ No button to show');
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

  // Helper method to get readable league type
  getLeagueTypeText(type: LeagueType): string {
    switch (type) {
      case LeagueType.Single:
        return 'بطولة فردية';
      case LeagueType.Multi:
        return 'بطولة متعددة';
      case LeagueType.Groups:
        return 'بطولة مجموعات';
      default:
        return 'غير محدد';
    }
  }

  // Helper method to get readable system type
  getSystemTypeText(system: SystemOfLeague): string {
    switch (system) {
      case SystemOfLeague.Points:
        return 'نظام النقاط';
      case SystemOfLeague.Classic:
        return 'النظام الكلاسيكي';
      default:
        return 'غير محدد';
    }
  }

  // Helper method to get readable league type for table (handles both string and number)
  getLeagueTypeTextForTable(leagueType: any): string {
    if (leagueType === 0 || leagueType === 'Single') {
      return 'بطولة فردية';
    } else if (leagueType === 1 || leagueType === 'Multi') {
      return 'بطولة متعددة';
    } else if (leagueType === 2 || leagueType === 'Groups') {
      return 'بطولة مجموعات';
    } else {
      return 'غير محدد';
    }
  }

  // Helper method to get readable system type for table (handles both string and number)
  getSystemTypeTextForTable(systemType: any): string {
    if (systemType === 0 || systemType === 'Points') {
      return 'نظام النقاط';
    } else if (systemType === 1 || systemType === 'Classic') {
      return 'النظام الكلاسيكي';
    } else {
      return 'غير محدد';
    }
  }
}

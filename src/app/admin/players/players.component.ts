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
import { MessageService } from 'src/app/core/services/message.service';
import { NoteService } from 'src/app/core/services/note.service';
import { AdminBackgroundService } from 'src/app/core/services/admin-background.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  private playerOrder: number[] = []; // حفظ ترتيب اللاعبين الحالي
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
  };
  totalMessagesLeft: number = 0;
  totalPlayers: number = 0;
  totalMatches: number = 0;
  totalMatchesLeft: number = 0;
  totalMessages: number = 0;
  leagues: AllLeagueRank[] = [];
  newNote: string = '';
  selectedLeagueToDelete: AllLeagueRank | null = null;
  private updateStatusSubscription?: Subscription;

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
    private messageService: MessageService,
    private noteService: NoteService,
    private adminBackgroundService: AdminBackgroundService
  ) {}

  ngOnInit(): void {
    // استدعاء التحميل من السيرفر فقط
    this.loadFromServer();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    if (this.updateStatusSubscription) {
      this.updateStatusSubscription.unsubscribe();
    }
  }

  private loadCurrentLeagueFromServer(): void {
    this.leagueService.getAdminCurrentLeague().subscribe({
      next: (data) => {
        this.leagueData = data.league;
        this.updateTournamentStageButton(); // Update button state when league data changes
      },
      error: (err) => {
        console.error('❌ Failed to load current league:', err);
        this.leagueData = null;
        this.updateTournamentStageButton(); // Update button state when league data changes
      },
    });
  }

  private loadFromServer(): void {
    this.getAdminPlayers();
    this.getAdminMatches();
    this.getAdminMessages();
    this.getAdminAllLeagues();
    this.getAdminNotes();
    this.loadCurrentLeagueFromServer();
    this.loadCurrentMatches(); // Add this line
  }

  private subscribeToUpdates(): void {
    this.updateStatusSubscription =
      this.adminBackgroundService.updateStatus$.subscribe((status) => {
        // You can add UI updates here if needed
        // console.log('🔄 Admin update status:', status);
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
      // console.log(matches);

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
      } catch (error) {
        console.error('Error processing request:', error);
      }
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
                // Invalidate admin cache and reload data
                this.loadMatches();
                this.getAdminMatches();
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
      this.getAdminPlayers();
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
        this.loadMatches();
        this.getAdminPlayers();
        this.updateTournamentStageButton(); // Update button state after adding player
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
            this.players = this.players.filter(
              (p) => p.playerId !== this.selectedPlayerToDelete?.playerId
            );
            this.toastr.success(response.message);
            this.getPlayers();
            this.updateTournamentStageButton(); // Update button state after deleting player
          } else {
            this.toastr.error(response.message, 'Error');
          }
        });

      this.showDeleteModal = false;
      this.selectedPlayerToDelete = null;
    }
  }

  getPlayers(): void {
    // حفظ الترتيب الحالي قبل الجلب
    this.playerOrder = this.players.map((p) => p.playerId);

    this.playerService.getPlayers().subscribe({
      next: (players) => {
        const typedPlayers = players as Player[];
        // إعادة ترتيب اللاعبين حسب الترتيب السابق إذا كان موجود
        if (this.playerOrder.length) {
          typedPlayers.sort((a, b) => {
            const aIndex = this.playerOrder.indexOf(a.playerId);
            const bIndex = this.playerOrder.indexOf(b.playerId);
            // إذا اللاعب جديد (غير موجود في الترتيب السابق)، ضعه في نهاية القائمة
            return (
              (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
              (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
            );
          });
        }
        this.players = typedPlayers;
        this.totalPlayers = typedPlayers.length;
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }
  getMatches(): void {
    this.matchService.getAdminMatches().subscribe({
      next: (response) => {
        if (response) {
          this.totalMatches = response.length;
          this.totalMatchesLeft = response.filter(
            (match) => match.isCompleted == false
          ).length;
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  resetTournament(id: number): void {
    this.leagueService.resetLeague(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          this.showResetModal = false;
          this.loadMatches();
          this.getAdminPlayers();
          this.showEndLeagueModal = false;
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

  openStartLeagueModal(): void {
    this.showStartLeagueModal = true;
    this.newLeague = {
      name: '',
      description: '',
      typeOfLeague: 0,
      systemOfLeague: 0,
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

    this.leagueService.startLeague(this.newLeague).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          this.closeStartLeagueModal();
          this.loadMatches();
          this.getAdminPlayers();
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

  getMessages(): void {
    this.messageService.getMessages().subscribe({
      next: (response) => {
        if (response) {
          this.totalMessagesLeft = response.messages.filter(
            (m) => m.isRead == false
          ).length;
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  GetAllLeagyes(): void {
    this.leagueService.GetAllLeaguesRank().subscribe({
      next: (response) => {
        if (response) {
          this.leagues = response.reverse();
          // console.log(response);
        } else {
          this.toastr.error(response);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
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
        this.getNotes();
      },
      error: () => this.toastr.error('حصل مشكلة وانت بتبعت الملاحظة'),
    });
  }

  toggleHideNote(note: any): void {
    this.noteService.toggleMarHide(note.id, !note.isHidden).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.getNotes();
      },
      error: () => this.toastr.error('حصل مشكلة وانت بتغير الظهور'),
    });
  }

  toggleDeleteNote(noteId: number): void {
    this.noteService.DeleteNote(noteId, false).subscribe({
      next: (res) => {
        this.toastr.warning(res.message);
        this.getNotes();
      },
      error: () => this.toastr.error('حصل مشكلة وانت بتحذف '),
    });
  }

  getNotes(): void {
    this.noteService.getNotes().subscribe((response) => {
      this.notes = response.notes;
      // console.log(response);
    });
  }

  // Admin-specific methods
  getAdminPlayers(): void {
    this.playerService.getAdminPlayers().subscribe({
      next: (players) => {
        const typedPlayers = players as Player[];
        if (this.playerOrder.length) {
          typedPlayers.sort((a, b) => {
            const aIndex = this.playerOrder.indexOf(a.playerId);
            const bIndex = this.playerOrder.indexOf(b.playerId);
            return (
              (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
              (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
            );
          });
        }
        this.players = typedPlayers;
        this.totalPlayers = typedPlayers.length;
        this.updateTournamentStageButton(); // Update button state when players count changes
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  getAdminMatches(): void {
    this.matchService.getAdminMatches().subscribe({
      next: (response) => {
        if (response) {
          this.totalMatches = response.length;
          this.totalMatchesLeft = response.filter(
            (match) => match.isCompleted == false
          ).length;
          this.currentMatches = response; // Update current matches
          this.updateTournamentStageButton(); // Update button state
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  getAdminMessages(): void {
    this.messageService.getAdminMessages().subscribe({
      next: (response) => {
        if (response) {
          this.totalMessagesLeft = response.messages.filter(
            (m) => m.isRead == false
          ).length;
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  getAdminAllLeagues(): void {
    this.leagueService.getAdminAllLeagues().subscribe({
      next: (response) => {
        this.leagues = response;
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  getAdminNotes(): void {
    this.noteService.getAdminNotes().subscribe((response) => {
      this.notes = response.notes;
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
        console.error('Error loading current matches:', err);
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

    console.log('Current matches:', this.currentMatches);
    // console.log('Total players:', this.totalPlayers);
    // console.log('League data:', this.leagueData);

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

    // console.log('Filtered matches:');
    // console.log('Group matches:', groupMatches);
    // console.log('Quarter matches:', quarterMatches);
    // console.log('Semi matches:', semiMatches);
    // console.log('Final matches:', finalMatches);

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
          this.loadCurrentMatches(); // Reload matches to update button state
          this.getAdminMatches(); // Update match count
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
          this.loadCurrentMatches();
          this.getAdminMatches();
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
          this.loadCurrentMatches();
          this.getAdminMatches();
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

  startFinalStage(): void {
    if (!this.leagueData) return;

    this.leagueService.startFinal(this.leagueData.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message);
          this.loadCurrentMatches();
          this.getAdminMatches();
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

  // Method to handle tournament stage button click
  onTournamentStageButtonClick(): void {
    if (this.tournamentStageButtonAction) {
      this.tournamentStageButtonAction();
    }
  }
}

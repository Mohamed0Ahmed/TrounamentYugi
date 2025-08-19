import { Component, OnInit } from '@angular/core';
import { FriendlyMatchService } from '../../core/services/friendly-match.service';
import { FriendlyMessageService } from '../../core/services/friendly-message.service';

import { ToastrService } from 'ngx-toastr';
import { DateFilter } from 'friendly-match-types';
import { calculateUnreadCount } from 'friendly-message-types';

@Component({
  selector: 'app-friendlies',
  templateUrl: './friendlies.component.html',
  styleUrls: ['./friendlies.component.css'],
})
export class FriendliesComponent implements OnInit {
  // Tab management
  activeTab: 'friendlies' = 'friendlies';

  // Sidebar state
  isSidebarOpen = false;

  // Players data
  players: any[] = [];
  selectedPlayer: any = null;
  displayMatches: any[] = [];

  // Modals
  showModal = false;
  showDeleteModal = false;
  showRecordMatchModal = false;
  selectedPlayerToDelete: any = null;
  selectedPlayerForMatch: any = null;

  // Form data (for friendly matches)
  friendlyPlayerName = '';
  matchForm = {
    player1Id: 0,
    player2Id: 0,
    player1Name: '',
    player2Name: '',
    player1Score: null as number | null,
    player2Score: null as number | null,
    playedOn: new Date(),
  };

  // Loading states
  isRecordingMatch = false;

  // Autocomplete states
  showPlayer1Suggestions = false;
  showPlayer2Suggestions = false;
  showPlayer1Select = false;
  showPlayer2Select = false;
  filteredPlayer1Suggestions: any[] = [];
  filteredPlayer2Suggestions: any[] = [];

  // Statistics
  totalPlayers = 0;
  totalMatches = 0;
  totalUnreadFriendlyMessages = 0;

  // All matches pagination
  allMatches: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  Math = Math; // Make Math available in template

  // Filter options
  filterForm = {
    playerId: 0,
    opponentIds: [] as number[],
    dateFilter: DateFilter.AllTime,
  };
  DateFilter = DateFilter; // Make enum available in template

  constructor(
    private friendlyMatchService: FriendlyMatchService,
    private friendlyMessageService: FriendlyMessageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.loadAllMatches();
    this.loadUnreadFriendlyMessagesCount();
  }

  loadUnreadFriendlyMessagesCount(): void {
    this.friendlyMessageService.getAllMessages().subscribe({
      next: (response: any) => {
        if (response.success && response.messages) {
          this.totalUnreadFriendlyMessages = calculateUnreadCount(
            response.messages
          );
        } else {
          this.totalUnreadFriendlyMessages = 0;
        }
      },
      error: (error: any) => {
        console.error('Error loading unread friendly messages count:', error);
        this.totalUnreadFriendlyMessages = 0;
      },
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadPlayers(): void {
    this.friendlyMatchService.getAllFriendlyPlayers().subscribe({
      next: (players: any) => {
        this.players = players;
        this.totalPlayers = players.length;
        this.calculateStatistics();
      },
      error: (error: any) => {
        this.toastr.error(
          error.error?.message ||
            error.message ||
            'حصل خطأ أثناء تحميل اللاعبين',
          'خطأ في التحميل'
        );
      },
    });
  }

  selectPlayer(player: any): void {
    this.selectedPlayer = player;
    this.loadPlayerMatches(player.playerId);
  }

  loadPlayerMatches(playerId: number): void {
    this.friendlyMatchService.getAllFriendlyMatches().subscribe({
      next: (matches: any) => {
        // Get the player's name
        const player = this.players.find((p) => p.playerId === playerId);
        const playerName = player?.fullName;

        this.displayMatches = matches.filter(
          (match: any) =>
            match.player1Name === playerName || match.player2Name === playerName
        );
      },
      error: (error: any) => {
        this.toastr.error(
          error.error?.message ||
            error.message ||
            'حصل خطأ أثناء تحميل مباريات اللاعب',
          'خطأ في التحميل'
        );
      },
    });
  }

  calculateStatistics(): void {
    this.friendlyMatchService.getAllFriendlyMatches().subscribe({
      next: (matches: any) => {
        this.totalMatches = matches.length;
      },
      error: (error: any) => {
        this.toastr.error(
          error.error?.message ||
            error.message ||
            'حصل خطأ أثناء تحميل الإحصائيات',
          'خطأ في التحميل'
        );
      },
    });
  }

  // Modal methods (for friendly players)
  openModal(): void {
    this.showModal = true;
    this.friendlyPlayerName = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.friendlyPlayerName = '';
  }

  addPlayer(): void {
    if (!this.friendlyPlayerName.trim()) {
      this.toastr.warning('الرجاء إدخال اسم اللاعب', 'تحذير');
      return;
    }

    this.friendlyMatchService
      .addFriendlyPlayerAsync(this.friendlyPlayerName)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(
              `تم إضافة اللاعب ${this.friendlyPlayerName} بنجاح`,
              'تم الإضافة'
            );
            // Refresh cache and reload players
            this.friendlyMatchService.refreshFriendlyPlayers();
            this.loadPlayers();
            this.closeModal();
          } else {
            this.toastr.error(
              response.message || 'فشل إضافة اللاعب',
              'خطأ في الإضافة'
            );
          }
        },
        error: (error: any) => {
          this.toastr.error(
            error.error?.message ||
              error.message ||
              'حصل خطأ أثناء إضافة اللاعب',
            'خطأ في الإضافة'
          );
        },
      });
  }

  confirmDelete(player: any, event: Event): void {
    event.stopPropagation();
    this.selectedPlayerToDelete = player;
    this.showDeleteModal = true;
  }

  deleteConfirmedPlayer(): void {
    if (!this.selectedPlayerToDelete) return;

    this.friendlyMatchService
      .deleteFriendlyPlayerAsync(this.selectedPlayerToDelete.playerId)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(
              `تم حذف اللاعب ${this.selectedPlayerToDelete.fullName} بنجاح`,
              'تم الحذف'
            );
            // Refresh cache and reload players
            this.friendlyMatchService.refreshFriendlyPlayers();
            this.loadPlayers();
            if (
              this.selectedPlayer?.playerId ===
              this.selectedPlayerToDelete.playerId
            ) {
              this.selectedPlayer = null;
              this.displayMatches = [];
            }
          } else {
            this.toastr.error(
              response.message || 'فشل حذف اللاعب',
              'خطأ في الحذف'
            );
          }
        },
        error: (error: any) => {
          this.toastr.error(
            error.error?.message || error.message || 'حصل خطأ أثناء حذف اللاعب',
            'خطأ في الحذف'
          );
        },
      });

    this.showDeleteModal = false;
    this.selectedPlayerToDelete = null;
  }

  getActivePlayersCount(): number {
    return this.players.filter((p) => p.isActive).length;
  }

  getRecentMatches(): any[] {
    return this.displayMatches.slice(0, 10);
  }

  // Record Match Modal methods
  openRecordMatchModal(player?: any): void {
    this.selectedPlayerForMatch = player || null;
    if (player) {
      this.matchForm.player1Id = player.playerId;
      this.matchForm.player1Name = player.fullName;
    } else {
      this.matchForm.player1Id = 0;
      this.matchForm.player1Name = '';
    }
    this.matchForm.player2Id = 0;
    this.matchForm.player2Name = '';
    this.matchForm.player1Score = null;
    this.matchForm.player2Score = null;
    this.matchForm.playedOn = new Date();
    this.showRecordMatchModal = true;
  }

  closeRecordMatchModal(): void {
    this.showRecordMatchModal = false;
    this.selectedPlayerForMatch = null;
    this.matchForm = {
      player1Id: 0,
      player2Id: 0,
      player1Name: '',
      player2Name: '',
      player1Score: 0,
      player2Score: 0,
      playedOn: new Date(),
    };
  }

  recordNewMatch(): void {
    if (!this.matchForm.player1Name || !this.matchForm.player2Name) {
      this.toastr.warning('الرجاء اختيار كلا اللاعبين', 'تحذير');
      return;
    }

    // Get player IDs from names
    const player1 = this.getPlayerByName(this.matchForm.player1Name);
    const player2 = this.getPlayerByName(this.matchForm.player2Name);

    if (!player1 || !player2) {
      this.toastr.warning('الرجاء التأكد من صحة أسماء اللاعبين', 'تحذير');
      return;
    }

    // Only check for same player in new match mode, not edit mode
    if (!this.selectedPlayerForMatch && player1.playerId === player2.playerId) {
      this.toastr.warning(
        'لا يمكن أن يكون اللاعب الأول والثاني نفس الشخص',
        'تحذير'
      );
      return;
    }

    if (
      this.matchForm.player1Score === null ||
      this.matchForm.player2Score === null
    ) {
      this.toastr.warning('الرجاء إدخال النقاط لكلا اللاعبين', 'تحذير');
      return;
    }

    if (this.matchForm.player1Score < 0 || this.matchForm.player2Score < 0) {
      this.toastr.warning('لا يمكن أن تكون النقاط سالبة', 'تحذير');
      return;
    }

    if (
      this.matchForm.player1Score === 0 &&
      this.matchForm.player2Score === 0
    ) {
      this.toastr.warning(
        'يجب أن يكون لدى لاعب واحد على الأقل نقاط إيجابية (0-0 غير مسموح)',
        'تحذير'
      );
      return;
    }

    const matchData = {
      player1Id: player1.playerId,
      player2Id: player2.playerId,
      player1Score: this.matchForm.player1Score,
      player2Score: this.matchForm.player2Score,
      playedOn: this.matchForm.playedOn,
    };

    this.isRecordingMatch = true;

    this.friendlyMatchService.recordFriendlyMatchAsync(matchData).subscribe({
      next: (response) => {
        if (response.success) {
          // Get player names for the toast message
          this.toastr.success(
            `تم تسجيل المباراة بنجاح: ${player1.fullName} (${this.matchForm.player1Score}) - ${player2.fullName} (${this.matchForm.player2Score})`,
            'تم تسجيل المباراة'
          );

          // Refresh cache and reload data
          this.friendlyMatchService.refreshFriendlyMatches();
          this.friendlyMatchService.refreshFriendlyPlayers();
          this.loadPlayers();
          this.calculateStatistics();
          if (this.selectedPlayer) {
            this.loadPlayerMatches(this.selectedPlayer.playerId);
          }
          this.loadAllMatches();
          this.closeRecordMatchModal();
        } else {
          this.toastr.error(
            response.message || 'فشل تسجيل المباراة',
            'خطأ في التسجيل'
          );
        }
        this.isRecordingMatch = false;
      },
      error: (error) => {
        this.toastr.error(
          error.error?.message ||
            error.message ||
            'حصل خطأ أثناء تسجيل المباراة',
          'خطأ في التسجيل'
        );
        this.isRecordingMatch = false;
      },
    });
  }

  getOpponentsForPlayer(playerId: number): any[] {
    // In edit mode, allow selecting any player except the current player1
    if (this.selectedPlayerForMatch) {
      return this.players.filter(
        (p) => p.playerId !== playerId && p.isActive !== false
      );
    }
    // In new match mode, filter out the selected player1
    return this.players.filter(
      (p) => p.playerId !== playerId && p.isActive !== false
    );
  }

  getOpponentsForPlayerByName(playerName: string): any[] {
    const player = this.getPlayerByName(playerName);
    if (!player) return this.getAllActivePlayers();

    // In edit mode, allow selecting any player except the current player1
    if (this.selectedPlayerForMatch) {
      return this.players.filter(
        (p) => p.playerId !== player.playerId && p.isActive !== false
      );
    }
    // In new match mode, filter out the selected player1
    return this.players.filter(
      (p) => p.playerId !== player.playerId && p.isActive !== false
    );
  }

  getAllActivePlayers(): any[] {
    // If isActive is undefined, consider all players as active
    return this.players.filter((p) => p.isActive !== false);
  }

  validateScore(player: 'player1' | 'player2'): void {
    if (player === 'player1') {
      if (
        this.matchForm.player1Score !== null &&
        this.matchForm.player1Score < 0
      ) {
        this.matchForm.player1Score = 0;
      }
    } else {
      if (
        this.matchForm.player2Score !== null &&
        this.matchForm.player2Score < 0
      ) {
        this.matchForm.player2Score = 0;
      }
    }
  }

  // All matches management
  loadAllMatches(): void {
    this.friendlyMatchService.getAllFriendlyMatches().subscribe({
      next: (matches: any) => {
        this.allMatches = matches.sort(
          (a: any, b: any) =>
            new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime()
        );
        this.totalMatches = matches.length;
        this.totalPages = Math.ceil(this.allMatches.length / this.itemsPerPage);
      },
      error: (error) => {
        this.toastr.error(
          error.error?.message ||
            error.message ||
            'حصل خطأ أثناء تحميل المباريات',
          'خطأ في التحميل'
        );
      },
    });
  }

  // Cache-based filtering
  loadFilteredMatchesFromCache(): void {
    this.friendlyMatchService.getAllFriendlyMatches().subscribe({
      next: (allMatches: any) => {
        let filteredMatches = [...allMatches];

        // Apply date filter
        if (this.filterForm.dateFilter !== DateFilter.AllTime) {
          const now = new Date();
          let cutoffDate: Date;

          switch (this.filterForm.dateFilter) {
            case DateFilter.Today:
              cutoffDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              );
              break;
            case DateFilter.Last3Days:
              cutoffDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
              break;
            case DateFilter.LastWeek:
              cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case DateFilter.LastMonth:
              cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            default:
              cutoffDate = new Date(0);
          }

          filteredMatches = filteredMatches.filter(
            (match) => new Date(match.playedOn) >= cutoffDate
          );
        }

        // Apply player filter
        if (this.filterForm.playerId) {
          // Get the selected player's name
          const selectedPlayer = this.players.find(
            (p) => p.playerId === this.filterForm.playerId
          );
          const selectedPlayerName = selectedPlayer?.fullName;

          filteredMatches = filteredMatches.filter((match) => {
            const isMatch =
              match.player1Name === selectedPlayerName ||
              match.player2Name === selectedPlayerName;

            return isMatch;
          });

          // Reorder matches so selected player is always Player 1
          filteredMatches = this.reorderMatchesForSelectedPlayer(
            filteredMatches,
            selectedPlayerName
          );
        }

        // Apply opponent filter
        if (
          this.filterForm.opponentIds &&
          this.filterForm.opponentIds.length > 0
        ) {
          // Get opponent names
          const opponentNames = this.filterForm.opponentIds
            .map((id) => {
              const player = this.players.find((p) => p.playerId === id);
              return player?.fullName;
            })
            .filter((name) => name);

          filteredMatches = filteredMatches.filter(
            (match) =>
              opponentNames.includes(match.player1Name) ||
              opponentNames.includes(match.player2Name)
          );
        }

        // Sort by date (newest first)
        filteredMatches.sort(
          (a, b) =>
            new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime()
        );

        this.allMatches = filteredMatches;
        this.totalMatches = filteredMatches.length;
        this.totalPages = Math.ceil(this.allMatches.length / this.itemsPerPage);
      },
      error: (error) => {
        this.toastr.error(
          error.error?.message ||
            error.message ||
            'حصل خطأ أثناء تحميل المباريات المفلترة',
          'خطأ في التحميل'
        );
      },
    });
  }

  // Helper method to reorder matches so selected player is always Player 1
  private reorderMatchesForSelectedPlayer(
    matches: any[],
    selectedPlayerName: string
  ): any[] {
    return matches.map((match) => {
      // If the selected player is already Player 1, keep as is
      if (match.player1Name === selectedPlayerName) {
        return match;
      }

      // If the selected player is Player 2, swap the players
      if (match.player2Name === selectedPlayerName) {
        return {
          ...match,
          player1Name: match.player2Name,
          player2Name: match.player1Name,
          player1Score: match.player2Score,
          player2Score: match.player1Score,
          player1Id: match.player2Id,
          player2Id: match.player1Id,
        };
      }

      // If neither player matches (shouldn't happen with our filter), keep as is
      return match;
    });
  }

  loadFilteredMatches(): void {
    const filter: any = {
      page: this.currentPage,
      pageSize: this.itemsPerPage,
      dateFilter: this.filterForm.dateFilter,
    };

    if (this.filterForm.playerId) {
      filter.playerId = this.filterForm.playerId;
    }
    if (this.filterForm.opponentIds && this.filterForm.opponentIds.length > 0) {
      filter.opponentIds = this.filterForm.opponentIds;
    }

    this.friendlyMatchService.getFilteredMatches(filter).subscribe({
      next: (result: any) => {
        this.allMatches = result.matches;
        this.totalMatches = result.totalCount;
        this.totalPages = result.totalPages;
      },
      error: (error: any) => {
        this.toastr.error(
          error.error?.message ||
            error.message ||
            'حصل خطأ أثناء تحميل المباريات المفلترة',
          'خطأ في التحميل'
        );
      },
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadFilteredMatchesFromCache();
  }

  clearFilters(): void {
    this.filterForm = {
      playerId: 0,
      opponentIds: [],
      dateFilter: DateFilter.AllTime,
    };
    this.currentPage = 1;
    this.loadAllMatches();
  }

  getPaginatedMatches(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.allMatches.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPlayerName(playerId: number): string {
    const player = this.players.find((p) => p.playerId === playerId);
    return player ? player.fullName : 'Unknown Player';
  }

  // Search and validation methods for player names
  searchPlayer1(event: any): void {
    const playerName = event.target.value;
    this.matchForm.player1Name = playerName;

    // Filter suggestions
    if (playerName.trim()) {
      this.filteredPlayer1Suggestions = this.getAllActivePlayers().filter(
        (player) =>
          player.fullName.toLowerCase().includes(playerName.toLowerCase())
      );
      this.showPlayer1Suggestions = true;
      this.showPlayer1Select = false; // Hide select box when typing
    } else {
      this.filteredPlayer1Suggestions = [];
      this.showPlayer1Suggestions = false;
      this.showPlayer1Select = true; // Show select box when empty
    }

    const player = this.getPlayerByName(playerName);
    if (player) {
      this.matchForm.player1Id = player.playerId;
      // Update player2 options when player1 changes
      this.matchForm.player2Name = '';
      this.matchForm.player2Id = 0;
      this.filteredPlayer2Suggestions = [];
      this.showPlayer2Suggestions = false;
    } else {
      this.matchForm.player1Id = 0;
    }
  }

  searchPlayer2(event: any): void {
    const playerName = event.target.value;
    this.matchForm.player2Name = playerName;

    // Filter suggestions based on player1
    if (playerName.trim()) {
      this.filteredPlayer2Suggestions = this.getOpponentsForPlayerByName(
        this.matchForm.player1Name
      ).filter((player) =>
        player.fullName.toLowerCase().includes(playerName.toLowerCase())
      );
      this.showPlayer2Suggestions = true;
      this.showPlayer2Select = false; // Hide select box when typing
    } else {
      this.filteredPlayer2Suggestions = [];
      this.showPlayer2Suggestions = false;
      this.showPlayer2Select = true; // Show select box when empty
    }

    const player = this.getPlayerByName(playerName);
    if (player) {
      this.matchForm.player2Id = player.playerId;
    } else {
      this.matchForm.player2Id = 0;
    }
  }

  selectPlayer1(player: any): void {
    this.matchForm.player1Name = player.fullName;
    this.matchForm.player1Id = player.playerId;
    this.showPlayer1Suggestions = false;
    this.showPlayer1Select = false;
    this.filteredPlayer1Suggestions = [];

    // Clear player2 when player1 changes
    this.matchForm.player2Name = '';
    this.matchForm.player2Id = 0;
    this.filteredPlayer2Suggestions = [];
  }

  selectPlayer2(player: any): void {
    this.matchForm.player2Name = player.fullName;
    this.matchForm.player2Id = player.playerId;
    this.showPlayer2Suggestions = false;
    this.showPlayer2Select = false;
    this.filteredPlayer2Suggestions = [];
  }

  selectPlayer1FromSelect(event: any): void {
    const playerId = parseInt(event.target.value);
    if (playerId) {
      const player = this.players.find((p) => p.playerId === playerId);
      if (player) {
        this.matchForm.player1Name = player.fullName;
        this.matchForm.player1Id = player.playerId;
        // Clear player2 when player1 changes
        this.matchForm.player2Name = '';
        this.matchForm.player2Id = 0;
        this.filteredPlayer2Suggestions = [];
      }
    } else {
      this.matchForm.player1Name = '';
      this.matchForm.player1Id = 0;
    }
    this.showPlayer1Select = false;
  }

  selectPlayer2FromSelect(event: any): void {
    const playerId = parseInt(event.target.value);
    if (playerId) {
      const player = this.players.find((p) => p.playerId === playerId);
      if (player) {
        this.matchForm.player2Name = player.fullName;
        this.matchForm.player2Id = player.playerId;
      }
    } else {
      this.matchForm.player2Name = '';
      this.matchForm.player2Id = 0;
    }
    this.showPlayer2Select = false;
  }

  hidePlayer1Suggestions(): void {
    setTimeout(() => {
      this.showPlayer1Suggestions = false;
      this.showPlayer1Select = false;
    }, 200);
  }

  hidePlayer2Suggestions(): void {
    setTimeout(() => {
      this.showPlayer2Suggestions = false;
      this.showPlayer2Select = false;
    }, 200);
  }

  getPlayerByName(playerName: string): any {
    return this.players.find((p) => p.fullName === playerName);
  }

  // Edit match functionality
  editMatch(match: any): void {
    // Find player IDs by names
    const player1 = this.players.find((p) => p.fullName === match.player1Name);
    const player2 = this.players.find((p) => p.fullName === match.player2Name);

    this.matchForm = {
      player1Id: player1?.playerId || 0,
      player2Id: player2?.playerId || 0,
      player1Name: match.player1Name,
      player2Name: match.player2Name,
      player1Score: match.player1Score,
      player2Score: match.player2Score,
      playedOn: new Date(match.playedOn),
    };
    this.selectedPlayerForMatch = match;
    this.showRecordMatchModal = true;
  }

  updateMatch(): void {
    if (!this.selectedPlayerForMatch) return;

    if (!this.matchForm.player1Name || !this.matchForm.player2Name) {
      this.toastr.warning('الرجاء التأكد من أسماء اللاعبين', 'تحذير');
      return;
    }

    // Get player IDs from names
    const player1 = this.getPlayerByName(this.matchForm.player1Name);
    const player2 = this.getPlayerByName(this.matchForm.player2Name);

    if (!player1 || !player2) {
      this.toastr.warning('الرجاء التأكد من صحة أسماء اللاعبين', 'تحذير');
      return;
    }

    // In edit mode, we don't need to check for same player since names are fixed

    if (
      this.matchForm.player1Score === null ||
      this.matchForm.player2Score === null
    ) {
      this.toastr.warning('الرجاء إدخال النقاط لكلا اللاعبين', 'تحذير');
      return;
    }

    if (this.matchForm.player1Score < 0 || this.matchForm.player2Score < 0) {
      this.toastr.warning('لا يمكن أن تكون النقاط سالبة', 'تحذير');
      return;
    }

    if (
      this.matchForm.player1Score === 0 &&
      this.matchForm.player2Score === 0
    ) {
      this.toastr.warning(
        'يجب أن يكون لدى لاعب واحد على الأقل نقاط إيجابية (0-0 غير مسموح)',
        'تحذير'
      );
      return;
    }

    this.isRecordingMatch = true;

    this.friendlyMatchService
      .updateFriendlyMatchAsync(this.selectedPlayerForMatch.matchId, {
        player1Id: player1.playerId,
        player2Id: player2.playerId,
        player1Score: this.matchForm.player1Score,
        player2Score: this.matchForm.player2Score,
      })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(
              `تم تحديث المباراة بنجاح: ${player1.fullName} (${this.matchForm.player1Score}) - ${player2.fullName} (${this.matchForm.player2Score})`,
              'تم تحديث المباراة'
            );

            // Refresh cache and reload data
            this.friendlyMatchService.refreshFriendlyMatches();
            this.loadAllMatches();
            this.calculateStatistics();
            if (this.selectedPlayer) {
              this.loadPlayerMatches(this.selectedPlayer.playerId);
            }
            this.closeRecordMatchModal();
          } else {
            this.toastr.error(
              response.message || 'فشل تحديث المباراة',
              'خطأ في التحديث'
            );
          }
          this.isRecordingMatch = false;
        },
        error: (error: any) => {
          this.toastr.error(
            error.error?.message ||
              error.message ||
              'حصل خطأ أثناء تحديث المباراة',
            'خطأ في التحديث'
          );
          this.isRecordingMatch = false;
        },
      });
  }

  deleteMatchFromList(matchId: number): void {
    if (confirm('هل أنت متأكد من حذف هذه المباراة؟')) {
      this.friendlyMatchService.deleteFriendlyMatchAsync(matchId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success('تم حذف المباراة بنجاح', 'تم الحذف');
            // Refresh cache and reload data
            this.friendlyMatchService.refreshFriendlyMatches();
            this.loadAllMatches();
            this.calculateStatistics();
            if (this.selectedPlayer) {
              this.loadPlayerMatches(this.selectedPlayer.playerId);
            }
          } else {
            this.toastr.error(
              response.message || 'فشل حذف المباراة',
              'خطأ في الحذف'
            );
          }
        },
        error: (error: any) => {
          this.toastr.error(
            error.error?.message ||
              error.message ||
              'حصل خطأ أثناء حذف المباراة',
            'خطأ في الحذف'
          );
        },
      });
    }
  }

  // Focus methods to show suggestions
  onPlayer1Focus(): void {
    // Only show suggestions if there's text and filtered results
    if (
      this.matchForm.player1Name.trim() &&
      this.filteredPlayer1Suggestions.length > 0
    ) {
      this.showPlayer1Suggestions = true;
      this.showPlayer1Select = false;
    } else {
      this.showPlayer1Select = true;
    }
  }

  onPlayer2Focus(): void {
    // Only show suggestions if there's text and filtered results
    if (
      this.matchForm.player2Name.trim() &&
      this.filteredPlayer2Suggestions.length > 0
    ) {
      this.showPlayer2Suggestions = true;
      this.showPlayer2Select = false;
    } else {
      this.showPlayer2Select = true;
    }
  }
}

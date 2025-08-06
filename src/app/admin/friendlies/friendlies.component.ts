import { Component, OnInit } from '@angular/core';
import {
  FriendlyMatchService,
  DateFilter,
} from '../../core/services/friendly-match.service';

@Component({
  selector: 'app-friendlies',
  templateUrl: './friendlies.component.html',
  styleUrls: ['./friendlies.component.css'],
})
export class FriendliesComponent implements OnInit {
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

  // Form data
  newPlayerName = '';
  matchForm = {
    player1Id: 0,
    player2Id: 0,
    player1Score: null as number | null,
    player2Score: null as number | null,
    playedOn: new Date(),
  };

  // Loading states
  isRecordingMatch = false;

  // Statistics
  totalPlayers = 0;
  totalMatches = 0;

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

  constructor(private friendlyMatchService: FriendlyMatchService) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.loadAllMatches();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadPlayers(): void {
    this.friendlyMatchService.getAllFriendlyPlayersAsync().subscribe({
      next: (players) => {
        this.players = players;
        this.totalPlayers = players.length;
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error loading players:', error);
      },
    });
  }

  selectPlayer(player: any): void {
    this.selectedPlayer = player;
    this.loadPlayerMatches(player.playerId);
  }

  loadPlayerMatches(playerId: number): void {
    this.friendlyMatchService.getAllFriendlyMatchesAsync().subscribe({
      next: (matches) => {
        // Get the player's name
        const player = this.players.find((p) => p.playerId === playerId);
        const playerName = player?.fullName;

        this.displayMatches = matches.filter(
          (match: any) =>
            match.player1Name === playerName || match.player2Name === playerName
        );
      },
      error: (error) => {
        console.error('Error loading matches:', error);
      },
    });
  }

  calculateStatistics(): void {
    this.friendlyMatchService.getAllFriendlyMatchesAsync().subscribe({
      next: (matches) => {
        this.totalMatches = matches.length;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      },
    });
  }

  // Modal methods
  openModal(): void {
    this.showModal = true;
    this.newPlayerName = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.newPlayerName = '';
  }

  addPlayer(): void {
    if (!this.newPlayerName.trim()) return;

    this.friendlyMatchService
      .addFriendlyPlayerAsync(this.newPlayerName)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Refresh cache and reload players
            this.friendlyMatchService.refreshFriendlyPlayers();
            this.loadPlayers();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error adding player:', error);
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
        next: (response) => {
          if (response.success) {
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
          }
        },
        error: (error) => {
          console.error('Error deleting player:', error);
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
    this.matchForm.player1Id = player?.playerId || 0;
    this.matchForm.player2Id = 0;
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
      player1Score: 0,
      player2Score: 0,
      playedOn: new Date(),
    };
  }

  recordNewMatch(): void {
    if (!this.matchForm.player1Id || !this.matchForm.player2Id) {
      alert('Please select both players');
      return;
    }

    // Only check for same player in new match mode, not edit mode
    if (
      !this.selectedPlayerForMatch &&
      this.matchForm.player1Id === this.matchForm.player2Id
    ) {
      alert('Player 1 and Player 2 cannot be the same');
      return;
    }

    if (
      this.matchForm.player1Score === null ||
      this.matchForm.player2Score === null
    ) {
      alert('Please enter scores for both players');
      return;
    }

    if (this.matchForm.player1Score < 0 || this.matchForm.player2Score < 0) {
      alert('Scores cannot be negative');
      return;
    }

    if (
      this.matchForm.player1Score === 0 &&
      this.matchForm.player2Score === 0
    ) {
      alert(
        'At least one player must have a positive score (0-0 is not allowed)'
      );
      return;
    }

    const matchData = {
      player1Id: this.matchForm.player1Id,
      player2Id: this.matchForm.player2Id,
      player1Score: this.matchForm.player1Score,
      player2Score: this.matchForm.player2Score,
      playedOn: this.matchForm.playedOn,
    };

    this.isRecordingMatch = true;

    this.friendlyMatchService.recordFriendlyMatchAsync(matchData).subscribe({
      next: (response) => {
        if (response.success) {
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
        }
        this.isRecordingMatch = false;
      },
      error: (error) => {
        console.error('Error recording match:', error);
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
    this.friendlyMatchService.getAllFriendlyMatchesAsync().subscribe({
      next: (matches) => {
        this.allMatches = matches.sort(
          (a: any, b: any) =>
            new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime()
        );
        this.totalMatches = matches.length;
        this.totalPages = Math.ceil(this.allMatches.length / this.itemsPerPage);
      },
      error: (error) => {
        console.error('Error loading all matches:', error);
      },
    });
  }

  // Cache-based filtering
  loadFilteredMatchesFromCache(): void {
    this.friendlyMatchService.getAllFriendlyMatchesAsync().subscribe({
      next: (allMatches) => {
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
        console.error('Error loading filtered matches from cache:', error);
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

    this.friendlyMatchService.getFilteredMatchesAsync(filter).subscribe({
      next: (result) => {
        this.allMatches = result.matches;
        this.totalMatches = result.totalCount;
        this.totalPages = result.totalPages;
      },
      error: (error) => {
        console.error('Error loading filtered matches:', error);
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

  // Edit match functionality
  editMatch(match: any): void {
    // Find player IDs by names
    const player1 = this.players.find((p) => p.fullName === match.player1Name);
    const player2 = this.players.find((p) => p.fullName === match.player2Name);

    this.matchForm = {
      player1Id: player1?.playerId || 0,
      player2Id: player2?.playerId || 0,
      player1Score: match.player1Score,
      player2Score: match.player2Score,
      playedOn: new Date(match.playedOn),
    };
    this.selectedPlayerForMatch = match;
    this.showRecordMatchModal = true;
  }

  updateMatch(): void {
    if (!this.selectedPlayerForMatch) return;

    if (!this.matchForm.player1Id || !this.matchForm.player2Id) {
      alert('Please select both players');
      return;
    }

    // In edit mode, we don't need to check for same player since names are fixed

    if (
      this.matchForm.player1Score === null ||
      this.matchForm.player2Score === null
    ) {
      alert('Please enter scores for both players');
      return;
    }

    if (this.matchForm.player1Score < 0 || this.matchForm.player2Score < 0) {
      alert('Scores cannot be negative');
      return;
    }

    if (
      this.matchForm.player1Score === 0 &&
      this.matchForm.player2Score === 0
    ) {
      alert(
        'At least one player must have a positive score (0-0 is not allowed)'
      );
      return;
    }

    this.isRecordingMatch = true;

    this.friendlyMatchService
      .updateFriendlyMatchAsync(this.selectedPlayerForMatch.matchId, {
        player1Id: this.matchForm.player1Id,
        player2Id: this.matchForm.player2Id,
        player1Score: this.matchForm.player1Score,
        player2Score: this.matchForm.player2Score,
        playedOn: this.matchForm.playedOn,
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Refresh cache and reload data
            this.friendlyMatchService.refreshFriendlyMatches();
            this.loadAllMatches();
            this.calculateStatistics();
            if (this.selectedPlayer) {
              this.loadPlayerMatches(this.selectedPlayer.playerId);
            }
            this.closeRecordMatchModal();
          }
          this.isRecordingMatch = false;
        },
        error: (error) => {
          console.error('Error updating match:', error);
          this.isRecordingMatch = false;
        },
      });
  }

  deleteMatchFromList(matchId: number): void {
    if (confirm('Are you sure you want to delete this match?')) {
      this.friendlyMatchService.deleteFriendlyMatchAsync(matchId).subscribe({
        next: (response) => {
          if (response.success) {
            // Refresh cache and reload data
            this.friendlyMatchService.refreshFriendlyMatches();
            this.loadAllMatches();
            this.calculateStatistics();
            if (this.selectedPlayer) {
              this.loadPlayerMatches(this.selectedPlayer.playerId);
            }
          }
        },
        error: (error) => {
          console.error('Error deleting match:', error);
        },
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FriendlyMatchService } from '../../core/services/friendly-match.service';
import {
  FriendlyPlayerDto,
  FriendlyMatchHistoryDto,
  ShutoutResultDto,
  DateFilter,
} from 'friendly-match-types';

// Enum for player sorting options
export enum PlayerSortOption {
  MostMatches = 'mostMatches',
  MostWins = 'mostWins',
  MostPoints = 'mostPoints',
  BestWinRate = 'bestWinRate',
  BestPointDifference = 'bestPointDifference',
}

@Component({
  selector: 'app-friendlies-view',
  templateUrl: './friendlies-view.component.html',
  styleUrls: ['./friendlies-view.component.css'],
})
export class FriendliesViewComponent implements OnInit {
  // Tab management
  activeTab: 'players' | 'matches' | 'shutouts' = 'matches';

  // Data
  players: FriendlyPlayerDto[] = [];
  matches: FriendlyMatchHistoryDto[] = [];
  shutouts: ShutoutResultDto[] = [];

  // Loading states
  isLoadingPlayers: boolean = false;
  isLoadingMatches: boolean = false;
  isLoadingShutouts: boolean = false;

  // Filtered data
  filteredMatches: FriendlyMatchHistoryDto[] = [];
  filteredShutouts: ShutoutResultDto[] = [];

  // Filter state tracking
  hasActiveFilters: boolean = false;
  noMatchesFound: boolean = false;
  noShutoutsFound: boolean = false;

  // Player search
  playerSearchTerm: string = '';

  // Player scores cache
  playerScores: Map<number, { scored: number; conceded: number }> = new Map();

  // Pagination
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;
  Math = Math; // Make Math available in template

  // Filter options
  filterForm = {
    player1Id: 0,
    player2Id: 0,
    dateFilter: DateFilter.AllTime,
  };
  DateFilter = DateFilter; // Make enum available in template

  // Player sorting
  currentPlayerSort: PlayerSortOption = PlayerSortOption.MostMatches;
  PlayerSortOption = PlayerSortOption; // Make enum available in template
  sortedPlayers: FriendlyPlayerDto[] = [];

  constructor(private friendlyMatchService: FriendlyMatchService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadPlayers();
    this.loadAllMatches();
    this.loadAllShutouts();
  }

  // Tab management
  setActiveTab(tab: 'players' | 'matches' | 'shutouts'): void {
    this.activeTab = tab;

    // Apply filters when switching to matches/shutouts tabs
    if (tab === 'matches' || tab === 'shutouts') {
      this.applyFilters();
    }
  }

  // Player management
  loadPlayers(): void {
    this.isLoadingPlayers = true;
    this.friendlyMatchService.getAllFriendlyPlayers().subscribe({
      next: (players) => {
        this.players = players;
        this.isLoadingPlayers = false;

        // Apply filters after all data is loaded
        this.applyFilters();
        this.sortPlayers(); // Sort players after loading
      },
      error: (error) => {
        this.isLoadingPlayers = false;
      },
    });
  }

  // Player sorting methods
  sortPlayers(): void {
    // Wait for matches to be loaded before sorting
    if (this.matches.length === 0) {
      this.sortedPlayers = [...this.players];
      return;
    }

    this.sortedPlayers = [...this.players];

    switch (this.currentPlayerSort) {
      case PlayerSortOption.MostMatches:
        this.sortByMostMatches();
        break;
      case PlayerSortOption.MostWins:
        this.sortByMostWins();
        break;
      case PlayerSortOption.MostPoints:
        this.sortByMostPoints();
        break;
      case PlayerSortOption.BestWinRate:
        this.sortByBestWinRate();
        break;
      case PlayerSortOption.BestPointDifference:
        this.sortByBestPointDifference();
        break;
      default:
        this.sortByMostMatches();
    }
  }

  sortByMostMatches(): void {
    this.sortedPlayers.sort(
      (a, b) => (b.totalMatches || 0) - (a.totalMatches || 0)
    );
  }

  sortByMostWins(): void {
    this.sortedPlayers.sort((a, b) => (b.totalWins || 0) - (a.totalWins || 0));
  }

  sortByMostPoints(): void {
    this.sortedPlayers.sort((a, b) => {
      const aTotalPoints = this.calculatePlayerTotalPoints(a);
      const bTotalPoints = this.calculatePlayerTotalPoints(b);
      return bTotalPoints - aTotalPoints;
    });
  }

  sortByBestWinRate(): void {
    this.sortedPlayers.sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
  }

  sortByBestPointDifference(): void {
    this.sortedPlayers.sort((a, b) => {
      const aPointDiff = this.calculatePlayerPointDifference(a);
      const bPointDiff = this.calculatePlayerPointDifference(b);
      return bPointDiff - aPointDiff;
    });
  }

  calculatePlayerTotalPoints(player: FriendlyPlayerDto): number {
    // Calculate total points from actual matches
    let totalPoints = 0;

    this.matches.forEach((match) => {
      if (match.player1Name === player.fullName) {
        totalPoints += match.player1Score || 0;
      } else if (match.player2Name === player.fullName) {
        totalPoints += match.player2Score || 0;
      }
    });

    return totalPoints;
  }

  calculatePlayerPointDifference(player: FriendlyPlayerDto): number {
    // Calculate point difference from actual matches
    let pointsScored = 0;
    let pointsConceded = 0;

    this.matches.forEach((match) => {
      if (match.player1Name === player.fullName) {
        pointsScored += match.player1Score || 0;
        pointsConceded += match.player2Score || 0;
      } else if (match.player2Name === player.fullName) {
        pointsScored += match.player2Score || 0;
        pointsConceded += match.player1Score || 0;
      }
    });

    return pointsScored - pointsConceded;
  }

  onPlayerSortChange(): void {
    this.sortPlayers();
  }

  getCurrentSortLabel(): string {
    switch (this.currentPlayerSort) {
      case PlayerSortOption.MostMatches:
        return 'الأكثر لعباً للمباريات';
      case PlayerSortOption.MostWins:
        return 'الأكثر فوزاً';
      case PlayerSortOption.MostPoints:
        return 'الأكثر تحقيقاً للنقاط';
      case PlayerSortOption.BestWinRate:
        return 'أفضل نسبة فوز';
      case PlayerSortOption.BestPointDifference:
        return 'أفضل فرق نقاط';
      default:
        return 'الأكثر لعباً للمباريات';
    }
  }

  // Player search methods
  onPlayerSearchChange(): void {
    // This method is called when the search term changes
    // The filtering is handled in getFilteredPlayers() method
  }

  clearPlayerSearch(): void {
    this.playerSearchTerm = '';
  }

  getFilteredPlayers(): FriendlyPlayerDto[] {
    if (!this.playerSearchTerm.trim()) {
      return this.sortedPlayers;
    }

    const searchTerm = this.playerSearchTerm.toLowerCase().trim();
    return this.sortedPlayers.filter((player) =>
      player.fullName.toLowerCase().includes(searchTerm)
    );
  }

  // Match management
  loadAllMatches(): void {
    this.isLoadingMatches = true;
    this.friendlyMatchService.getAllFriendlyMatches().subscribe({
      next: (matches) => {
        this.matches = matches;
        this.calculatePlayerScores(matches);
        this.isLoadingMatches = false;

        // Calculate total pages for pagination
        this.totalPages = Math.ceil(matches.length / this.itemsPerPage);

        // Re-sort players after loading matches to update points calculations
        if (this.players.length > 0) {
          this.sortPlayers();
        }
      },
      error: (error) => {
        this.isLoadingMatches = false;
      },
    });
  }

  loadAllShutouts(): void {
    this.isLoadingShutouts = true;
    this.friendlyMatchService.getAllShutoutResults().subscribe({
      next: (shutouts) => {
        this.shutouts = shutouts;
        this.isLoadingShutouts = false;
      },
      error: (error) => {
        this.isLoadingShutouts = false;
      },
    });
  }

  // Score calculation methods
  calculatePlayerScores(matches: FriendlyMatchHistoryDto[]): void {
    this.playerScores.clear();

    matches.forEach((match) => {
      // Find player IDs by names
      const player1 = this.players.find(
        (p) => p.fullName === match.player1Name
      );
      const player2 = this.players.find(
        (p) => p.fullName === match.player2Name
      );

      if (player1) {
        const currentScore = this.playerScores.get(player1.playerId) || {
          scored: 0,
          conceded: 0,
        };
        currentScore.scored += match.player1Score;
        currentScore.conceded += match.player2Score;
        this.playerScores.set(player1.playerId, currentScore);
      }

      if (player2) {
        const currentScore = this.playerScores.get(player2.playerId) || {
          scored: 0,
          conceded: 0,
        };
        currentScore.scored += match.player2Score;
        currentScore.conceded += match.player1Score;
        this.playerScores.set(player2.playerId, currentScore);
      }
    });
  }

  getPlayerScore(playerId: number): { scored: number; conceded: number } {
    return this.playerScores.get(playerId) || { scored: 0, conceded: 0 };
  }

  getPlayerScoreDifference(playerId: number): number {
    const score = this.getPlayerScore(playerId);
    return score.scored - score.conceded;
  }

  getPlayerScoreDisplay(playerId: number): string {
    const score = this.getPlayerScore(playerId);
    const diff = this.getPlayerScoreDifference(playerId);
    const diffSign = diff >= 0 ? '+' : '';
    return `${score.scored} wins, ${score.conceded} losses (${diffSign}${diff})`;
  }

  // Utility methods
  getDisplayMatches(): FriendlyMatchHistoryDto[] {
    if (this.hasActiveFilters && this.noMatchesFound) {
      return [];
    }
    return this.filteredMatches.length > 0
      ? this.filteredMatches
      : this.matches;
  }

  getDisplayShutouts(): ShutoutResultDto[] {
    if (this.hasActiveFilters && this.noShutoutsFound) {
      return [];
    }
    return this.filteredShutouts.length > 0
      ? this.filteredShutouts
      : this.shutouts;
  }

  isPlayerSelected(player: FriendlyPlayerDto): boolean {
    return false; // No player selection, so no player is "selected"
  }

  getSelectedPlayersText(): string {
    let text = 'All matches';

    if (this.filterForm.player1Id || this.filterForm.player2Id) {
      const filters = [];
      if (this.filterForm.player1Id) {
        const player1 = this.players.find(
          (p) => p.playerId === this.filterForm.player1Id
        );
        if (player1) filters.push(player1.fullName);
      }
      if (this.filterForm.player2Id) {
        const player2 = this.players.find(
          (p) => p.playerId === this.filterForm.player2Id
        );
        if (player2) filters.push(player2.fullName);
      }

      if (filters.length === 1) {
        text = `${filters[0]} matches (selected player shown on left)`;
      } else if (filters.length === 2) {
        text = `${filters[0]} vs ${filters[1]}`;
      }
    }

    if (this.filterForm.dateFilter !== DateFilter.AllTime) {
      const dateText = this.getDateFilterText(this.filterForm.dateFilter);
      text += ` (${dateText})`;
    }

    return text;
  }

  getDateFilterText(dateFilter: DateFilter): string {
    switch (dateFilter) {
      case DateFilter.Today:
        return 'Today';
      case DateFilter.Last3Days:
        return 'Last 3 Days';
      case DateFilter.LastWeek:
        return 'Last Week';
      case DateFilter.LastMonth:
        return 'Last Month';
      default:
        return '';
    }
  }

  // Filter and pagination methods
  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.filterForm = {
      player1Id: 0,
      player2Id: 0,
      dateFilter: DateFilter.AllTime,
    };
    this.currentPage = 1;
    this.hasActiveFilters = false;
    this.noMatchesFound = false;
    this.noShutoutsFound = false;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.matches];

    // Check if there are active filters
    this.hasActiveFilters =
      this.filterForm.dateFilter !== DateFilter.AllTime ||
      this.filterForm.player1Id !== 0 ||
      this.filterForm.player2Id !== 0;

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

      filtered = filtered.filter(
        (match) => new Date(match.playedOn) >= cutoffDate
      );
    }

    // Apply player filters
    if (this.filterForm.player1Id) {
      const player1 = this.players.find(
        (p) => p.playerId === this.filterForm.player1Id
      );
      if (player1) {
        filtered = filtered.filter(
          (match) =>
            match.player1Name === player1.fullName ||
            match.player2Name === player1.fullName
        );
      }
    }

    if (this.filterForm.player2Id) {
      const player2 = this.players.find(
        (p) => p.playerId === this.filterForm.player2Id
      );
      if (player2) {
        filtered = filtered.filter(
          (match) =>
            match.player1Name === player2.fullName ||
            match.player2Name === player2.fullName
        );
      }
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime()
    );

    this.filteredMatches = filtered;
    this.noMatchesFound = this.hasActiveFilters && filtered.length === 0;
    this.totalPages = Math.ceil(
      this.getDisplayMatches().length / this.itemsPerPage
    );

    // Also apply filters to shutouts
    let filteredShutouts = [...this.shutouts];

    // Apply date filter to shutouts
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

      filteredShutouts = filteredShutouts.filter(
        (shutout) => new Date(shutout.achievedOn) >= cutoffDate
      );
    }

    // Apply player filters to shutouts
    if (this.filterForm.player1Id) {
      const player1 = this.players.find(
        (p) => p.playerId === this.filterForm.player1Id
      );
      if (player1) {
        filteredShutouts = filteredShutouts.filter(
          (shutout) =>
            shutout.winnerName === player1.fullName ||
            shutout.loserName === player1.fullName
        );
      }
    }

    if (this.filterForm.player2Id) {
      const player2 = this.players.find(
        (p) => p.playerId === this.filterForm.player2Id
      );
      if (player2) {
        filteredShutouts = filteredShutouts.filter(
          (shutout) =>
            shutout.winnerName === player2.fullName ||
            shutout.loserName === player2.fullName
        );
      }
    }

    // Sort shutouts by date (newest first)
    filteredShutouts.sort(
      (a, b) =>
        new Date(b.achievedOn).getTime() - new Date(a.achievedOn).getTime()
    );

    this.filteredShutouts = filteredShutouts;
    this.noShutoutsFound =
      this.hasActiveFilters && filteredShutouts.length === 0;

    // Update total pages for pagination
    this.totalPages = Math.ceil(
      this.getDisplayMatches().length / this.itemsPerPage
    );
  }

  getPaginatedMatches(): FriendlyMatchHistoryDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const matches = this.getDisplayMatches().slice(startIndex, endIndex);

    // If a player is selected, reorder matches to show selected player on the left
    if (this.filterForm.player1Id) {
      return matches.map((match) => this.reorderMatchForSelectedPlayer(match));
    }

    return matches;
  }

  reorderMatchForSelectedPlayer(
    match: FriendlyMatchHistoryDto
  ): FriendlyMatchHistoryDto {
    const selectedPlayer = this.players.find(
      (p) => p.playerId === this.filterForm.player1Id
    );

    if (!selectedPlayer) return match;

    // If selected player is player2, swap the order
    if (match.player2Name === selectedPlayer.fullName) {
      return {
        ...match,
        player1Name: match.player2Name,
        player2Name: match.player1Name,
        player1Score: match.player2Score,
        player2Score: match.player1Score,
        // Keep winner as is since it's the actual winner name
      };
    }

    return match;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}

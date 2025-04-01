import { MatchService } from 'src/app/core/services/match.service';
import { PlayerService } from './../../core/services/player.service';
import { Component, OnInit } from '@angular/core';
import { Player, Match } from 'src/app/models/interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  playerMatches: Match[] = [];
  showModal = false;
  newPlayerName = '';
  isSidebarOpen = false;
  showDeleteModal = false;
  loadingMatches: { [matchId: number]: boolean } = {};

  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  private updateUITimer: any = null;
  private readonly DEBOUNCE_TIME = 500;

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.playerService.ranking$.subscribe((players) => {
      this.players = players;
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
    this.loadMatches();
  }

  loadMatches(): void {
    if (!this.selectedPlayer) return;
    this.matchService.getMatches().subscribe((matches) => {
      this.playerMatches = matches.filter(
        (m) =>
          m.player1Id === this.selectedPlayer!.playerId ||
          m.player2Id === this.selectedPlayer!.playerId
      );
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

  private debounceUpdateUI(): void {
    if (this.updateUITimer) {
      clearTimeout(this.updateUITimer);
    }

    this.updateUITimer = setTimeout(() => {
      this.loadMatches();
      this.playerService.refreshRanking();
    }, this.DEBOUNCE_TIME);
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
                this.debounceUpdateUI();
              } else {
                this.toastr.error(response.message);
              }
              this.loadingMatches[matchId] = false;
              resolve();
            },
            error: (error) => {
              this.toastr.error('Error updating match', 'Error');
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
                this.debounceUpdateUI();
              } else {
                this.toastr.error(response.message, 'Error');
              }
              this.loadingMatches[matchId] = false;
              resolve();
            },
            error: (error) => {
              this.toastr.error('Error resetting match', 'Error');
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
      if (this.selectedPlayer?.playerId === playerId) {
        this.selectedPlayer = null;
        this.playerMatches = [];
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
    this.playerService.addPlayer(this.newPlayerName).subscribe(() => {
      this.toastr.success('Player added successfully!', 'Success');
      this.closeModal();
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
          } else {
            this.toastr.error(response.message, 'Error');
          }
        });

      this.showDeleteModal = false;
      this.selectedPlayerToDelete = null;
    }
  }
}

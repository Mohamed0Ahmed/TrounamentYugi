import { Component, HostListener, OnInit } from '@angular/core';
import { LeagueService } from './../../core/services/league.service';
import {
  AllLeagueRank,
  AllLeagueMatches,
  Player,
  Match,
} from './../../models/interfaces';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-all-leagues',
  templateUrl: './all-leagues.component.html',
  styleUrls: ['./all-leagues.component.css'],
})
export class AllLeaguesComponent implements OnInit {
  leaguesRank: AllLeagueRank[] = [];
  leaguesMatches: AllLeagueMatches[] = [];
  players: Player[] = [];
  highlightedColumn: number | null = null;
  matches: Match[] = [];
  LeagueId: number = 0; // هيستخدم للتحكم في إظهار الجدول

  constructor(private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.leagueService.GetAllLeaguesRank().subscribe({
      next: (response) => {
        this.leaguesRank = response.reverse();
      },
      error: (error) => console.error('Error fetching leagues rank:', error),
    });
  }

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['Previous', 'Next'],
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
    nav: true,
  };

  getLeagueId(id: number): void {
    this.LeagueId = id;

    this.leagueService.GetAllLeaguesMatches().subscribe({
      next: (response) => {
        console.log('GetAllLeaguesMatches response:', response);
        if (Array.isArray(response)) {
          this.leaguesMatches = response;
          const league = response.find((l) => l.leagueId === id);
          this.matches = league ? league.matches : [];
        } else {
          console.error('Response is not an array:', response);
          this.matches = [];
        }
      },
      error: (error) => console.error('Error fetching leagues matches:', error),
    });

    this.leagueService.GetAllLeaguesRank().subscribe({
      next: (response) => {
        console.log('GetAllLeaguesRank response:', response);
        if (Array.isArray(response)) {
          const league = response.find((l) => l.leagueId === id);
          this.players = league ? league.players : [];
        } else {
          console.error('Response is not an array:', response);
          this.players = [];
        }
      },
      error: (error) => console.error('Error fetching leagues rank:', error),
    });
  }

  getMatchResult(player1: Player, player2: Player) {
    if (player1.playerId === player2.playerId) {
      return { result: 'N/A', color: 'text-gray-400' };
    }

    const match = this.matches.find(
      (m) =>
        (m.player1Name === player1.fullName &&
          m.player2Name === player2.fullName) ||
        (m.player1Name === player2.fullName &&
          m.player2Name === player1.fullName)
    );

    if (!match) {
      return { result: '-', color: 'text-gray-500' };
    }

    const player1Score =
      match.player1Name === player1.fullName ? match.score1 : match.score2;
    const player2Score =
      match.player2Name === player2.fullName ? match.score2 : match.score1;

    let colorClass = 'text-black';
    if (player1Score > player2Score) {
      colorClass = 'text-green-600 font-bold';
    } else if (player1Score < player2Score) {
      colorClass = 'text-red-600 font-bold';
    } else if (player1Score === player2Score && player1Score !== 0) {
      colorClass = 'text-yellow-400 font-bold';
    }

    return { result: `${player1Score} - ${player2Score}`, color: colorClass };
  }

  highlightColumn(playerId: number) {
    this.highlightedColumn =
      this.highlightedColumn === playerId ? null : playerId;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const table = document.querySelector('table');
    if (table && !table.contains(event.target as Node)) {
      this.highlightedColumn = null;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../../core/services/player.service';
import { MatchService } from 'src/app/core/services/match.service';
import { ToastrService } from 'ngx-toastr';
import { Match, Player } from 'src/app/models/interfaces';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-table.component.html',
  styleUrls: ['./league-table.component.css'],
})
export class LeagueTableComponent implements OnInit {
  players: Player[] = [];
  matches: Match[] = [];
  started: boolean = true;

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.loadMatches();
  }

  loadPlayers(): void {
    this.playerService.getrank().subscribe({
      next: (response) => {
        if (response) {
          this.players = response;
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب اللاعبين');
        console.error(err);
      },
    });
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (response) => {
        if (response) {
          this.matches = response;
          this.started = this.matches.every(
            (match) => match.isCompleted === false
          );
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب الماتشات');
        console.error(err);
      },
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
    }

    return { result: `${player1Score} - ${player2Score}`, color: colorClass };
  }
}

import { PlayerService } from './../../core/services/player.service';
import { LeagueService } from './../../core/services/league.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Player, League, LeagueType } from 'src/app/models/interfaces';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
})
export class RankingComponent implements OnInit {
  players: Player[] = [];
  started: boolean = true;
  last: number = 0;
  currentLeague: League | null = null;
  LeagueType = LeagueType; // لسهولة الاستخدام في الـ template

  constructor(
    private playerService: PlayerService,
    private leagueService: LeagueService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCurrentLeague();
    this.loadPlayers();
  }

  private loadCurrentLeague(): void {
    this.leagueService.GetCurrentLeague().subscribe({
      next: (response: any) => {
        this.currentLeague = response.league;
      },
      error: (err: any) => {
        console.error('Error loading current league:', err);
        this.currentLeague = null;
      },
    });
  }

  private loadPlayers(): void {
    this.playerService.getrank().subscribe({
      next: (response) => {
        this.players = response;
        this.last = response.length - 1;
        this.started = this.players.every((match) => match.matchesPlayed === 0);
      },
      error: (err) => {
        this.toastr.error('حدث خطا اثناء جلب اللاعبين');
        console.error(err);
      },
    });
  }


}

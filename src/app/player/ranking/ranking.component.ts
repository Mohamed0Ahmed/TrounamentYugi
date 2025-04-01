import { PlayerService } from './../../core/services/player.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Player } from 'src/app/models/interfaces';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
})
export class RankingComponent implements OnInit {
  players: Player[] = [];
  started: boolean = true;

  constructor(
    private playerService: PlayerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.playerService.ranking$.subscribe({
      next: (players) => {
        this.players = players.sort((a: any, b: any) => b.points - a.points);
        this.started = this.players.every((match) => match.matchesPlayed === 0);
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب اللاعبين');
        console.error(err);
      },
    });

    this.playerService.getrank().subscribe();
  }

  loadPlayers(): void {
    this.playerService.getrank().subscribe({
      next: (response) => {
        if (response) {
          this.players = response.sort((a: any, b: any) => b.points - a.points);

          console.log(response);
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب اللاعبين');
        console.error(err);
      },
    });
  }
}

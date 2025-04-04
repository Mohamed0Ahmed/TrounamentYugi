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
  last: number = 0;

  constructor(
    private playerService: PlayerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.playerService.getrank().subscribe({
      next: (response) => {
        this.players = response;
        this.last = response.length - 1;
        this.started = this.players.every((match) => match.matchesPlayed === 0);
        console.log(response);
      },
      error: (err) => {
        this.toastr.error('حدث خطا اثناء جلب اللاعبين');
        console.error(err);
      },
    });
  }
}

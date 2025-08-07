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
  showDrawAnimation: boolean = false;

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
        // تحديث حالة الأنيميشن عند تحميل البطولة
        this.updateDrawAnimationState();
      },
      error: (err: any) => {
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

        // تحديد ما إذا كان يجب عرض أنيميشن القرعة
        this.updateDrawAnimationState();
      },
      error: (err) => {
        this.toastr.error('حدث خطا اثناء جلب اللاعبين');
      },
    });
  }

  private updateDrawAnimationState(): void {
    // التأكد من وجود البيانات المطلوبة
    if (!this.currentLeague || !this.players || this.players.length === 0) {
      this.showDrawAnimation = false;
      return;
    }

    // شروط عرض أنيميشن القرعة:
    // 1. البطولة من نوع Groups
    // 2. توجد مجموعات (تم تنفيذ Start Group Stage)
    // 3. كل اللاعبين لم يلعبوا أي مباريات
    const isGroupsTournament =
      this.currentLeague.typeOfLeague === LeagueType.Groups;
    const hasGroups = this.players.some((player) => player.groupNumber);
    const noMatchesPlayed = this.players.every(
      (player) => player.matchesPlayed === 0
    );

    this.showDrawAnimation = isGroupsTournament && hasGroups && noMatchesPlayed;
  }

  onDrawAnimationComplete(): void {
    this.showDrawAnimation = false;
  }
}

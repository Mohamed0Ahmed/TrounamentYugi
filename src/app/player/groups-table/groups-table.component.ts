import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';
import { LeagueService } from '../../core/services/league.service';
import { ToastrService } from 'ngx-toastr';
import { Player, League, LeagueType } from '../../models/interfaces';

@Component({
  selector: 'app-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.css'],
})
export class GroupsTableComponent implements OnInit {
  players: Player[] = [];
  currentLeague: League | null = null;
  LeagueType = LeagueType;
  started: boolean = true;

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
        this.started = this.players.every(
          (player) => player.matchesPlayed === 0
        );
      },
      error: (err) => {
        this.toastr.error('حدث خطأ أثناء جلب اللاعبين');
        console.error(err);
      },
    });
  }

  // تجميع اللاعبين حسب المجموعات
  getGroupedPlayers(): { [groupNumber: number]: Player[] } {
    const groupedPlayers: { [groupNumber: number]: Player[] } = {};

    // تجميع اللاعبين حسب groupNumber من الخادم
    this.players.forEach((player) => {
      if (player.groupNumber) {
        if (!groupedPlayers[player.groupNumber]) {
          groupedPlayers[player.groupNumber] = [];
        }
        groupedPlayers[player.groupNumber].push(player);
      }
    });

    // إذا لم يكن هناك groupNumber، استخدم التقسيم المحلي كاحتياطي
    if (Object.keys(groupedPlayers).length === 0) {
      const sortedPlayers = [...this.players].sort(
        (a, b) => b.points - a.points
      );
      sortedPlayers.forEach((player, index) => {
        const groupNumber = (index % 4) + 1;
        if (!groupedPlayers[groupNumber]) {
          groupedPlayers[groupNumber] = [];
        }
        groupedPlayers[groupNumber].push(player);
      });
    }

    // ترتيب اللاعبين في كل مجموعة حسب النقاط
    Object.keys(groupedPlayers).forEach((groupKey) => {
      const groupNumber = parseInt(groupKey);
      groupedPlayers[groupNumber].sort((a, b) => b.points - a.points);
    });

    return groupedPlayers;
  }

  // الحصول على أرقام المجموعات مرتبة
  getGroupNumbers(): number[] {
    const groupedPlayers = this.getGroupedPlayers();
    return Object.keys(groupedPlayers)
      .map((key) => parseInt(key))
      .sort((a, b) => a - b);
  }

  // التحقق من وجود لاعبين في المجموعات
  hasGroupedPlayers(): boolean {
    const groupedPlayers = this.getGroupedPlayers();
    return Object.keys(groupedPlayers).length > 0;
  }

  // التحقق من أن البطولة من نوع المجموعات
  isGroupsTournament(): boolean {
    return this.currentLeague?.typeOfLeague === LeagueType.Groups;
  }


}

import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';
import { MatchService } from '../../core/services/match.service';
import { LeagueService } from '../../core/services/league.service';
import { ToastrService } from 'ngx-toastr';
import {
  Player,
  Match,
  League,
  LeagueType,
  SystemOfLeague,
} from '../../models/interfaces';

@Component({
  selector: 'app-groups-matches-table',
  templateUrl: './groups-matches-table.component.html',
  styleUrls: ['./groups-matches-table.component.css'],
})
export class GroupsMatchesTableComponent implements OnInit {
  players: Player[] = [];
  matches: Match[] = [];
  currentLeague: League | null = null;
  started: boolean = true;
  highlightedColumn: number | null = null;
  systemOfLeague?: SystemOfLeague;
  SystemOfLeague = SystemOfLeague;
  LeagueType = LeagueType;

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private leagueService: LeagueService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCurrentLeague();
    this.loadPlayers();
    this.loadMatches();
    this.loadLeagueSystem();
  }

  private loadCurrentLeague(): void {
    this.leagueService.GetCurrentLeague().subscribe({
      next: (response: any) => {
        this.currentLeague = response.league;
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
      },
      error: (err) => {
        this.toastr.error('حدث خطأ أثناء جلب اللاعبين');

      },
    });
  }

  private loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (response) => {
        if (response) {
          this.matches = response;
          this.started = this.matches.every(
            (match) => match.score1 == 0 && match.score2 == 0
          );
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب الماتشات');
      },
    });
  }

  private loadLeagueSystem(): void {
    this.leagueService.GetCurrentLeague().subscribe({
      next: (res) => {
        this.systemOfLeague = res.league?.systemOfLeague;
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء جلب نظام الدوري');
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

  // الحصول على نتيجة المباراة بين لاعبين
  getMatchResult(player1: Player, player2: Player) {
    if (player1.playerId === player2.playerId) {
      return { result: 'N/A', color: 'text-gray-800' };
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

    let colorClass = 'text-white ';
    if (player1Score > player2Score) {
      colorClass = 'text-green-600 font-bold';
    } else if (player1Score < player2Score) {
      colorClass = 'text-red-600 font-bold';
    } else if (player1Score == player2Score && player1Score != 0) {
      colorClass = 'text-gray-400 font-bold text-yellow-400';
    }

    return { result: `${player1Score} - ${player2Score}`, color: colorClass };
  }

  // الحصول على نتيجة المباراة بالعربية
  getClassicResult(player1: Player, player2: Player) {
    if (player1.playerId === player2.playerId) {
      return { result: 'N/A', color: 'text-gray-800' };
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
    if (player1Score > player2Score) {
      return { result: 'فوز', color: 'text-green-600 font-bold' };
    } else if (player1Score < player2Score) {
      return { result: 'خسارة', color: 'text-red-600 font-bold' };
    } else if (player1Score === player2Score && player1Score !== 0) {
      return { result: 'تعادل', color: 'text-yellow-400 font-bold' };
    }
    return { result: '-', color: 'text-gray-500' };
  }

  // تمييز العمود
  highlightColumn(playerId: number) {
    this.highlightedColumn =
      this.highlightedColumn === playerId ? null : playerId;
  }
}

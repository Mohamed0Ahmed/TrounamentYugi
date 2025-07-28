import { Component, Input, OnInit } from '@angular/core';
import {
  Player,
  Match,
  SystemOfLeague,
  LeagueType,
  Group,
} from '../../models/interfaces';

@Component({
  selector: 'app-league-groups-preview',
  templateUrl: './league-groups-preview.component.html',
  styleUrls: ['./league-groups-preview.component.css'],
})
export class LeagueGroupsPreviewComponent implements OnInit {
  @Input() groups: Group[] = [];
  @Input() matches: Match[] = [];
  @Input() systemOfLeague?: SystemOfLeague;
  @Input() leagueType?: number;

  SystemOfLeague = SystemOfLeague;
  LeagueType = LeagueType;
  selectedGroup: number | null = null;
  showMatchesModal = false;
  selectedGroupMatches: Match[] = [];

  ngOnInit(): void {}

  // تجميع اللاعبين حسب المجموعات من الـ groups مباشرة
  getGroupedPlayers(): { [groupNumber: number]: Player[] } {
    const groupedPlayers: { [groupNumber: number]: Player[] } = {};
    this.groups.forEach((group) => {
      groupedPlayers[group.groupNumber] = group.players;
    });
    return groupedPlayers;
  }

  // الحصول على مباريات مجموعة معينة
  getGroupMatches(groupNumber: number): Match[] {
    const group = this.groups.find((g) => g.groupNumber === groupNumber);
    return group?.matches || [];
  }

  // الحصول على أرقام المجموعات مرتبة
  getGroupNumbers(): number[] {
    return this.groups.map((g) => g.groupNumber).sort((a, b) => a - b);
  }

  // التحقق من وجود مجموعات
  hasGroupedPlayers(): boolean {
    return this.groups && this.groups.length > 0;
  }

  // التحقق من أن البطولة من نوع المجموعات
  isGroupsTournament(): boolean {
    return this.leagueType === LeagueType.Groups;
  }

  // الحصول على نتيجة المباراة بين لاعبين
  getMatchResult(player1: Player, player2: Player, groupMatches: Match[]) {
    if (player1.playerId === player2.playerId) {
      return { result: 'N/A', color: 'text-gray-800' };
    }

    const match = groupMatches.find(
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
  getClassicResult(player1: Player, player2: Player, groupMatches: Match[]) {
    if (player1.playerId === player2.playerId) {
      return { result: 'N/A', color: 'text-gray-800' };
    }
    const match = groupMatches.find(
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

  // فتح مودال مباريات المجموعة
  openGroupMatches(groupNumber: number) {
    this.selectedGroup = groupNumber;
    this.selectedGroupMatches = this.getGroupMatches(groupNumber);
    this.showMatchesModal = true;
  }

  // إغلاق مودال المباريات
  closeMatchesModal() {
    this.showMatchesModal = false;
    this.selectedGroup = null;
    this.selectedGroupMatches = [];
  }
}

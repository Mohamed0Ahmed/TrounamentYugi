import { MessageService } from 'src/app/core/services/message.service';
import { MatchService } from 'src/app/core/services/match.service';
import { PlayerService } from 'src/app/core/services/player.service';
import { LeagueService } from 'src/app/core/services/league.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  totalPlayers: number = 0;
  totalMatches: number = 0;
  totalMatchesLeft: number = 0;
  totalMessages: number = 0;
  totalMessagesLeft: number = 0;
  showResetModal: boolean = false;

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private messageService: MessageService,
    private leagueService: LeagueService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.playerService.getrank().subscribe({
      next: (response) => {
        if (response) {
          this.totalPlayers = response.length;
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب عدد اللاعبين');
      },
    });

    this.matchService.getMatches().subscribe({
      next: (response) => {
        if (response) {
          this.totalMatches = response.length;
          this.totalMatchesLeft = response.filter(
            (match) => match.isCompleted == false
          ).length;
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب عدد الماتشات');
        console.error(err);
      },
    });

    this.messageService.getMessages().subscribe({
      next: (response) => {
        if (response) {
          this.totalMessages = response.messages.length;
          this.totalMessagesLeft = response.messages.filter(
            (m) => m.isRead == false
          ).length;
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب عدد الرسائل');
        console.error(err);
      },
    });
  }

  openResetModal(): void {
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
  }

  resetTournament(): void {
    this.leagueService.resetLeague().subscribe({
      next: (response) => {
        this.toastr.success(response);
        this.loadStats();
        this.showResetModal = false;
      },
      error: (err) => {
        this.toastr.error('فشل في إعادة تعيين الدوري');
        console.error(err);
      },
    });
  }
}

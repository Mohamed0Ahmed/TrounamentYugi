import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../../core/services/league.service';
import { ToastrService } from 'ngx-toastr';
import { League, LeagueType, SystemOfLeague } from '../../models/interfaces';

@Component({
  selector: 'app-tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.css'],
})
export class TournamentInfoComponent implements OnInit {
  currentLeague: League | null = null;
  LeagueType = LeagueType;
  SystemOfLeague = SystemOfLeague;

  constructor(
    private leagueService: LeagueService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCurrentLeague();
  }

  private loadCurrentLeague(): void {
    this.leagueService.GetCurrentLeague().subscribe({
      next: (response: any) => {
        this.currentLeague = response.league;
      },
      error: (err: any) => {
        console.error('Tournament Info - خطأ في جلب الدوري:', err);
        this.currentLeague = null;
      },
    });
  }

  // الحصول على نوع البطولة كنص
  getLeagueTypeText(): string {
    if (!this.currentLeague) return 'Unknown';

    switch (this.currentLeague.typeOfLeague) {
      case LeagueType.Single:
        return 'Single League';
      case LeagueType.Multi:
        return 'Multi League';
      case LeagueType.Groups:
        return 'Groups Tournament';
      default:
        return 'Unknown';
    }
  }

  // الحصول على نظام البطولة كنص
  getSystemOfLeagueText(): string {
    if (!this.currentLeague?.systemOfLeague) return 'Unknown';

    const system = this.currentLeague.systemOfLeague as any;
    return system === 0 ? 'Points System' : 'Classic System';
  }

  // التحقق من أن البطولة من نوع المجموعات
  isGroupsTournament(): boolean {
    return (
      this.currentLeague?.typeOfLeague === LeagueType.Groups ||
      String(this.currentLeague?.typeOfLeague) === 'Groups'
    );
  }

  // الحصول على تاريخ البطولة
  getFormattedDate(): string {
    if (!this.currentLeague?.createdOn) return 'Unknown';
    return new Date(this.currentLeague.createdOn).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // الحصول على حالة البطولة
  getTournamentStatus(): { text: string; color: string } {
    if (!this.currentLeague) {
      return { text: 'No Active Tournament', color: 'text-gray-400' };
    }

    if (this.currentLeague.isFinished) {
      return { text: 'Finished', color: 'text-red-500' };
    } else {
      return { text: 'Live Now!', color: 'text-green-500' };
    }
  }
}

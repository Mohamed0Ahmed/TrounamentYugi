import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { LeagueService } from './../../core/services/league.service';
import {
  AllLeagueRank,
  Player,
  Match,
  SystemOfLeague,
} from './../../models/interfaces';
import { OwlOptions, CarouselComponent } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-leagues',
  templateUrl: './all-leagues.component.html',
  styleUrls: ['./all-leagues.component.css'],
})
export class AllLeaguesComponent implements OnInit {
  @ViewChild('owlCarousel') owlCarousel!: CarouselComponent;
  leaguesRank: AllLeagueRank[] = [];
  players: Player[] = [];
  highlightedColumn: number | null = null;
  matches: Match[] = [];
  LeagueId: number = 0;
  isModalOpen: boolean = false;
  currentModalSystemOfLeague?: SystemOfLeague;
  SystemOfLeague = SystemOfLeague;
  showKnockoutMatches: boolean = false;
  isKnockoutModalOpen: boolean = false;
  currentKnockoutLeagueId: number = 0;
  currentSlideIndex: number = 0;

  constructor(
    private leagueService: LeagueService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.leagueService.GetAllLeaguesRank().subscribe({
      next: (response) => {
        // console.log(response);

        if (response) {
          this.leaguesRank = this.sortLeaguesForDisplay(response);
          // console.log('All leagues data loaded from cache or server');
        } else {
          this.toastr.error(response);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  // Method to handle carousel changes
  onCarouselChanged(event: any): void {
    if (event && event.startPosition !== undefined) {
      this.currentSlideIndex = event.startPosition;
      console.log('Carousel changed to position:', this.currentSlideIndex);
    }
  }

  loadData() {
    this.leagueService.GetAllLeaguesRank().subscribe({
      next: (response) => {
        this.leaguesRank = this.sortLeaguesForDisplay(response);
      },
      error: (error) => {
        this.toastr.error('حدث خطأ أثناء تحميل بيانات الدوريات');
      },
    });
  }

  // Sort leagues for display (newest first for carousel)
  private sortLeaguesForDisplay(leagues: AllLeagueRank[]): AllLeagueRank[] {
    return [...leagues].sort((a, b) => {
      const dateA = new Date(a.createdOn).getTime();
      const dateB = new Date(b.createdOn).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }

  customOptions: OwlOptions = {
    nav: false,
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    // dots: false,
    navSpeed: 700,
    // navText: ['Previous', 'Next'],
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  };

  openModal(id: number): void {
    this.LeagueId = id;
    this.isModalOpen = true;

    // Use existing data from leaguesRank instead of making a separate request
    const league = this.leaguesRank.find((l) => l.leagueId === id);
    if (league) {
      this.players = league.players || [];
      this.matches = league.matches || [];
      this.currentModalSystemOfLeague = league.systemOfLeague;
    } else {
      this.players = [];
      this.matches = [];
      this.currentModalSystemOfLeague = undefined;
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.LeagueId = 0;
    this.highlightedColumn = null;
    this.players = [];
    this.matches = [];
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

    let colorClass = 'text-white';
    if (player1Score > player2Score) {
      colorClass = 'text-green-600 font-bold';
    } else if (player1Score < player2Score) {
      colorClass = 'text-red-600 font-bold';
    } else if (player1Score === player2Score && player1Score !== 0) {
      colorClass = 'text-yellow-400 font-bold';
    }

    return { result: `${player1Score} - ${player2Score}`, color: colorClass };
  }

  getClassicResult(player1: Player, player2: Player) {
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
    if (player1Score > player2Score) {
      return { result: 'فوز', color: 'text-green-600 font-bold' };
    } else if (player1Score < player2Score) {
      return { result: 'خسارة', color: 'text-red-600 font-bold' };
    } else if (player1Score === player2Score && player1Score !== 0) {
      return { result: 'تعادل', color: 'text-yellow-400 font-bold' };
    }
    return { result: '-', color: 'text-gray-500' };
  }

  highlightColumn(playerId: number) {
    this.highlightedColumn =
      this.highlightedColumn === playerId ? null : playerId;
  }

  toggleKnockoutMatches(): void {
    this.showKnockoutMatches = !this.showKnockoutMatches;
  }

  openKnockoutModal(leagueId: number): void {
    this.currentKnockoutLeagueId = leagueId;
    this.isKnockoutModalOpen = true;
  }

  closeKnockoutModal(): void {
    this.isKnockoutModalOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const table = document.querySelector('table');
    if (table && !table.contains(event.target as Node) && this.isModalOpen) {
      this.highlightedColumn = null;
    }
  }

  // دالة مساعدة لإرجاع systemOfLeague لدوري معين
  getSystemOfLeagueForLeague(league: any): SystemOfLeague | undefined {
    return league?.systemOfLeague;
  }

  // دالة للحصول على مباريات دوري معين
  getLeagueMatches(leagueId: number): Match[] {
    const league = this.leaguesRank.find((l) => l.leagueId === leagueId);
    if (!league) return [];

    // للدوريات العادية، نرجع matches
    if (league.leagueType !== 2) {
      return league.matches || [];
    }

    // لدوريات المجموعات، نجمع matches و knockoutMatches
    const allMatches: Match[] = [];
    if (league.matches) {
      allMatches.push(...league.matches);
    }
    if (league.knockoutMatches) {
      allMatches.push(...league.knockoutMatches);
    }
    return allMatches;
  }

  // تعديل دوال النتائج لتأخذ systemOfLeague كـ parameter
  getDisplayResult(
    player1: Player,
    player2: Player,
    systemOfLeague: SystemOfLeague | undefined
  ) {
    if (systemOfLeague === SystemOfLeague.Classic) {
      return this.getClassicResult(player1, player2);
    }
    return this.getMatchResult(player1, player2);
  }

  // Navigation methods
  previousSlide(): void {
    this.owlCarousel?.prev();
  }

  nextSlide(): void {
    this.owlCarousel?.next();
  }

  // Check if we're at the first slide
  isFirstSlide(): boolean {
    if (this.leaguesRank.length === 0) return true;
    return this.currentSlideIndex === 0;
  }

  // Check if we're at the last slide
  isLastSlide(): boolean {
    if (this.leaguesRank.length === 0) return true;
    return this.currentSlideIndex >= this.leaguesRank.length - 1;
  }
}

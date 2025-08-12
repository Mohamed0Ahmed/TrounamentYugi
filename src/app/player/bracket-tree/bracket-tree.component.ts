import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from 'src/app/models/interfaces';
import { LeagueService } from 'src/app/core/services/league.service';

@Component({
  selector: 'app-bracket-tree',
  templateUrl: './bracket-tree.component.html',
  styleUrls: ['./bracket-tree.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class BracketTreeComponent implements OnInit, OnChanges {
  @Input() leagueId?: number;

  quarterFinals = signal<Match[]>([]);
  semiFinals = signal<Match[]>([]);
  final = signal<Match | null>(null);

  constructor(private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.loadKnockoutMatches();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leagueId']) {
      this.loadKnockoutMatches();
    }
  }

  private loadKnockoutMatches(): void {
    if (!this.leagueId) {
      this.quarterFinals.set([]);
      this.semiFinals.set([]);
      this.final.set(null);
      return;
    }

    this.leagueService.GetAllLeaguesRank().subscribe({
      next: (leagues) => {
        const league = leagues.find((l) => l.leagueId === this.leagueId);

        // البحث عن knockout matches في matches العادية
        let allMatches: Match[] = [];
        if (league?.matches) {
          allMatches.push(...league.matches);
        }
        if (league?.knockoutMatches) {
          allMatches.push(...league.knockoutMatches);
        }

        // تصفية المباريات الإقصائية بناءً على stage مع إزالة التكرار
        const knockoutMatches = allMatches.filter((match, index, self) => {
          const stage = match.stage || match.tournamentStage;

          // التحقق من أن المباراة إقصائية
          const isKnockout =
            stage === 'QuarterFinals' ||
            stage === 'SemiFinals' ||
            stage === 'Final' ||
            (stage === 'GroupStage' && false); // GroupStage ليست إقصائية

          // إزالة التكرار بناءً على matchId
          const isDuplicate =
            self.findIndex((m) => m.matchId === match.matchId) !== index;

          return isKnockout && !isDuplicate;
        });

        if (knockoutMatches.length > 0) {
          this.processKnockoutMatches(knockoutMatches);
        } else {
          this.quarterFinals.set([]);
          this.semiFinals.set([]);
          this.final.set(null);
        }
      },
      error: (error) => {
        this.quarterFinals.set([]);
        this.semiFinals.set([]);
        this.final.set(null);
      },
    });
  }

  private processKnockoutMatches(knockoutMatches: Match[]): void {
    const quarterFinalsMatches = knockoutMatches.filter((m) => {
      const stage = m.stage || m.tournamentStage;
      const isQuarterFinal = stage === 'QuarterFinals';
      return isQuarterFinal;
    });

    const semiFinalsMatches = knockoutMatches.filter((m) => {
      const stage = m.stage || m.tournamentStage;
      const isSemiFinal = stage === 'SemiFinals';
      return isSemiFinal;
    });

    const finalMatch = knockoutMatches.find((m) => {
      const stage = m.stage || m.tournamentStage;
      const isFinal = stage === 'Final';
      return isFinal;
    });

    this.quarterFinals.set(this.shuffleMatches(quarterFinalsMatches));
    this.semiFinals.set(this.shuffleMatches(semiFinalsMatches));
    this.final.set(finalMatch ?? null);
  }

  private shuffleMatches(matches: Match[]): Match[] {
    return matches.map((match) => {
      // 50% chance to swap player positions
      if (Math.random() > 0.5) {
        return {
          ...match,
          player1Name: match.player2Name,
          player2Name: match.player1Name,
          player1Id: match.player2Id,
          player2Id: match.player1Id,
          score1: match.score2,
          score2: match.score1,
        };
      }
      return match;
    });
  }

  hasQuarterFinals(): boolean {
    return this.quarterFinals().length > 0;
  }

  hasSemiFinals(): boolean {
    return this.semiFinals().length > 0;
  }

  hasFinal(): boolean {
    return this.final() !== null;
  }

 
}

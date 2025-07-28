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
import { Match, TournamentStage } from 'src/app/models/interfaces';
import { LeagueService } from 'src/app/core/services/league.service';

@Component({
  selector: 'app-bracket-tree',
  templateUrl: './bracket-tree.component.html',
  styleUrls: ['./bracket-tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        if (league && league.knockoutMatches) {
          this.processKnockoutMatches(league.knockoutMatches);
        } else {
          this.quarterFinals.set([]);
          this.semiFinals.set([]);
          this.final.set(null);
        }
      },
      error: (error) => {
        console.error('Error loading knockout matches:', error);
        this.quarterFinals.set([]);
        this.semiFinals.set([]);
        this.final.set(null);
      },
    });
  }

  private processKnockoutMatches(knockoutMatches: Match[]): void {
    this.quarterFinals.set(
      this.shuffleMatches(
        knockoutMatches.filter((m) => {
          const stage = m.tournamentStage
            ? parseInt(m.tournamentStage)
            : m.stage;
          return m.stage === TournamentStage.QuarterFinals || stage === 2;
        })
      )
    );
    this.semiFinals.set(
      this.shuffleMatches(
        knockoutMatches.filter((m) => {
          const stage = m.tournamentStage
            ? parseInt(m.tournamentStage)
            : m.stage;
          return m.stage === TournamentStage.SemiFinals || stage === 3;
        })
      )
    );
    this.final.set(
      knockoutMatches.find((m) => {
        const stage = m.tournamentStage ? parseInt(m.tournamentStage) : m.stage;
        return m.stage === TournamentStage.Final || stage === 4;
      }) ?? null
    );
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
}

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import { map, tap, catchError, shareReplay, filter } from 'rxjs/operators';
import { PlayerService } from './player.service';
import { MatchService } from './match.service';
import { LeagueService } from './league.service';
import { MessageService } from './message.service';
import { NoteService } from './note.service';
import {
  Player,
  Match,
  League,
  AllLeagueRank,
  Note,
  Message,
} from '../../models/interfaces';

export interface AdminDashboardData {
  players: Player[];
  matches: Match[];
  currentLeague: League | null;
  allLeagues: AllLeagueRank[];
  notes: Note[];
  messages: Message[];
  stats: {
    totalPlayers: number;
    totalMatches: number;
    totalMatchesLeft: number;
    totalMessagesLeft: number;
  };
}

export interface AdminSecondaryData {
  allLeagues: AllLeagueRank[];
  notes: Note[];
  messages: Message[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private essentialDataCache$ = new BehaviorSubject<AdminDashboardData | null>(
    null
  );
  private secondaryDataCache = new Map<string, any>();
  private lastEssentialUpdate = 0;
  private lastSecondaryUpdate = new Map<string, number>();
  private readonly CACHE_DURATION = 900000; // 15 minutes
  private readonly SECONDARY_CACHE_DURATION = 900000; // 15 minutes (same as main cache)

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private leagueService: LeagueService,
    private messageService: MessageService,
    private noteService: NoteService
  ) {}

  /**
   * Get essential dashboard data with smart caching
   */
  getEssentialData(forceRefresh = false): Observable<AdminDashboardData> {
    const now = Date.now();
    const hasValidCache =
      this.essentialDataCache$.value &&
      now - this.lastEssentialUpdate < this.CACHE_DURATION;

    if (!forceRefresh && hasValidCache) {
      return this.essentialDataCache$
        .asObservable()
        .pipe(filter((data): data is AdminDashboardData => data !== null));
    }

    return this.loadEssentialDataFromServer().pipe(
      tap((data) => {
        this.essentialDataCache$.next(data);
        this.lastEssentialUpdate = now;
      }),
      catchError((error) => {
        console.error('❌ Error loading essential data:', error);
        // Return cached data if available, otherwise empty state
        return of(
          this.essentialDataCache$.value || this.getEmptyDashboardData()
        );
      }),
      shareReplay(1)
    );
  }

  /**
   * Get secondary data with smart caching
   */
  getSecondaryData(
    type: 'leagues' | 'notes' | 'messages',
    forceRefresh = false
  ): Observable<any> {
    const now = Date.now();
    const lastUpdate = this.lastSecondaryUpdate.get(type) || 0;
    const hasValidCache =
      this.secondaryDataCache.has(type) &&
      now - lastUpdate < this.SECONDARY_CACHE_DURATION;

    if (!forceRefresh && hasValidCache) {
      return of(this.secondaryDataCache.get(type));
    }

    return this.loadSecondaryDataFromServer(type).pipe(
      tap((data) => {
        this.secondaryDataCache.set(type, data);
        this.lastSecondaryUpdate.set(type, now);
      }),
      catchError((error) => {
        console.error(`❌ Error loading ${type}:`, error);
        // Return cached data if available
        return of(this.secondaryDataCache.get(type) || []);
      })
    );
  }

  /**
   * Load essential data from server using parallel requests
   */
  private loadEssentialDataFromServer(): Observable<AdminDashboardData> {
    return forkJoin({
      players: this.playerService.getAdminPlayers(),
      matches: this.matchService.getAdminMatches(),
      currentLeague: this.leagueService.getAdminCurrentLeague().pipe(
        map((response) => response.league),
        catchError(() => of(null))
      ),
      allLeagues: this.leagueService
        .getAdminAllLeagues()
        .pipe(catchError(() => of([]))),
      notes: this.noteService.getAdminNotes().pipe(
        map((response) => response.notes),
        catchError(() => of([]))
      ),
      messages: this.messageService.getAdminMessages().pipe(
        map((response) => response.messages || []),
        catchError(() => of([]))
      ),
    }).pipe(
      map(
        ({ players, matches, currentLeague, allLeagues, notes, messages }) => {
          const messagesList = Array.isArray(messages) ? messages : [];
          return {
            players: players as Player[],
            matches: matches as Match[],
            currentLeague,
            allLeagues: allLeagues as AllLeagueRank[],
            notes: notes as Note[],
            messages: messagesList as Message[],
            stats: {
              totalPlayers: players.length,
              totalMatches: matches.length,
              totalMatchesLeft: matches.filter((m) => !m.isCompleted).length,
              totalMessagesLeft: messagesList.filter(
                (m: any) => !m.isRead && !m.isFromAdmin
              ).length,
            },
          };
        }
      )
    );
  }

  /**
   * Load secondary data from server
   */
  private loadSecondaryDataFromServer(type: string): Observable<any> {
    switch (type) {
      case 'leagues':
        return this.leagueService.getAdminAllLeagues();
      case 'notes':
        return this.noteService
          .getAdminNotes()
          .pipe(map((response) => response.notes));
      case 'messages':
        return this.messageService
          .getAdminMessages()
          .pipe(map((response) => response.messages || []));
      default:
        return of([]);
    }
  }

  /**
   * Update cached data after mutations
   */
  invalidateCache(
    type: 'essential' | 'leagues' | 'notes' | 'messages' | 'all'
  ): void {
    switch (type) {
      case 'essential':
        this.lastEssentialUpdate = 0;
        break;
      case 'leagues':
      case 'notes':
      case 'messages':
        this.lastSecondaryUpdate.set(type, 0);
        this.secondaryDataCache.delete(type);
        break;
      case 'all':
        this.lastEssentialUpdate = 0;
        this.lastSecondaryUpdate.clear();
        this.secondaryDataCache.clear();
        break;
    }
  }

  // ✅ تم حذف Background refresh تماماً - مالوش لازمة أصلاً

  /**
   * Get current cached essential data
   */
  getCurrentEssentialData(): AdminDashboardData | null {
    return this.essentialDataCache$.value;
  }

  /**
   * Update message count in stats
   */
  updateMessageCount(count: number): void {
    const current = this.essentialDataCache$.value;
    if (current) {
      current.stats.totalMessagesLeft = count;
      this.essentialDataCache$.next(current);
    }
  }

  private getEmptyDashboardData(): AdminDashboardData {
    return {
      players: [],
      matches: [],
      currentLeague: null,
      allLeagues: [],
      notes: [],
      messages: [],
      stats: {
        totalPlayers: 0,
        totalMatches: 0,
        totalMatchesLeft: 0,
        totalMessagesLeft: 0,
      },
    };
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default
  private readonly PLAYER_TTL = 60 * 60 * 1000; // 1 hour for player data
  private readonly LEAGUE_TTL = 24 * 60 * 60 * 1000; // 24 hours for league data

  constructor() {
    this.loadFromLocalStorage();
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, item);
    this.saveToLocalStorage();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      this.saveToLocalStorage();
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
    this.saveToLocalStorage();
  }

  remove(key: string): void {
    this.cache.delete(key);
    this.saveToLocalStorage();
  }

  // Helper method to cache HTTP requests
  cacheRequest<T>(
    key: string,
    request: Observable<T>,
    ttl: number = this.DEFAULT_TTL
  ): Observable<T> {
    const cached = this.get<T>(key);
    if (cached) {
      return of(cached);
    }

    return request.pipe(
      tap((data) => this.set(key, data, ttl)),
      catchError((error) => {
        console.error('Cache request failed:', error);
        throw error;
      })
    );
  }

  // Cache player data with 1 hour TTL
  cachePlayerRequest<T>(key: string, request: Observable<T>): Observable<T> {
    return this.cacheRequest(key, request, this.PLAYER_TTL);
  }

  // Cache league data with 24 hours TTL
  cacheLeagueRequest<T>(key: string, request: Observable<T>): Observable<T> {
    return this.cacheRequest(key, request, this.LEAGUE_TTL);
  }

  // Cache all-leagues data with 24 hours TTL and sort by creation date (newest first)
  cacheAllLeaguesRequest<T>(
    key: string,
    request: Observable<T>
  ): Observable<T> {
    const cached = this.get<T>(key);
    if (cached) {
      return of(cached);
    }

    return request.pipe(
      tap((data: any) => {
        // Sort leagues by createdOn date (newest first) if it's an array
        if (Array.isArray(data) && data.length > 0 && data[0].createdOn) {
          const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.createdOn).getTime();
            const dateB = new Date(b.createdOn).getTime();
            return dateB - dateA; // Descending order (newest first)
          });
          this.set(key, sortedData, this.LEAGUE_TTL);
        } else {
          this.set(key, data, this.LEAGUE_TTL);
        }
      }),
      catchError((error) => {
        console.error('Cache request failed:', error);
        throw error;
      })
    );
  }

  // Invalidate cache for specific patterns
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
    this.saveToLocalStorage();
  }

  // Get next update time for player data (every hour)
  getNextPlayerUpdateTime(): Date {
    const now = new Date();
    const nextHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0,
      0,
      0
    );
    return nextHour;
  }

  // Get last update time for a specific key
  getLastUpdateTime(key: string): Date | null {
    const item = this.cache.get(key);
    return item ? new Date(item.timestamp) : null;
  }

  private saveToLocalStorage(): void {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('app_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const cacheData = localStorage.getItem('app_cache');
      if (cacheData) {
        const entries = JSON.parse(cacheData);
        this.cache = new Map(entries);

        // Clean expired items
        for (const [key, item] of this.cache.entries()) {
          if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
    }
  }
}

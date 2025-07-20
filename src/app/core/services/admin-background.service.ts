import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from './cache.service';
import { BehaviorSubject, interval } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AdminUpdateStatus {
  isUpdating: boolean;
  lastUpdateTime: Date;
  nextUpdateTime: Date;
  timeUntilNextUpdate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminBackgroundService {
  private updateInterval: any;
  private isUpdating = false;
  private baseUrl = environment.apiUrl;
  private updateStatusSubject = new BehaviorSubject<AdminUpdateStatus>({
    isUpdating: false,
    lastUpdateTime: new Date(
      this.getNextHalfHourTime().getTime() - 30 * 60 * 1000
    ),
    nextUpdateTime: this.getNextHalfHourTime(),
    timeUntilNextUpdate: '',
  });

  public updateStatus$ = this.updateStatusSubject.asObservable();

  constructor(private http: HttpClient, private cacheService: CacheService) {
    // Initialize lastUpdateTime to be 30 minutes before nextUpdateTime
    const nextUpdateTime = this.getNextHalfHourTime();
    const lastUpdateTime = new Date(nextUpdateTime.getTime() - 30 * 60 * 1000);

    // Update the initial status with proper lastUpdateTime
    this.updateStatusSubject.next({
      isUpdating: false,
      lastUpdateTime: lastUpdateTime,
      nextUpdateTime: nextUpdateTime,
      timeUntilNextUpdate: this.getTimeUntilNextUpdate(),
    });

    // Delay initialization to prevent circular dependency
    setTimeout(() => {
      this.startAutoUpdate();
      this.startStatusUpdates();
    }, 0);
  }

  private getNextHalfHourTime(): Date {
    const now = new Date();
    const minutes = now.getMinutes();
    const nextHalfHour = minutes >= 30 ? 60 : 30;
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      nextHalfHour,
      0,
      0
    );
  }

  private startAutoUpdate() {
    // Calculate time until next half hour
    const now = new Date();
    const nextHalfHour = this.getNextHalfHourTime();
    const timeUntilNextHalfHour = nextHalfHour.getTime() - now.getTime();

    // Start first update after time until next half hour
    setTimeout(() => {
      this.updateAdminData();
      this.startHalfHourlyUpdates();
    }, timeUntilNextHalfHour);
  }

  private startHalfHourlyUpdates() {
    this.updateInterval = setInterval(() => {
      this.updateAdminData();
    }, 30 * 60 * 1000); // Every 30 minutes
  }

  private updateAdminData() {
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.updateStatusSubject.next({
      ...this.updateStatusSubject.value,
      isUpdating: true,
    });

    // console.log('🔄 Starting automatic admin data update...');

    // Update players list
    this.http.get<[]>(`${this.baseUrl}/player`).subscribe({
      next: (data) => {
        // console.log('✅ Players list updated');
        this.cacheService.set('admin-players-list', data, 30 * 60 * 1000);
      },
      error: (error) => {
        console.error('❌ Failed to update players list:', error);
      },
    });

    // Update matches
    this.http.get<[]>(`${this.baseUrl}/match`).subscribe({
      next: (data) => {
        // console.log('✅ Matches updated');
        this.cacheService.set('admin-matches-list', data, 30 * 60 * 1000);
      },
      error: (error) => {
        console.error('❌ Failed to update matches:', error);
      },
    });

    // Update messages
    this.http.get<[]>(`${this.baseUrl}/Message/inbox`).subscribe({
      next: (data) => {
        // console.log('✅ Messages updated');
        this.cacheService.set('admin-messages-list', data, 30 * 60 * 1000);
      },
      error: (error) => {
        console.error('❌ Failed to update messages:', error);
      },
    });

    // Update notes
    this.http.get<[]>(`${this.baseUrl}/note/notes`).subscribe({
      next: (data) => {
        // console.log('✅ Notes updated');
        this.cacheService.set('admin-notes-list', data, 30 * 60 * 1000);
      },
      error: (error) => {
        console.error('❌ Failed to update notes:', error);
      },
    });

    // Update all leagues
    this.http.get<[]>(`${this.baseUrl}/player/players/all`).subscribe({
      next: (data) => {
        // console.log('✅ All leagues updated');
        this.cacheService.set('admin-all-leagues-list', data, 30 * 60 * 1000);
      },
      error: (error) => {
        console.error('❌ Failed to update all leagues:', error);
      },
    });

    // Update current league
    this.http
      .get<{ league: any }>(`${this.baseUrl}/league/getCurrentLeague`)
      .subscribe({
        next: (data) => {
          // console.log('✅ Current league updated');
          this.cacheService.set('admin-current-league', data, 30 * 60 * 1000);
        },
        error: (error) => {
          console.error('❌ Failed to update current league:', error);
        },
      });

    setTimeout(() => {
      this.isUpdating = false;
      const nextUpdateTime = this.getNextHalfHourTime();
      // Set lastUpdateTime to be exactly 30 minutes before nextUpdateTime
      const lastUpdateTime = new Date(
        nextUpdateTime.getTime() - 30 * 60 * 1000
      );

      this.updateStatusSubject.next({
        isUpdating: false,
        lastUpdateTime: lastUpdateTime,
        nextUpdateTime: nextUpdateTime,
        timeUntilNextUpdate: this.getTimeUntilNextUpdate(),
      });
      // console.log('✅ Automatic admin data update completed');
    }, 5000); // Wait 5 seconds for updates to complete
  }

  private startStatusUpdates() {
    // Update status every minute
    interval(60000).subscribe(() => {
      const currentStatus = this.updateStatusSubject.value;
      this.updateStatusSubject.next({
        ...currentStatus,
        timeUntilNextUpdate: this.getTimeUntilNextUpdate(),
      });
    });
  }

  private getTimeUntilNextUpdate(): string {
    const nextUpdate = this.updateStatusSubject.value.nextUpdateTime;
    const now = new Date();
    const diff = nextUpdate.getTime() - now.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Get current update status
  getUpdateStatus(): AdminUpdateStatus {
    return this.updateStatusSubject.value;
  }

  // Format time for display
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Stop auto updates (for cleanup)
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  // Force update now
  forceUpdate() {
    this.updateAdminData();
  }

  // Invalidate admin cache
  invalidateAdminCache() {
    this.cacheService.remove('admin-players-list');
    this.cacheService.remove('admin-matches-list');
    this.cacheService.remove('admin-messages-list');
    this.cacheService.remove('admin-notes-list');
    this.cacheService.remove('admin-all-leagues-list');
    this.cacheService.remove('admin-current-league');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from './cache.service';
import { BehaviorSubject, interval } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UpdateStatus {
  isUpdating: boolean;
  lastUpdateTime: Date;
  nextUpdateTime: Date;
  timeUntilNextUpdate: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackgroundUpdateService {
  private updateInterval: any;
  private isUpdating = false;
  private baseUrl = environment.apiUrl;
  private updateStatusSubject = new BehaviorSubject<UpdateStatus>({
    isUpdating: false,
    lastUpdateTime: new Date(this.getNextHourTime().getTime() - 60 * 60 * 1000),
    nextUpdateTime: this.getNextHourTime(),
    timeUntilNextUpdate: '',
  });

  public updateStatus$ = this.updateStatusSubject.asObservable();

  constructor(private http: HttpClient, private cacheService: CacheService) {
    // Initialize lastUpdateTime to be 1 hour before nextUpdateTime
    const nextUpdateTime = this.getNextHourTime();
    const lastUpdateTime = new Date(nextUpdateTime.getTime() - 60 * 60 * 1000);

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

  private getNextHourTime(): Date {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0,
      0,
      0
    );
  }

  private startAutoUpdate() {
    // Calculate time until next hour
    const now = new Date();
    const nextHour = this.getNextHourTime();
    const timeUntilNextHour = nextHour.getTime() - now.getTime();

    // Start first update after time until next hour
    setTimeout(() => {
      this.updatePlayerData();
      this.startHourlyUpdates();
    }, timeUntilNextHour);
  }

  private startHourlyUpdates() {
    this.updateInterval = setInterval(() => {
      this.updatePlayerData();
    }, 60 * 60 * 1000); // Every hour
  }

  private updatePlayerData() {
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.updateStatusSubject.next({
      ...this.updateStatusSubject.value,
      isUpdating: true,
    });

    // console.log('🔄 Starting automatic player data update...');

    // Update player ranking directly via HTTP
    this.http.get<[]>(`${this.baseUrl}/player/ranking`).subscribe({
      next: (data) => {
        // console.log('✅ Player ranking updated');
        this.cacheService.set('player-ranking', data, 60 * 60 * 1000);
      },
      error: (error) => {
        console.error('❌ Failed to update player ranking:', error);
      },
    });

    // Update players list directly via HTTP
    this.http.get<[]>(`${this.baseUrl}/player`).subscribe({
      next: (data) => {
        // console.log('✅ Players list updated');
        this.cacheService.set('players-list', data, 60 * 60 * 1000);
      },
      error: (error) => {
        console.error('❌ Failed to update players list:', error);
      },
    });

    setTimeout(() => {
      this.isUpdating = false;
      const nextUpdateTime = this.getNextHourTime();
      // Set lastUpdateTime to be exactly 1 hour before nextUpdateTime
      const lastUpdateTime = new Date(
        nextUpdateTime.getTime() - 60 * 60 * 1000
      );

      this.updateStatusSubject.next({
        isUpdating: false,
        lastUpdateTime: lastUpdateTime,
        nextUpdateTime: nextUpdateTime,
        timeUntilNextUpdate: this.getTimeUntilNextUpdate(),
      });
      // console.log('✅ Automatic player data update completed');
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

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  // Get current update status
  getUpdateStatus(): UpdateStatus {
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
}

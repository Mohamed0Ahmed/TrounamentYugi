import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { AdminBackgroundService, AdminUpdateStatus } from '../../core/services/admin-background.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-update-status',
  templateUrl: './admin-update-status.component.html',
  styleUrls: ['./admin-update-status.component.css']
})
export class AdminUpdateStatusComponent implements OnInit, OnDestroy {
  updateStatus: AdminUpdateStatus;
  private updateSubscription: Subscription | null = null;
  private adminBackgroundService: AdminBackgroundService;

  constructor(private injector: Injector) {
    // Lazy injection to avoid circular dependency
    this.adminBackgroundService = this.injector.get(AdminBackgroundService);
    this.updateStatus = this.adminBackgroundService.getUpdateStatus();
  }

  ngOnInit(): void {
    // Delay subscription slightly to ensure service is fully initialized
    setTimeout(() => {
      this.updateSubscription = this.adminBackgroundService.updateStatus$.subscribe(
        (status) => {
          this.updateStatus = status;
        }
      );
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  formatTime(date: Date): string {
    return this.adminBackgroundService.formatTime(date);
  }
}

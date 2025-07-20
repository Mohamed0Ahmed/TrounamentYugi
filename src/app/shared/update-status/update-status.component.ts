import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { BackgroundUpdateService, UpdateStatus } from '../../core/services/background-update.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css']
})
export class UpdateStatusComponent implements OnInit, OnDestroy {
  updateStatus: UpdateStatus;
  private updateSubscription: Subscription | null = null;
  private backgroundUpdateService: BackgroundUpdateService;

  constructor(private injector: Injector) {
    // Lazy injection to avoid circular dependency
    this.backgroundUpdateService = this.injector.get(BackgroundUpdateService);
    this.updateStatus = this.backgroundUpdateService.getUpdateStatus();
  }

  ngOnInit(): void {
    // Delay subscription slightly to ensure service is fully initialized
    setTimeout(() => {
      this.updateSubscription = this.backgroundUpdateService.updateStatus$.subscribe(
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
    return this.backgroundUpdateService.formatTime(date);
  }
}

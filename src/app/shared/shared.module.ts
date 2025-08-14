import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InboxComponent } from '../admin/inbox/inbox.component';
import { FloatingInboxComponent } from './floating-inbox/floating-inbox.component';
import { MessageService } from '../core/services/message.service';
import { AdminDashboardService } from '../core/services/admin-dashboard.service';

@NgModule({
  declarations: [InboxComponent, FloatingInboxComponent],
  imports: [CommonModule, FormsModule],
  exports: [InboxComponent, FloatingInboxComponent],
  providers: [MessageService, AdminDashboardService],
})
export class SharedModule {}

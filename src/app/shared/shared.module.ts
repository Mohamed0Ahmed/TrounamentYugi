import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateStatusComponent } from './update-status/update-status.component';
import { AdminUpdateStatusComponent } from './admin-update-status/admin-update-status.component';

@NgModule({
  declarations: [UpdateStatusComponent, AdminUpdateStatusComponent],
  imports: [CommonModule],
  exports: [UpdateStatusComponent, AdminUpdateStatusComponent],
})
export class SharedModule {}

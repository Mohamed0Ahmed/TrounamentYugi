import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    // ✅ تم حذف UpdateStatusComponent و AdminUpdateStatusComponent - مالهمش لازمة
  ],
  imports: [CommonModule],
  exports: [
    // ✅ تم تنظيف exports
  ],
})
export class SharedModule {}

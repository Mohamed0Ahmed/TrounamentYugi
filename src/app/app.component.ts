import { Component, OnInit } from '@angular/core';
import { PerformanceOptimizationService } from './core/services/performance-optimization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'YugiTournamnet';

  constructor(
    private performanceOptimization: PerformanceOptimizationService
  ) {}

  ngOnInit(): void {
    // تطبيق جميع تحسينات الأداء
    this.performanceOptimization.applyAllOptimizations();

    // بدء مراقبة الأداء
    this.performanceOptimization.monitorPerformance();
  }
}

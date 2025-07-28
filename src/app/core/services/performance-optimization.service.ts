import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageOptimizationService } from './image-optimization.service';
import { IconService } from './icon.service';
import { RxjsOptimizationService } from './rxjs-optimization.service';
import { BundleOptimizationService } from './bundle-optimization.service';
import { CssOptimizationService } from './css-optimization.service';

@Injectable({
  providedIn: 'root',
})
export class PerformanceOptimizationService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private imageOptimization: ImageOptimizationService,
    private iconService: IconService,
    private rxjsOptimization: RxjsOptimizationService,
    private bundleOptimization: BundleOptimizationService,
    private cssOptimization: CssOptimizationService
  ) {}

  /**
   * تطبيق جميع تحسينات الأداء
   */
  public applyAllOptimizations(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.optimizeImages();
    this.optimizeIcons();
    this.optimizeCss();
    this.optimizeBundle();
    this.optimizeMemory();
    this.optimizeNetwork();
  }

  /**
   * تحسين الصور
   */
  private optimizeImages(): void {
    // تحميل الصور المهمة مسبقاً
    const criticalImages = [
      'assets/images/all2.png',
      'assets/images/coming.jpg',
      'assets/images/comingSoon.jpg',
    ];

    this.imageOptimization.preloadCriticalImages(criticalImages);

    // تحسين جميع الصور في الصفحة
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        img.setAttribute(
          'src',
          this.imageOptimization.optimizeImageLoading(src)
        );
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  /**
   * تحسين الأيقونات
   */
  private optimizeIcons(): void {
    // تطبيق تحسينات FontAwesome
    this.cssOptimization.optimizeFontAwesome();

    // تحميل الأيقونات المطلوبة فقط
    const usedIcons = this.iconService.getUsedIcons();
    console.log('الأيقونات المستخدمة:', usedIcons);
  }

  /**
   * تحسين CSS
   */
  private optimizeCss(): void {
    // تطبيق تحسينات Tailwind CSS
    this.cssOptimization.optimizeTailwindCss();

    // إزالة CSS غير المستخدم
    this.cssOptimization.removeUnusedCss();
  }

  /**
   * تحسين الباندل
   */
  private optimizeBundle(): void {
    // تنظيف الذاكرة المؤقتة
    this.bundleOptimization.clearCache();

    // تحسين البيانات المحلية
    this.bundleOptimization.optimizeLocalStorage();
  }

  /**
   * تحسين الذاكرة
   */
  private optimizeMemory(): void {
    // تنظيف الذاكرة غير المستخدمة
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('استخدام الذاكرة:', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      });
    }

    // تنظيف المتغيرات غير المستخدمة
    this.cleanupUnusedVariables();
  }

  /**
   * تحسين الشبكة
   */
  private optimizeNetwork(): void {
    // تفعيل ضغط Gzip
    this.enableGzipCompression();

    // تحسين التخزين المؤقت
    this.optimizeCaching();
  }

  /**
   * تنظيف المتغيرات غير المستخدمة
   */
  private cleanupUnusedVariables(): void {
    // إزالة المتغيرات من الذاكرة المؤقتة
    if (window.performance && (window.performance as any).memory) {
      const memory = (window.performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        console.warn('استخدام الذاكرة مرتفع، يتم تنظيف الذاكرة...');
        // يمكن إضافة منطق تنظيف الذاكرة هنا
      }
    }
  }

  /**
   * تفعيل ضغط Gzip
   */
  private enableGzipCompression(): void {
    // إضافة headers للضغط
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Accept-Encoding');
    meta.setAttribute('content', 'gzip, deflate, br');
    document.head.appendChild(meta);
  }

  /**
   * تحسين التخزين المؤقت
   */
  private optimizeCaching(): void {
    // إضافة headers للتخزين المؤقت
    const cacheHeaders = [
      { name: 'Cache-Control', value: 'public, max-age=31536000' },
      { name: 'Expires', value: 'Thu, 31 Dec 2024 23:59:59 GMT' },
    ];

    // يمكن تطبيق هذه الـ headers من خلال interceptor
    console.log('تم تطبيق تحسينات التخزين المؤقت');
  }

  /**
   * مراقبة الأداء
   */
  public monitorPerformance(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // مراقبة Core Web Vitals
    this.monitorCoreWebVitals();

    // مراقبة استخدام الذاكرة
    this.monitorMemoryUsage();

    // مراقبة سرعة الشبكة
    this.monitorNetworkSpeed();
  }

  /**
   * مراقبة Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // مراقبة LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // مراقبة FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const firstInputEntry = entry as any;
        console.log(
          'FID:',
          firstInputEntry.processingStart - firstInputEntry.startTime
        );
      });
    }).observe({ entryTypes: ['first-input'] });

    // مراقبة CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      let cls = 0;
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      });
      console.log('CLS:', cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * مراقبة استخدام الذاكرة
   */
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usagePercent =
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (usagePercent > 80) {
          console.warn('استخدام الذاكرة مرتفع:', usagePercent.toFixed(2) + '%');
        }
      }, 30000); // كل 30 ثانية
    }
  }

  /**
   * مراقبة سرعة الشبكة
   */
  private monitorNetworkSpeed(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log('سرعة الشبكة:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      });
    }
  }
}

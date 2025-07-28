import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BundleOptimizationService {
  /**
   * تحسين تحميل المكونات بشكل تدريجي
   */
  public async loadComponentLazy(componentPath: string): Promise<any> {
    try {
      const module = await import(componentPath);
      return module;
    } catch (error) {
      console.error('خطأ في تحميل المكون:', error);
      throw error;
    }
  }

  /**
   * تحسين تحميل الخدمات بشكل تدريجي
   */
  public async loadServiceLazy(servicePath: string): Promise<any> {
    try {
      const service = await import(servicePath);
      return service;
    } catch (error) {
      console.error('خطأ في تحميل الخدمة:', error);
      throw error;
    }
  }

  /**
   * تحسين تحميل الصور بشكل تدريجي
   */
  public preloadImages(imageUrls: string[]): void {
    const imagePromises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`فشل تحميل الصورة: ${url}`));
        img.src = url;
      });
    });

    Promise.all(imagePromises)
      .then(() => console.log('تم تحميل جميع الصور بنجاح'))
      .catch((error) => console.error('خطأ في تحميل الصور:', error));
  }

  /**
   * تحسين تحميل CSS بشكل تدريجي
   */
  public loadCssLazy(cssUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`فشل تحميل CSS: ${cssUrl}`));
      document.head.appendChild(link);
    });
  }

  /**
   * تحسين تحميل JavaScript بشكل تدريجي
   */
  public loadScriptLazy(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error(`فشل تحميل JavaScript: ${scriptUrl}`));
      document.head.appendChild(script);
    });
  }

  /**
   * تنظيف الذاكرة المؤقتة
   */
  public clearCache(): void {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  }

  /**
   * تحسين حجم البيانات المحلية
   */
  public optimizeLocalStorage(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value && value.length > 1000) {
          // ضغط البيانات الكبيرة
          const compressed = this.compressData(value);
          localStorage.setItem(key, compressed);
        }
      } catch (error) {
        console.error('خطأ في تحسين localStorage:', error);
      }
    });
  }

  /**
   * ضغط البيانات
   */
  private compressData(data: string): string {
    // استخدام LZString أو خوارزمية ضغط بسيطة
    return btoa(data);
  }
}

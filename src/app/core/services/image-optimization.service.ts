import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageOptimizationService {
  /**
   * تحسين تحميل الصور باستخدام lazy loading
   */
  public optimizeImageLoading(imagePath: string): string {
    // إضافة معاملات تحسين للصور
    return `${imagePath}?optimize=true&quality=85`;
  }

  /**
   * تحويل الصور إلى WebP إذا كان المتصفح يدعمها
   */
  public getOptimizedImageFormat(imagePath: string): string {
    const supportsWebP = this.checkWebPSupport();
    if (supportsWebP) {
      return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return imagePath;
  }

  /**
   * التحقق من دعم WebP
   */
  private checkWebPSupport(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * تحميل الصور بشكل تدريجي
   */
  public preloadCriticalImages(imagePaths: string[]): void {
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = this.optimizeImageLoading(path);
    });
  }
}

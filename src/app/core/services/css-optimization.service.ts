import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CssOptimizationService {
  /**
   * تحميل CSS بشكل تدريجي
   */
  public loadCssLazy(cssUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[href="${cssUrl}"]`)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`فشل تحميل CSS: ${cssUrl}`));
      document.head.appendChild(link);
    });
  }

  /**
   * إزالة CSS غير المستخدم
   */
  public removeUnusedCss(): void {
    const unusedSelectors = [
      '.unused-class',
      '.deprecated-style',
      '.old-version',
    ];

    unusedSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.classList.remove(selector.substring(1));
      });
    });
  }

  /**
   * تحسين تحميل FontAwesome
   */
  public optimizeFontAwesome(): void {
    // تحميل الأيقونات المطلوبة فقط
    const requiredIcons = [
      'fa-user',
      'fa-trophy',
      'fa-users',
      'fa-envelope',
      'fa-calendar',
      'fa-clock',
      'fa-check',
      'fa-times',
      'fa-edit',
      'fa-trash',
      'fa-plus',
      'fa-minus',
      'fa-arrow-left',
      'fa-arrow-right',
      'fa-home',
      'fa-cog',
      'fa-search',
    ];

    // إضافة CSS للأيقونات المطلوبة فقط
    const style = document.createElement('style');
    style.textContent = requiredIcons
      .map(
        (icon) => `
      .${icon}::before {
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
      }
    `
      )
      .join('');
    document.head.appendChild(style);
  }

  /**
   * تحسين تحميل Tailwind CSS
   */
  public optimizeTailwindCss(): void {
    // إزالة الأنماط غير المستخدمة من Tailwind
    const unusedTailwindClasses = [
      'hidden',
      'invisible',
      'opacity-0',
      'scale-0',
      'rotate-0',
    ];

    // إضافة CSS محسن
    const style = document.createElement('style');
    style.textContent = `
      /* تحسينات Tailwind CSS */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .btn {
        @apply px-4 py-2 rounded font-medium transition-colors;
      }

      .btn-primary {
        @apply bg-blue-600 text-white hover:bg-blue-700;
      }

      .btn-secondary {
        @apply bg-gray-600 text-white hover:bg-gray-700;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * ضغط CSS
   */
  public compressCss(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // إزالة التعليقات
      .replace(/\s+/g, ' ') // ضغط المسافات
      .replace(/;\s*}/g, '}') // إزالة الفاصلة المنقوطة الأخيرة
      .replace(/:\s+/g, ':') // إزالة المسافات بعد النقطتين
      .replace(/;\s+/g, ';') // إزالة المسافات بعد الفاصلة المنقوطة
      .trim();
  }
}

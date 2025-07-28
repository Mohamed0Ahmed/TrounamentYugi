import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  /**
   * استيراد الأيقونات المطلوبة فقط من FontAwesome
   */
  public getIconClass(
    iconName: string,
    iconType: 'fas' | 'far' | 'fab' = 'fas'
  ): string {
    return `${iconType} fa-${iconName}`;
  }

  /**
   * قائمة الأيقونات المستخدمة في التطبيق
   */
  public getUsedIcons(): string[] {
    return [
      'user',
      'sign-out-alt',
      'trophy',
      'users',
      'envelope',
      'calendar',
      'clock',
      'check',
      'times',
      'edit',
      'trash',
      'plus',
      'minus',
      'arrow-left',
      'arrow-right',
      'home',
      'cog',
      'search',
    ];
  }
}

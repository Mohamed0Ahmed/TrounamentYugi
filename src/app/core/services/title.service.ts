import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly defaultTitle = 'Yugi-Oh Tournament';

  constructor(private router: Router, private titleService: Title) {
    this.initializeTitleUpdates();
  }

  private initializeTitleUpdates(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getCurrentRouteTitle())
      )
      .subscribe((title) => {
        this.setTitle(title);
      });
  }

  private getCurrentRouteTitle(): string {
    let route = this.router.routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const title = route.snapshot.data['title'];
    return title || this.defaultTitle;
  }

  private setTitle(title: string): void {
    const fullTitle =
      title === this.defaultTitle ? title : `${title} `;
    this.titleService.setTitle(fullTitle);
  }

  public setCustomTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  public resetToDefault(): void {
    this.titleService.setTitle(this.defaultTitle);
  }
}

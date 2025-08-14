import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TitleStrategyService {
  private readonly defaultTitle = 'Yugi-Oh Tournament';

  constructor(private title: Title, private router: Router) {
    // Set initial title
    this.title.setTitle(this.defaultTitle);
    this.setupTitleUpdates();
  }

  private setupTitleUpdates(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Add a small delay to ensure route data is available
        setTimeout(() => {
          this.updateTitle();
        }, 50);
      });
  }

  private updateTitle(): void {
    const currentRoute = this.getCurrentRoute();

    if (currentRoute?.snapshot?.data?.['title']) {
      const newTitle = currentRoute.snapshot.data['title'];
      this.title.setTitle(newTitle);
    } else {
      this.title.setTitle(this.defaultTitle);
    }
  }

  private getCurrentRoute(): any {
    let route = this.router.routerState.root;

    // Navigate through all child routes to find the deepest one
    while (route.firstChild) {
      route = route.firstChild;
    }

    // Also check the current activated route for additional data
    let currentActivatedRoute = this.router.routerState.root;
    while (currentActivatedRoute.firstChild) {
      currentActivatedRoute = currentActivatedRoute.firstChild;
    }

    // Try to get title from the deepest route first
    if (route?.snapshot?.data?.['title']) {
      return route;
    }

    // If no title in deepest route, check the activated route
    if (currentActivatedRoute?.snapshot?.data?.['title']) {
      return currentActivatedRoute;
    }

    // If still no title, return the deepest route
    return route;
  }

  setTitle(title: string): void {
    if (title) {
      const newTitle = title;
      this.title.setTitle(newTitle);
    } else {
      this.title.setTitle(this.defaultTitle);
    }
  }
}

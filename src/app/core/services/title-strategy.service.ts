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
    console.log('TitleStrategyService initialized');
    // Set initial title
    this.title.setTitle(this.defaultTitle);
    this.setupTitleUpdates();
  }

  private setupTitleUpdates(): void {
    console.log('Setting up title updates');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        console.log('NavigationEnd event:', event);
        // Add a small delay to ensure route data is available
        setTimeout(() => {
          this.updateTitle();
        }, 50);
      });
  }

  private updateTitle(): void {
    console.log('Updating title...');
    const currentRoute = this.getCurrentRoute();
    console.log('Current route:', currentRoute);
    console.log('Current route data:', currentRoute?.snapshot?.data);

    if (currentRoute?.snapshot?.data?.['title']) {
      const newTitle = currentRoute.snapshot.data['title'];
      console.log('Setting title to:', newTitle);
      this.title.setTitle(newTitle);
    } else {
      console.log('Setting default title:', this.defaultTitle);
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

    console.log('Final route:', route);
    console.log('Current activated route:', currentActivatedRoute);

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
      console.log('Manual title set to:', newTitle);
      this.title.setTitle(newTitle);
    } else {
      console.log('Setting default title:', this.defaultTitle);
      this.title.setTitle(this.defaultTitle);
    }
  }
}

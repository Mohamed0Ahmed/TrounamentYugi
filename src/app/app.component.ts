import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'YugiTournamnet';
  navbarHeight = 80; // default height

  onNavbarHeightChange(height: number): void {
    this.navbarHeight = height;
  }
}

import { Component, OnInit } from '@angular/core';
import { TitleStrategyService } from './core/services/title-strategy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Yugi-Oh Tournament';
  navbarHeight = 80; // default height

  constructor(private titleStrategy: TitleStrategyService) {}

  ngOnInit(): void {
    // Initialize title strategy with a small delay to ensure router is ready
    setTimeout(() => {
      this.titleStrategy.setTitle('');
    }, 100);
  }

  onNavbarHeightChange(height: number): void {
    this.navbarHeight = height;
  }
}

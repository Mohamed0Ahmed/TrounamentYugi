import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TitleStrategyService } from './core/services/title-strategy.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Yugi-Oh Tournament';
  navbarHeight = 80; // default height

  // Floating admin inbox properties
  isAdmin = false;
  showInboxOverlay = false;
  buttonPosition = { x: 20, y: 20 };
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  hasMovedDuringDrag = false;
  unreadCount = 0; // Number of unread messages

  constructor(
    private titleStrategy: TitleStrategyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize title strategy with a small delay to ensure router is ready
    setTimeout(() => {
      this.titleStrategy.setTitle('');
    }, 100);

    // Check if user is admin
    this.checkAdminStatus();

    // Set initial position for floating button (bottom-right corner)
    this.setInitialButtonPosition();
  }

  ngOnDestroy(): void {
    // Clean up
    this.isDragging = false;
    this.showInboxOverlay = false;
    document.body.style.cursor = 'default';
    document.body.classList.remove('dragging');

    // Remove any global event listeners
    document.removeEventListener(
      'mousemove',
      this.onGlobalMouseMove.bind(this)
    );
    document.removeEventListener('mouseup', this.onGlobalMouseUp.bind(this));
  }

  checkAdminStatus(): void {
    try {
      const role = this.authService.getRole();
      this.isAdmin = role === 'Admin';
    } catch (error) {
      console.warn('Error checking admin status:', error);
      this.isAdmin = false;
    }
  }

  toggleInboxOverlay(): void {
    // Only toggle if not dragging and didn't move during drag
    if (!this.isDragging && !this.hasMovedDuringDrag) {
      this.showInboxOverlay = !this.showInboxOverlay;

      // Fix navbar height for overlay after component is rendered
      if (this.showInboxOverlay) {
        setTimeout(() => {
          this.fixInboxComponentForOverlay();
        }, 100);
      }
    }
  }

  fixInboxComponentForOverlay(): void {
    // Find the inbox component and reset its navbarHeight
    const inboxElement = document.querySelector('.overlay-enter app-inbox');
    if (inboxElement) {
      // Reset inline styles that depend on navbarHeight
      const elementsWithMarginTop = inboxElement.querySelectorAll(
        '[style*="margin-top"]'
      );
      elementsWithMarginTop.forEach((el: any) => {
        el.style.marginTop = '0px';
      });

      const elementsWithTop = inboxElement.querySelectorAll('[style*="top"]');
      elementsWithTop.forEach((el: any) => {
        el.style.top = '0px';
      });
    }
  }

  closeInboxOverlay(): void {
    this.showInboxOverlay = false;
  }

  setInitialButtonPosition(): void {
    // Try to load saved position from localStorage
    const savedPosition = localStorage.getItem('adminInboxButtonPosition');

    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        // Validate the saved position is within current screen bounds
        const margin = 24;
        const buttonSize = 48;
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        if (
          parsedPosition.x >= margin &&
          parsedPosition.x <= maxX &&
          parsedPosition.y >= margin &&
          parsedPosition.y <= maxY
        ) {
          this.buttonPosition = parsedPosition;
          return;
        }
      } catch (error) {
        console.warn('Error parsing saved button position:', error);
      }
    }

    // Fallback to default position (bottom-right corner)
    const margin = 24;
    const buttonSize = 48;
    const maxX = window.innerWidth - buttonSize - margin;
    const maxY = window.innerHeight - buttonSize - margin;

    this.buttonPosition = {
      x: Math.max(margin, maxX),
      y: Math.max(margin, maxY),
    };
  }

  // Dragging functionality for the floating button
  onButtonMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.hasMovedDuringDrag = false; // Reset movement flag
    this.dragOffset = {
      x: event.clientX - this.buttonPosition.x,
      y: event.clientY - this.buttonPosition.y,
    };
    event.preventDefault();
    event.stopPropagation();
    document.body.style.cursor = 'grabbing';

    // Add dragging class to body for global styling
    document.body.classList.add('dragging');
  }

  // Touch support for mobile devices
  onButtonTouchStart(event: TouchEvent): void {
    this.isDragging = true;
    this.hasMovedDuringDrag = false; // Reset movement flag

    const touch = event.touches[0];
    this.dragOffset = {
      x: touch.clientX - this.buttonPosition.x,
      y: touch.clientY - this.buttonPosition.y,
    };

    event.preventDefault();
    event.stopPropagation();
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('dragging');
  }

  @HostListener('document:mousemove', ['$event'])
  onGlobalMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      requestAnimationFrame(() => {
        const newX = event.clientX - this.dragOffset.x;
        const newY = event.clientY - this.dragOffset.y;

        // Check if position actually changed (moved more than 5px)
        const oldX = this.buttonPosition.x;
        const oldY = this.buttonPosition.y;

        // Boundary limits (prevent going outside screen)
        const margin = 24;
        const buttonSize = 48; // Updated button size
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        const finalX = Math.max(margin, Math.min(newX, maxX));
        const finalY = Math.max(margin, Math.min(newY, maxY));

        // If moved more than 5px, consider it a drag
        if (Math.abs(finalX - oldX) > 5 || Math.abs(finalY - oldY) > 5) {
          this.hasMovedDuringDrag = true;
        }

        this.buttonPosition = {
          x: finalX,
          y: finalY,
        };

        // Save new position to localStorage
        this.saveButtonPosition();
      });
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onGlobalTouchMove(event: TouchEvent): void {
    if (this.isDragging) {
      requestAnimationFrame(() => {
        const touch = event.touches[0];
        const newX = touch.clientX - this.dragOffset.x;
        const newY = touch.clientY - this.dragOffset.y;

        // Check if position actually changed (moved more than 5px)
        const oldX = this.buttonPosition.x;
        const oldY = this.buttonPosition.y;

        // Boundary limits (prevent going outside screen)
        const margin = 24;
        const buttonSize = 48; // Updated button size
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        const finalX = Math.max(margin, Math.min(newX, maxX));
        const finalY = Math.max(margin, Math.min(newY, maxY));

        // If moved more than 5px, consider it a drag
        if (Math.abs(finalX - oldX) > 5 || Math.abs(finalY - oldY) > 5) {
          this.hasMovedDuringDrag = true;
        }

        this.buttonPosition = {
          x: finalX,
          y: finalY,
        };

        // Save new position to localStorage
        this.saveButtonPosition();
      });
    }
  }

  @HostListener('document:mouseup')
  onGlobalMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      document.body.style.cursor = 'default';
      document.body.classList.remove('dragging');

      // Reset movement flag after a short delay to prevent accidental clicks
      setTimeout(() => {
        this.hasMovedDuringDrag = false;
      }, 100);
    }
  }

  @HostListener('document:touchend')
  onGlobalTouchEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      document.body.style.cursor = 'default';
      document.body.classList.remove('dragging');

      // Reset movement flag after a short delay to prevent accidental clicks
      setTimeout(() => {
        this.hasMovedDuringDrag = false;
      }, 100);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // Adjust button position if outside new screen bounds
    const margin = 24;
    const buttonSize = 48; // Updated button size
    const maxX = window.innerWidth - buttonSize - margin;
    const maxY = window.innerHeight - buttonSize - margin;

    this.buttonPosition = {
      x: Math.max(margin, Math.min(this.buttonPosition.x, maxX)),
      y: Math.max(margin, Math.min(this.buttonPosition.y, maxY)),
    };
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showInboxOverlay) {
      this.showInboxOverlay = false;
    }
  }

  onNavbarHeightChange(height: number): void {
    this.navbarHeight = height;
  }

  // Save button position to localStorage
  private saveButtonPosition(): void {
    try {
      localStorage.setItem(
        'adminInboxButtonPosition',
        JSON.stringify(this.buttonPosition)
      );
    } catch (error) {
      console.warn('Error saving button position to localStorage:', error);
    }
  }
}

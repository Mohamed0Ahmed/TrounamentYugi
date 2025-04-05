import { Component } from '@angular/core';
import { AuthService } from '../../app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.isAdmin = this.authService.getRole() === 'Admin';
    });
  }

  openSendMessage() {
    if (!this.isLoggedIn) {
      this.toastr.error('أنت مش مسجل، لازم تسجل دخول');
    } else if (this.isAdmin) {
      this.toastr.info('الـ Admin مش بيبعت رسايل');
    } else {
      this.router.navigate(['/player/send-message']);
    }
  }

  logout() {
    this.authService.logout();
    this.toastr.success('تم تسجيل الخروج بنجاح');
    this.router.navigate(['/player']);
  }
}

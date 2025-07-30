import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  phoneNumber: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  register() {
    if (!this.phoneNumber || !this.password || !this.firstName || !this.lastName) {
      this.toastr.error('من فضلك أدخل كل البيانات');
      return;
    }

    this.authService.register(this.phoneNumber, this.password, this.firstName, this.lastName).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('تم التسجيل بنجاح، سجل دخول الآن');
          this.router.navigate(['/auth/login']);
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      }
    });
  }
}

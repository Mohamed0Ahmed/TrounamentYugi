import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  isAdminLogin: boolean = false;
  showPassword: boolean = false;

  isResetPasswordModalOpen: boolean = false;
  resetPhoneNumber: string = '';
  newPassword: string = '';
  showNewPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  toggleLoginType() {
    this.isAdminLogin = !this.isAdminLogin;
    this.email = '';
    this.phoneNumber = '';
    this.password = '';
  }

  login() {
    if (this.isAdminLogin) {
      // Admin Login
      if (!this.email || !this.password) {
        this.toastr.error('من فضلك أدخل الإيميل والباسورد');
        return;
      }
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('تم تسجيل الدخول بنجاح');
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        },
      });
    } else {
      // Player Login
      if (!this.phoneNumber || !this.password) {
        this.toastr.error('من فضلك أدخل رقم التليفون والباسورد');
        return;
      }
      this.authService.playerLogin(this.phoneNumber, this.password).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('تم تسجيل الدخول بنجاح');
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        },
      });
    }
  }

  // 🌟 فتح وإغلاق المودال
  openResetPasswordModal() {
    this.isResetPasswordModalOpen = true;
  }

  closeResetPasswordModal() {
    this.isResetPasswordModalOpen = false;
    this.resetPhoneNumber = '';
    this.newPassword = '';
  }

  // 🌟 تنفيذ إعادة تعيين كلمة السر
  resetPassword() {
    if (!this.resetPhoneNumber || !this.newPassword) {
      this.toastr.error('من فضلك أدخل رقم التليفون وكلمة السر الجديدة');
      return;
    }

    this.authService
      .resetPassword(this.resetPhoneNumber, this.newPassword)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('تمت إعادة تعيين كلمة السر بنجاح');
            this.closeResetPasswordModal();
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          this.toastr.error('حصل خطأ أثناء إعادة تعيين كلمة السر');
          console.error(err);
        },
      });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Toggle new password visibility
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
}

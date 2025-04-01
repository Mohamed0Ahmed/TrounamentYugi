
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CommonResponse, LoginResponse } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userRole: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userRole = this.getRoleFromToken(token);
      this.isLoggedInSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          this.userRole = this.getRoleFromToken(response.token);

          this.isLoggedInSubject.next(true);
          if (this.userRole === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/player']);
          }
        }
      })
    );
  }

  playerLogin(phoneNumber: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/player-login`, { phoneNumber, password }).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          this.userRole = this.getRoleFromToken(response.token);


          this.isLoggedInSubject.next(true);
          this.router.navigate(['/player']);
          console.log (this.userRole);

        }
      })
    );
  }

  register(phoneNumber: string, password: string, firstName: string, lastName: string): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(`${this.baseUrl}/auth/register-player`, { phoneNumber, password, firstName, lastName });
  }

  resetPassword(phoneNumber: string, newPassword: string): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(`${this.baseUrl}/auth/reset-password`, { phoneNumber, newPassword });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userRole = null;
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/player']);
  }

  getRole(): string | null {
    return this.userRole;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] || null;
    } catch (e) {
      return null;
    }
  }
}

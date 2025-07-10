import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '';
  private token$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const isLocalhost = window.location.hostname === 'localhost';
    this.baseUrl = isLocalhost
      ? 'http://localhost:3000/api/auth'
      : 'https://backend-plant-website.vercel.app/api/auth';

    // ✅ Load token from localStorage on app load (if exists)
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token$.next(savedToken);
    }
  }

  // USER SIGNUP
  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  // USER LOGIN
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => {
        this.token$.next(res.token);
        localStorage.setItem('token', res.token); // ✅ save token
        localStorage.setItem('user', JSON.stringify({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: 'user'
        }));
      })
    );
  }

  // ADMIN SIGNUP
  signupAdmin(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/admin/signup`, data);
  }

  // ADMIN LOGIN
  loginAdmin(data: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/admin/login`, data).pipe(
      tap((res: any) => {
        this.token$.next(res.token);
        localStorage.setItem('token', res.token); // ✅ save token
        localStorage.setItem('user', JSON.stringify({
          id: res.admin.id,
          name: res.admin.name,
          email: res.admin.email,
          role: 'admin'
        }));
      })
    );
  }

  // ✅ GET token observable (for interceptor or guards)
  getToken(): Observable<string | null> {
    return this.token$.asObservable();
  }

  // ✅ GET raw token (for immediate header injection)
  getRawToken(): string | null {
    return this.token$.getValue();
  }

  // ✅ Get user ID from localStorage
  getUserId(): number | null {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    return userData ? userData.id : null;
  }

  // ✅ Get user role
  getUserRole(): 'user' | 'admin' | null {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    return userData ? userData.role : null;
  }

  // ✅ Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token$.getValue();
  }

  // ✅ Logout method
  logout(): void {
    this.token$.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

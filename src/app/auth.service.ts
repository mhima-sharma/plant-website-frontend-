import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private token$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => {
        this.token$.next(res.token);
        // ✅ Store user ID in localStorage (user object)
        localStorage.setItem('user', JSON.stringify({
          id: res.user.id,
          name: res.user.name
        }));
      })
    );
  }

  signupAdmin(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/admin/signup`, data);
  }

  loginAdmin(data: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/admin/login`, data).pipe(
      tap((res: any) => {
        this.token$.next(res.token);
        localStorage.setItem('user', JSON.stringify({
          id: res.admin.id,
          name: res.admin.name
        }));
      })
    );
  }

  getUserId(): number | null {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    return userData ? userData.id : null;
  }

  getToken(): Observable<string | null> {
    return this.token$.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.token$.getValue();
  }

  logout(): void {
    this.token$.next(null);
    localStorage.removeItem('user');
  }
}

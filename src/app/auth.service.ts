import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private token$ = new BehaviorSubject<string | null>(null); // In-memory token

  constructor(private http: HttpClient) {}

  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => this.token$.next(res.token))
    );
  }

  getToken(): Observable<string | null> {
    return this.token$.asObservable();
  }

  logout(): void {
    this.token$.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.token$.getValue();
  }
  signupAdmin(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/admin/signup`, data);
  }
  loginAdmin(data: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/admin/login`, data);
  }
}


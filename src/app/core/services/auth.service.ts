import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse, UserSession } from '../../shared/models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  isLoggedIn = signal<boolean>(false);
  currentUser = signal<UserSession | null>(null);

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('currentUser');
      if (token) {
        this.isLoggedIn.set(true);
        if (userStr) {
          try {
            this.currentUser.set(JSON.parse(userStr));
          } catch (e) {
            this.currentUser.set(null);
          }
        }
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('https://dummyjson.com/auth/login', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(response => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('accessToken', response.accessToken);
          const sessionUser: UserSession = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            image: response.image
          };
          localStorage.setItem('currentUser', JSON.stringify(sessionUser));
          this.currentUser.set(sessionUser);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }
}

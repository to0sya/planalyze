import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem(this.userKey);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  //${environment.apiUrl}
  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`/auth/login`, { email, password })
      .pipe(
        tap(response => this.setSession(response)),
        map(response => response.user)
      );
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<AuthResponse>(`/auth/register`, registerData)
      .pipe(
        map(response => response.user)
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<boolean> {
    return this.http.post<AuthResponse>(`/auth/refresh-token`, {})
      .pipe(
        tap(response => this.setSession(response)),
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }
}

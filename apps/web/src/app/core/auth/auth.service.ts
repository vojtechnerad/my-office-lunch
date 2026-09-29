import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from 'contracts/auth.contracts';
import { BACKEND_URL } from '../../shared/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  public isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('token'));
  }

  public signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['auth']);
  }

  public signIn(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${BACKEND_URL}/login`, {
        email,
        password,
      })
      .pipe(
        tap(async (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.name);
          localStorage.setItem('id', response.id);

          // Prompt user to save credentials after successful login
          if ('credentials' in navigator && 'PasswordCredential' in window) {
            const cred = new (window as any).PasswordCredential({
              id: email,
              password,
              name: email,
            });
            await navigator.credentials.store(cred);
          }

          this.router.navigate(['/']);
        }),
      );
  }
}

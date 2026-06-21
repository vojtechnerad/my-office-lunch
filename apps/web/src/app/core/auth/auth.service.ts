import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from 'contracts/auth.contracts';

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
      .post<LoginResponse>('http://localhost:3000/login', {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.name);
          localStorage.setItem('id', response.id);
          this.router.navigate(['/']);
        }),
      );
  }
}

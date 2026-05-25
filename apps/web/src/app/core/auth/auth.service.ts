import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

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

  public signIn(
    email: string,
    password: string,
  ): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>('http://localhost:3000/login', {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
        }),
      );
  }
}

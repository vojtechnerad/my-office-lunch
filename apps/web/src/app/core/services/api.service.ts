import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000';

  private readonly http = inject(HttpClient);

  public getGroups() {
    return this.http.get(`${this.apiUrl}/groups`);
  }
}

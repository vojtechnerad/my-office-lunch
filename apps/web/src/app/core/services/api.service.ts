import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListRestaurantsResponse } from 'contracts/restaurants.contracts';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000';

  private readonly http = inject(HttpClient);

  public getGroups() {
    return this.http.get(`${this.apiUrl}/groups`);
  }

  public getGroupById(groupId: string) {
    return this.http.get(`${this.apiUrl}/groups/${groupId}`);
  }

  public joinGroup(groupId: string) {
    return this.http.post(`${this.apiUrl}/groups/${groupId}/join`, {});
  }

  public myGroups() {
    return this.http.get<Array<{ id: string; name: string }>>(
      `${this.apiUrl}/groups/my`,
    );
  }

  public getRestaurants(): Observable<ListRestaurantsResponse> {
    return this.http.get<ListRestaurantsResponse>(`${this.apiUrl}/restaurants`);
  }

  public createRestaurant(restaurant: {
    name: string;
    url: string;
    dailyMenuUrl: string;
  }) {
    return this.http.post(`${this.apiUrl}/restaurants`, restaurant);
  }

  public getRestaurantDetails(restaurantId: string): Observable<{
    id: string;
    name: string;
    dailyMenuUrl?: string;
    url?: string;
  }> {
    return this.http.get<{
      id: string;
      name: string;
      dailyMenuUrl?: string;
      url?: string;
    }>(`${this.apiUrl}/restaurants/${restaurantId}`);
  }

  public deleteRestaurant(restaurantId: string) {
    return this.http.delete(`${this.apiUrl}/restaurants/${restaurantId}`);
  }
}

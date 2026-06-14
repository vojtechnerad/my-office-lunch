import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mol-restaurant-details',
  imports: [],
  templateUrl: './restaurant-details.html',
  styleUrl: './restaurant-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantDetails implements OnInit {
  protected readonly restaurant = signal<{
    id: string;
    name: string;
    dailyMenuUrl?: string;
    url?: string;
  } | null>(null);

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  ngOnInit() {
    const restaurantId = this.route.snapshot.paramMap.get('restaurantId');

    if (restaurantId) {
      this.apiService
        .getRestaurantDetails(restaurantId)
        .subscribe((restaurant) => {
          this.restaurant.set(restaurant);
        });
    }
  }
}

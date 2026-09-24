import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TRestaurantDetails } from '../types/restaurant-details.type';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'mol-restaurant-details',
  imports: [NzButtonModule, HlmButtonImports, HlmFieldImports, HlmInputImports],
  templateUrl: './restaurant-details.html',
  styleUrl: './restaurant-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantDetails implements OnInit {
  protected readonly mode = signal<'new' | 'edit'>('new');
  protected readonly restaurant = signal<TRestaurantDetails | null>(null);

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  ngOnInit() {
    const restaurantId = this.route.snapshot.paramMap.get('restaurantId');

    if (restaurantId) {
      this.mode.set('edit');

      this.apiService
        .getRestaurantDetails(restaurantId)
        .subscribe((restaurant) => {
          this.restaurant.set(restaurant);
        });
    }
  }

  protected handleDeleteRestaurant(restaurantId: string | undefined): void {
    if (restaurantId) {
      this.apiService.deleteRestaurant(restaurantId).subscribe(() => {
        this.restaurant.set(null);
      });
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzListModule } from 'ng-zorro-antd/list';

@Component({
  selector: 'mol-restaurants',
  imports: [NzListModule],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Restaurants implements OnInit {
  protected readonly restaurants = signal<Array<{ id: string; name: string }>>(
    [],
  );

  private readonly apiService = inject(ApiService);

  ngOnInit() {
    this.apiService.getRestaurants().subscribe((restaurants) => {
      this.restaurants.set(restaurants);
    });
  }
}
